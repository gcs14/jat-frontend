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
    status: '',
    salaryRange: '',
    description: '',
    followUpDate: '',
    interviewScheduled: false,
    interviewDate: '',
    resumeFileName: '',
    resumeId: '',
    useExisting: 'upload'
  });

  const [resumes, setResumes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('https://jat.azurewebsites.net/api/resumes', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setResumes(res.data))
      .catch(err => console.error('Failed to load resumes', err));
  }, []);

  const onChange = e => {
    const { name, value, type, files } = e.target;

    if (name === 'resumeFile') {
      setForm(f => ({ ...f, resumeFile: files[0] }));
    } else if (name === 'resumeId') {
      setForm(f => ({ ...f, resumeId: value }));
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

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       resumeFileName: file.name // Only capture the filename
  //     }));
  //   }
  // };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({
        ...prev,
        resumeFile: file,
        resumeFileName: file.name, // Save just the filename
      }));
    }
  };

  // const onSubmit = async e => {
  //   e.preventDefault();
  //   setError('');

  //   try {
  //     const token = localStorage.getItem('token');

  //     const payload = {
  //       companyName: form.companyName,
  //       jobTitle: form.jobTitle,
  //       dateApplied: form.dateApplied,
  //       postingDate: form.postingDate || null,
  //       closingDate: form.closingDate || null,
  //       jobLocation: form.jobLocation,
  //       employmentType: form.employmentType,
  //       workModel: form.workModel,
  //       resumeFileName: form.resumeFileName || null,
  //       salaryRange: form.salaryRange || null,
  //       description: form.description || null,
  //     };

  //     if (form.useExisting === 'upload' && form.resumeFile) {
  //       payload.resumeFileName = form.resumeFile.name; // only filename
  //     } else if (form.useExisting === 'existing' && form.resumeId) {
  //       payload.resumeId = form.resumeId;
  //     } else {
  //       setError('Please select or upload a resume.');
  //       return;
  //     }

  //     await axios.post('https://jat.azurewebsites.net/api/applications', payload, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     navigate('/');
  //   } catch (err) {
  //     console.error(err);
  //     setError(err.response?.data?.message || 'Submission failed');
  //   }
  // };

  // const onSubmit = async (e) => {
  //   e.preventDefault();
  //   setError('');

  //   try {
  //     const token = localStorage.getItem('token');

  //     // Extract resume file name if a file is selected and filename hasn't been captured yet
  //     let resumeFileName = form.resumeFileName;
  //     if (!resumeFileName && form.resumeFile instanceof File) {
  //       resumeFileName = form.resumeFile.name;
  //     }

  //     const payload = new FormData();
  //     payload.append('CompanyName', formData.companyName);
  //     payload.append('JobTitle', formData.jobTitle);
  //     payload.append('DateApplied', formData.dateApplied || '');
  //     payload.append('PostingDate', formData.postingDate || '');
  //     payload.append('ClosingDate', formData.closingDate || '');
  //     payload.append('JobLocation', formData.jobLocation);
  //     payload.append('EmploymentType', formData.employmentType);
  //     payload.append('WorkModel', formData.workModel);
  //     payload.append('Status', formData.status);
  //     payload.append('SalaryRange', formData.salaryRange || '');
  //     payload.append('Description', formData.description || '');
  //     payload.append('FollowUpDate', formData.followUpDate || '');
  //     payload.append('InterviewScheduled', formData.interviewScheduled);
  //     payload.append('InterviewDate', formData.interviewDate || '');

  //     if (formData.resumeFile) {
  //       payload.append('resumeFile', formData.resumeFile);
  //     }

  //     if (!payload.companyName || !payload.jobTitle || !payload.dateApplied || !payload.jobLocation || !payload.employmentType || !payload.workModel) {
  //       setError('Please fill out all required fields.');
  //       return;
  //     }

  //     if (!payload.resumeFileName) {
  //       setError('Please select a resume file.');
  //       return;
  //     }

  //     await axios.post('https://jat.azurewebsites.net/api/applications', payload, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     navigate('/');
  //   } catch (err) {
  //     console.error(err);
  //     setError(err.response?.data?.message || 'Submission failed.');
  //   }
  // };


  // const onSubmit = async e => {
  //   e.preventDefault();
  //   setError('');

  //   try {
  //     const token = localStorage.getItem('token');
  //     const formData = new FormData();

  //     formData.append('companyName', form.companyName);
  //     formData.append('jobTitle', form.jobTitle);
  //     formData.append('dateApplied', form.dateApplied);
  //     formData.append('postingDate', form.postingDate || '');
  //     formData.append('closingDate', form.closingDate || '');
  //     formData.append('jobLocation', form.jobLocation);
  //     formData.append('employmentType', form.employmentType);
  //     formData.append('workModel', form.workModel);
  //     formData.append('salaryRange', form.salaryRange || '');
  //     formData.append('description', form.description || '');

  //     if (form.useExisting === 'upload' && form.resumeFile) {
  //       formData.append('resumeFile', form.resumeFile); // send the actual file
  //       formData.append('resumeFileName', form.resumeFile.name);
  //     } else if (form.useExisting === 'existing' && form.resumeId) {
  //       formData.append('resumeId', form.resumeId);
  //     } else {
  //       setError('Please select or upload a resume.');
  //       return;
  //     }

  //     await axios.post('https://jat.azurewebsites.net/api/applications', formData, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     });

  //     navigate('/');
  //   } catch (err) {
  //     console.error(err);
  //     setError(err.response?.data?.message || 'Submission failed');
  //   }
  // };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');

      if (
        !form.companyName ||
        !form.jobTitle ||
        !form.dateApplied ||
        !form.jobLocation ||
        !form.employmentType ||
        !form.workModel
      ) {
        setError('Please fill out all required fields.');
        return;
      }

      if (form.useExisting === 'upload' && !form.resumeFile) {
        setError('Please select a resume file to upload.');
        return;
      }

      if (form.useExisting === 'existing' && !form.resumeId) {
        setError('Please select an existing resume.');
        return;
      }

      const formData = new FormData();
      formData.append('CompanyName', form.companyName);
      formData.append('JobTitle', form.jobTitle);
      formData.append('DateApplied', form.dateApplied);
      formData.append('PostingDate', form.postingDate || '');
      formData.append('ClosingDate', form.closingDate || '');
      formData.append('JobLocation', form.jobLocation);
      formData.append('EmploymentType', form.employmentType);
      formData.append('WorkModel', form.workModel);
      formData.append('Status', form.status || '');
      formData.append('SalaryRange', form.salaryRange || '');
      formData.append('Description', form.description || '');
      formData.append('FollowUpDate', form.followUpDate || '');
      formData.append('InterviewScheduled', form.interviewScheduled);
      formData.append('InterviewDate', form.interviewDate || '');

      if (form.useExisting === 'upload') {
        formData.append('resumeFile', form.resumeFile);
      } else {
        formData.append('ResumeId', form.resumeId); // backend expects ResumeId
      }

      await axios.post('https://jat.azurewebsites.net/api/applications', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // DO NOT manually set Content-Type for FormData
        }
      });

      navigate('/');
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message ||
        err.response?.data?.errors?.[Object.keys(err.response?.data?.errors || {})[0]]?.[0] ||
        'Submission failed.';
      setError(message);
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
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Company Name</label>
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
              <label className="block text-sm font-medium">Job Title</label>
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
              <label className="block text-sm font-medium">Date Applied</label>
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
            <legend className="text-sm font-medium mb-2">Resume Option</legend>
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
              <label className="block text-sm font-medium">Job Location</label>
              <input
                type="text"
                name="jobLocation"
                value={form.jobLocation}
                onChange={onChange}
                className="mt-1 block w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Employment Type</label>
              <select
                name="employmentType"
                value={form.employmentType}
                onChange={onChange}
                className="mt-1 block w-full border rounded p-2"
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Work Model</label>
              <select
                name="workModel"
                value={form.workModel}
                onChange={onChange}
                className="mt-1 block w-full border rounded p-2"
              >
                <option>Remote</option>
                <option>On-site</option>
                <option>Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Salary Range</label>
              <input
                type="text"
                name="salaryRange"
                value={form.salaryRange}
                onChange={onChange}
                className="mt-1 block w-full border rounded p-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              className="mt-1 block w-full border rounded p-2 h-24"
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}
