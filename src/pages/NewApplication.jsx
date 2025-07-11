import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const getDisplayFileType = (mimeType) => {
  const typeMap = {
    'application/pdf': 'PDF',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'text/plain': 'TXT'
  };
  return typeMap[mimeType] || mimeType.split('/').pop().toUpperCase();
};

export default function NewApplication() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: '',
    jobTitle: '',
    dateApplied: new Date().toISOString().slice(0, 10),
    postingDate: '',
    closingDate: '',
    jobLocation: '',
    employmentType: 'Full-time',
    workModel: 'Remote',
    status: 'Pending',
    salaryRange: '',
    description: '',
    followUpDate: '',
    interviewScheduled: false,
    interviewDate: '',
    resumeId: '',
    useExisting: 'upload'
  });

  const [resumes, setResumes] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('https://jat.azurewebsites.net/api/resumes', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setResumes(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load resumes', err);
        setIsLoading(false);
      });
  }, []);

  const onChange = e => {
    const { name, value, type, checked } = e.target;

    if (name === 'interviewScheduled') {
      setForm(f => ({ ...f, [name]: checked }));
    } else if (name === 'useExisting') {
      setForm(f => ({
        ...f,
        useExisting: value,
        resumeFile: value === 'existing' ? null : f.resumeFile,
        resumeId: value === 'upload' ? '' : f.resumeId
      }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({
        ...prev,
        resumeFile: file
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');

      // Validation
      if (
        !form.companyName.trim() ||
        !form.jobTitle.trim() ||
        !form.dateApplied ||
        !form.jobLocation.trim() ||
        !form.employmentType ||
        !form.workModel
      ) {
        setError('Please fill out all required fields.');
        setIsSubmitting(false);
        return;
      }

      if (form.useExisting === 'upload' && !form.resumeFile) {
        setError('Please select a resume file to upload.');
        setIsSubmitting(false);
        return;
      }

      if (form.useExisting === 'existing' && !form.resumeId) {
        setError('Please select an existing resume.');
        setIsSubmitting(false);
        return;
      }

      // Create FormData
      const formData = new FormData();
      formData.append('CompanyName', form.companyName.trim());
      formData.append('JobTitle', form.jobTitle.trim());
      formData.append('DateApplied', form.dateApplied);
      formData.append('JobLocation', form.jobLocation.trim());
      formData.append('EmploymentType', form.employmentType);
      formData.append('WorkModel', form.workModel);
      formData.append('Status', form.status || 'Pending');

      // Optional fields
      if (form.postingDate) {
        formData.append('PostingDate', form.postingDate);
      }
      if (form.closingDate) {
        formData.append('ClosingDate', form.closingDate);
      }
      if (form.salaryRange && form.salaryRange.trim()) {
        formData.append('SalaryRange', form.salaryRange.trim());
      }
      if (form.description && form.description.trim()) {
        formData.append('Description', form.description.trim());
      }
      if (form.followUpDate) {
        formData.append('FollowUpDate', form.followUpDate);
      }

      formData.append('InterviewScheduled', form.interviewScheduled.toString());

      if (form.interviewScheduled && form.interviewDate) {
        formData.append('InterviewDate', form.interviewDate);
      }

      // Handle resume
      if (form.useExisting === 'upload' && form.resumeFile) {
        formData.append('ResumeFile', form.resumeFile);
      } else if (form.useExisting === 'existing' && form.resumeId) {
        formData.append('ResumeId', parseInt(form.resumeId));
      }

      const response = await axios.post('https://jat.azurewebsites.net/api/applications', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      console.log('Success:', response.data);
      navigate('/applications');
    } catch (err) {
      console.error('Full error:', err);
      console.error('Response data:', err.response?.data);

      let message = 'Submission failed.';

      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.response?.data?.detail) {
        message = err.response.data.detail;
      } else if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        if (typeof errors === 'object') {
          const firstError = Object.values(errors)[0];
          if (Array.isArray(firstError)) {
            message = firstError[0];
          } else {
            message = firstError;
          }
        }
      } else if (err.response?.data && typeof err.response.data === 'string') {
        message = err.response.data;
      } else if (err.message) {
        message = err.message;
      }

      if (message.includes('This resume has already been uploaded') ||
        message.includes('Duplicate resume already exists')) {
        message = '⚠️ This resume has already been uploaded to your account. Please select a different file or choose an existing resume from the dropdown.';
      }

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    const hasChanges =
      form.companyName.trim() ||
      form.jobTitle.trim() ||
      form.jobLocation.trim() ||
      form.salaryRange.trim() ||
      form.description.trim() ||
      form.resumeFile ||
      form.resumeId ||
      form.postingDate ||
      form.closingDate ||
      form.followUpDate ||
      form.interviewScheduled;

    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate('/applications');
      }
    } else {
      navigate('/applications');
    }
  };

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Job Application Tracker</h1>
        <nav>
          <Link to="/" className="text-blue-600 hover:underline mx-2">Home</Link>
          <Link to="/applications" className="text-blue-600 hover:underline mx-2">Applications</Link>
          <Link to="/resumes" className="text-blue-600 hover:underline mx-2">Resumes</Link>
          <Link to="/profile" className="text-blue-600 hover:underline mx-2">Profile</Link>
          <button onClick={handleLogout} className="text-red-500 hover:underline mx-2">Logout</button>
        </nav>
      </header>

      <div className="max-w-4xl mx-auto mt-8 p-6">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">New Job Application</h2>
            <div className="text-sm text-gray-500">
              Fields marked with * are required
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Error:</span>
                <span className="ml-1">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={form.companyName}
                    onChange={onChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={form.jobTitle}
                    onChange={onChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter job title"
                  />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Dates</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Applied *
                  </label>
                  <input
                    type="date"
                    name="dateApplied"
                    value={form.dateApplied}
                    onChange={onChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Posting Date
                  </label>
                  <input
                    type="date"
                    name="postingDate"
                    value={form.postingDate}
                    onChange={onChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Closing Date
                  </label>
                  <input
                    type="date"
                    name="closingDate"
                    value={form.closingDate}
                    onChange={onChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Resume Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume *</h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex gap-6 items-start mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="useExisting"
                      value="upload"
                      checked={form.useExisting === 'upload'}
                      onChange={onChange}
                      className="mr-2 text-blue-600"
                    />
                    <span className="font-medium">Upload New Resume</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="useExisting"
                      value="existing"
                      checked={form.useExisting === 'existing'}
                      onChange={onChange}
                      className="mr-2 text-blue-600"
                    />
                    <span className="font-medium">Select Existing Resume</span>
                  </label>
                </div>

                {form.useExisting === 'upload' ? (
                  <div>
                    <input
                      type="file"
                      name="resumeFile"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Supported formats: PDF, DOC, DOCX (Max 10MB)
                    </p>
                  </div>
                ) : (
                  <div>
                    <select
                      name="resumeId"
                      value={form.resumeId}
                      onChange={onChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">-- Select Resume --</option>
                      {resumes.map(resume => (
                        <option key={resume.resumeId} value={resume.resumeId}>
                          {resume.fileName} ({getDisplayFileType(resume.fileType)})
                        </option>
                      ))}
                    </select>
                    {resumes.length === 0 && (
                      <p className="text-sm text-gray-500 mt-2">
                        No resumes found. Upload a new one above.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Job Details */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Location *
                  </label>
                  <input
                    type="text"
                    name="jobLocation"
                    value={form.jobLocation}
                    onChange={onChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., New York, NY or Remote"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employment Type *
                  </label>
                  <select
                    name="employmentType"
                    value={form.employmentType}
                    onChange={onChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Work Model *
                  </label>
                  <select
                    name="workModel"
                    value={form.workModel}
                    onChange={onChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    name="salaryRange"
                    value={form.salaryRange}
                    onChange={onChange}
                    placeholder="e.g., $80,000 - $100,000"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Interview Section */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      name="interviewScheduled"
                      checked={form.interviewScheduled}
                      onChange={onChange}
                      className="mr-3 text-blue-600"
                    />
                    <label className="font-medium text-gray-900">Interview Scheduled</label>
                  </div>
                  {form.interviewScheduled && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Interview Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        name="interviewDate"
                        value={form.interviewDate}
                        onChange={onChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>

                {/* Follow Up */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Follow Up Date
                  </label>
                  <input
                    type="date"
                    name="followUpDate"
                    value={form.followUpDate}
                    onChange={onChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description & Notes
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={onChange}
                placeholder="Add job description, requirements, notes, or any other relevant details..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-lg font-medium transition duration-200 ${isSubmitting
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                  }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  'Create Application'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}