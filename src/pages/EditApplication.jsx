import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";

function EditApplication() {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const isDemoResume = (fileName) => {
        const demoResumeNames = [
            'jdoe_resume.pdf',
            'jdoe_resume1.pdf',
            'jdoe_resume2.docx',
            'bob_resume.pdf',
            'bob_resume2021.pdf'
        ];

        const [form, setForm] = useState({
            jobTitle: "",
            companyName: "",
            employmentType: "",
            workModel: "",
            jobLocation: "",
            status: "Pending",
            interviewDate: "",
            salaryRange: "",
            dateApplied: "",
            postingDate: "",
            closingDate: "",
            followupDate: "",
            interviewScheduled: false,
            description: ""
        });

        const [resumeFileName, setResumeFileName] = useState("");
        const [error, setError] = useState("");
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [isLoading, setIsLoading] = useState(true);
        const [resumeId, setResumeId] = useState(null);

        useEffect(() => {
            const fetchApplication = async () => {
                try {
                    const response = await axios.get(`https://jat.azurewebsites.net/api/applications/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const data = response.data;

                    const formatDateTimeLocal = (dateString) => {
                        if (!dateString) return "";
                        const date = new Date(dateString);
                        return date.toISOString().slice(0, 16);
                    };

                    setForm({
                        jobTitle: data.jobTitle || "",
                        companyName: data.companyName || "",
                        employmentType: data.employmentType || "",
                        workModel: data.workModel || "",
                        jobLocation: data.jobLocation || "",
                        status: data.status || "Pending",
                        interviewDate: formatDateTimeLocal(data.interviewDate),
                        salaryRange: data.salaryRange || "",
                        dateApplied: data.dateApplied ? new Date(data.dateApplied).toISOString().split("T")[0] : "",
                        postingDate: data.postingDate ? new Date(data.postingDate).toISOString().split("T")[0] : "",
                        closingDate: data.closingDate ? new Date(data.closingDate).toISOString().split("T")[0] : "",
                        followupDate: data.followupDate ? new Date(data.followupDate).toISOString().split("T")[0] : "",
                        interviewScheduled: data.interviewScheduled || false,
                        description: data.description || ""
                    });
                    setResumeFileName(data.resumeName || "");
                    setResumeId(data.resumeId);
                    setIsLoading(false);
                } catch (err) {
                    console.error("Failed to fetch application:", err);
                    setError("Could not load application data.");
                    setIsLoading(false);
                }
            };
            fetchApplication();
        }, [id, token]);

        const handleChange = (e) => {
            const { name, value, type, checked } = e.target;

            if (name === "followupDays") {
                const days = parseInt(value);
                if (days) {
                    const baseDate = form.dateApplied ? new Date(form.dateApplied) : new Date();
                    baseDate.setDate(baseDate.getDate() + days);
                    setForm(prev => ({ ...prev, followupDate: baseDate.toISOString().split("T")[0] }));
                }
            } else if (name === 'interviewScheduled') {
                setForm(prev => ({ ...prev, [name]: checked }));
            } else {
                setForm(prev => ({ ...prev, [name]: value }));
            }
        };

        const handleResumeDownload = async () => {
            if (isDemoResume(fileName)) {
                alert("Demo File Notice\n\nThis resume is part of our demo data and cannot be downloaded. It's included to showcase the application's functionality with sample data.\n\nTo test the download feature, please upload your own resume file.");
                return;
            }
            if (!resumeId) {
                alert("No resume associated with this application.");
                return;
            }
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`https://jat.azurewebsites.net/api/resumes/${resumeId}/download`, {
                    responseType: 'blob',
                    headers: { Authorization: `Bearer ${token}` }
                });

                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', resumeFileName || 'resume.pdf');
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Download failed:', error);

                let errorMessage = "Failed to download resume. Please try again.";

                if (error.response?.status === 404) {
                    errorMessage = "Resume file not found on server. The file may have been moved or deleted.";
                } else if (error.response?.status === 403) {
                    errorMessage = "You don't have permission to download this resume.";
                } else if (error.response?.status === 500) {
                    errorMessage = "Server error occurred while trying to download the resume.";
                }

                alert(errorMessage);
            }
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            setError('');
            setIsSubmitting(true);

            if (!form.jobTitle.trim() || !form.companyName.trim() || !form.employmentType ||
                !form.workModel || !form.jobLocation.trim()) {
                setError('Please fill out all required fields.');
                setIsSubmitting(false);
                return;
            }

            const payload = {
                ...form,
                interviewDate: form.interviewDate || null,
                postingDate: form.postingDate || null,
                closingDate: form.closingDate || null,
                followupDate: form.followupDate || null
            };

            try {
                await axios.patch(`https://jat.azurewebsites.net/api/applications/${id}`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                navigate(`/applications/${id}`);
            } catch (err) {
                console.error("Update failed:", err);
                setError("Failed to update application. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        };

        const handleCancel = () => {
            const hasChanges = Object.keys(form).some(key => form[key] !== "");

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
                        <p className="mt-4 text-gray-600">Loading application...</p>
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
                            <h2 className="text-2xl font-bold text-gray-900">Edit Job Application</h2>
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

                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                            onChange={handleChange}
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
                                            onChange={handleChange}
                                            required
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter job title"
                                        />
                                    </div>
                                </div>
                            </div>

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
                                            onChange={handleChange}
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
                                            onChange={handleChange}
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
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            {resumeFileName && (
                                <div className="border-b border-gray-200 pb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume</h3>
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                </svg>
                                                <span className="font-medium text-gray-900">{resumeFileName}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleResumeDownload}
                                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                                Download
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

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
                                            onChange={handleChange}
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
                                            onChange={handleChange}
                                            required
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Select type</option>
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
                                            onChange={handleChange}
                                            required
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Select model</option>
                                            <option value="Remote">Remote</option>
                                            <option value="On-site">On-site</option>
                                            <option value="Hybrid">Hybrid</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Application Status
                                        </label>
                                        <select
                                            name="status"
                                            value={form.status}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Interviewing">Interviewing</option>
                                            <option value="Rejected">Rejected</option>
                                            <option value="Offered">Offered</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Salary Range
                                        </label>
                                        <input
                                            type="text"
                                            name="salaryRange"
                                            value={form.salaryRange}
                                            onChange={handleChange}
                                            placeholder="e.g., $80,000 - $100,000"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                        <div className="flex items-center mb-3">
                                            <input
                                                type="checkbox"
                                                name="interviewScheduled"
                                                checked={form.interviewScheduled}
                                                onChange={handleChange}
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
                                                    onChange={handleChange}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <div className="grid grid-cols-10 gap-2">
                                            <div className="col-span-7">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Follow Up Date
                                                </label>
                                                <input
                                                    type="date"
                                                    name="followupDate"
                                                    value={form.followupDate}
                                                    onChange={handleChange}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Quick Follow-up
                                                </label>
                                                <select
                                                    name="followupDays"
                                                    onChange={handleChange}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="">Days</option>
                                                    <option value="3">3d</option>
                                                    <option value="5">5d</option>
                                                    <option value="7">7d</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Job Description & Notes
                                </label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Add job description, requirements, notes, or any other relevant details..."
                                    rows={4}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

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
                                            Updating...
                                        </div>
                                    ) : (
                                        'Update Application'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    export default EditApplication;