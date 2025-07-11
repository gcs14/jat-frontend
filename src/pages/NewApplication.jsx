import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('https://jat.azurewebsites.net/api/resumes', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setResumes(res.data))
      .catch(err => console.error('Failed to load resumes', err));
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

      const formData = new FormData();
      formData.append('CompanyName', form.companyName.trim());
      formData.append('JobTitle', form.jobTitle.trim());
      formData.append('DateApplied', form.dateApplied);
      formData.append('JobLocation', form.jobLocation.trim());
      formData.append('EmploymentType', form.employmentType);
      formData.append('WorkModel', form.workModel);
      formData.append('Status', form.status || 'Pending');

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
      navigate('/');
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
        message = 'This resume has already been uploaded to your account. Please select a different file or choose an existing resume from the dropdown.';
      }

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Job Application Tracker</h1>
        <nav>
          <Link to="/" className="text-blue-600 hover:underline mx-2">Home</Link>
          <Link to="/applications" className="text-blue-600 hover:underline mx-2">Applications</Link>
          <Link to="/profile" className="text-blue-600 hover:underline mx-2">Profile</Link>
          <button onClick={handleLogout} className="text-red-500 hover:underline mx-2">Logout</button>
        </nav>
      </header>

      <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">New Application</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Company Name *</label>
              <input
                type="text"
                name="companyName"
                value={form.companyName}
                onChange={onChange}
                required
                className="mt-1 block w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Job Title *</label>
              <input
                type="text"
                name="jobTitle"
                value={form.jobTitle}
                onChange={onChange}
                required
                className="mt-1 block w-full border rounded p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">Date Applied *</label>
              <input
                type="date"
                name="dateApplied"
                value={form.dateApplied}
                onChange={onChange}
                required
                className="mt-1 block w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Posting Date</label>
              <input
                type="date"
                name="postingDate"
                value={form.postingDate}
                onChange={onChange}
                className="mt-1 block w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Closing Date</label>
              <input
                type="date"
                name="closingDate"
                value={form.closingDate}
                onChange={onChange}
                className="mt-1 block w-full border rounded p-2"
              />
            </div>
          </div>

          <fieldset className="border rounded p-4">
            <legend className="text-sm font-medium mb-2">Resume Option *</legend>
            <div className="flex gap-6 items-start">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="useExisting"
                  value="upload"
                  checked={form.useExisting === 'upload'}
                  onChange={onChange}
                  className="mr-2"
                />
                Upload New Resume
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="useExisting"
                  value="existing"
                  checked={form.useExisting === 'existing'}
                  onChange={onChange}
                  className="mr-2"
                />
                Select Existing Resume
              </label>
            </div>
            {form.useExisting === 'upload' ? (
              <input
                type="file"
                name="resumeFile"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="mt-3 block w-full p-2 border rounded"
              />
            ) : (
              <select
                name="resumeId"
                value={form.resumeId}
                onChange={onChange}
                className="mt-3 block w-full border rounded p-2"
              >
                <option value="">-- Select Resume --</option>
                {resumes.map(resume => (
                  <option key={resume.resumeId} value={resume.resumeId}>
                    {resume.fileName}
                  </option>
                ))}
              </select>
            )}
          </fieldset>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Job Location *</label>
              <input
                type="text"
                name="jobLocation"
                value={form.jobLocation}
                onChange={onChange}
                required
                className="mt-1 block w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Employment Type *</label>
              <select
                name="employmentType"
                value={form.employmentType}
                onChange={onChange}
                required
                className="mt-1 block w-full border rounded p-2"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Work Model *</label>
              <select
                name="workModel"
                value={form.workModel}
                onChange={onChange}
                required
                className="mt-1 block w-full border rounded p-2"
              >
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={onChange}
                className="mt-1 block w-full border rounded p-2"
              >
                <option value="Pending">Pending</option>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Salary Range</label>
              <input
                type="text"
                name="salaryRange"
                value={form.salaryRange}
                onChange={onChange}
                placeholder="e.g., $80,000 - $100,000"
                className="mt-1 block w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Follow Up Date</label>
              <input
                type="date"
                name="followUpDate"
                value={form.followUpDate}
                onChange={onChange}
                className="mt-1 block w-full border rounded p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="interviewScheduled"
                checked={form.interviewScheduled}
                onChange={onChange}
                className="mr-2"
              />
              <label className="text-sm font-medium">Interview Scheduled</label>
            </div>
            {form.interviewScheduled && (
              <div>
                <label className="block text-sm font-medium">Interview Date</label>
                <input
                  type="datetime-local"
                  name="interviewDate"
                  value={form.interviewDate}
                  onChange={onChange}
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="Job description, notes, or additional details..."
              className="mt-1 block w-full border rounded p-2 h-24"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-4 px-6 py-2 rounded shadow text-white ${isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}