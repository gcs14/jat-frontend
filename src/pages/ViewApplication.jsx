// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import axios from "axios";

// function ViewApplication() {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [application, setApplication] = useState(null);

//     const isAdmin = localStorage.getItem("role") === "admin"; // assumes 'role' is saved on login

//     useEffect(() => {
//         const fetchApplication = async () => {
//             const token = localStorage.getItem('token');
//             const headers = { Authorization: `Bearer ${token}` };

//             try {
//                 const response = await axios.get(`https://jat.azurewebsites.net/api/applications/${id}`, { headers });
//                 setApplication(response.data);
//             } catch (error) {
//                 console.error('Error fetching application:', error);
//                 setApplication(null);
//             }
//         };

//         fetchApplication();
//     }, [id]);

//     const handleLogout = () => {
//         const confirmed = window.confirm("Are you sure you want to logout?");
//         if (confirmed) {
//             localStorage.removeItem('token');
//             navigate('/login');
//         }
//     };

//     if (!application) {
//         return (
//             <div className="min-h-screen bg-gray-100">
//                 <header className="bg-white shadow p-4 flex justify-between items-center">
//                     <h1 className="text-2xl font-bold">Job Application Tracker</h1>
//                     <nav>
//                         <Link to="/" className="text-blue-600 hover:underline mx-2">Home</Link>
//                         <Link to="/applications" className="text-blue-600 hover:underline mx-2">Applications</Link>
//                         <Link to="/resumes" className="text-blue-600 hover:underline mx-2">Resumes</Link>
//                         <Link to="/profile" className="text-blue-600 hover:underline mx-2">Profile</Link>
//                         <button onClick={handleLogout} className="text-red-500 hover:underline mx-2">Logout</button>
//                     </nav>
//                 </header>
//                 <main className="p-6 text-red-600">Application not found.</main>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-100">
//             <header className="bg-white shadow p-4 flex justify-between items-center">
//                 <h1 className="text-2xl font-bold">Job Application Tracker</h1>
//                 <nav>
//                     <Link to="/" className="text-blue-600 hover:underline mx-2">Home</Link>
//                     <Link to="/applications" className="text-blue-600 hover:underline mx-2">Applications</Link>
//                     <Link to="/resumes" className="text-blue-600 hover:underline mx-2">Resumes</Link>
//                     <Link to="/profile" className="text-blue-600 hover:underline mx-2">Profile</Link>
//                     <Link to="/logout" className="text-red-500 hover:underline mx-2">Logout</Link>
//                 </nav>
//             </header>

//             <main className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow mt-6">
//                 <h2 className="text-2xl font-bold mb-4">Application Details</h2>

//                 <div className="grid grid-cols-2 gap-4">
//                     <p><strong>Job Title:</strong> {application.jobTitle}</p>
//                     <p><strong>Company:</strong> {application.companyName}</p>
//                     <p><strong>Location:</strong> {application.jobLocation}</p>
//                     <p><strong>Status:</strong> {application.status}</p>
//                     <p><strong>Employment Type:</strong> {application.employmentType}</p>
//                     <p><strong>Work Model:</strong> {application.workModel}</p>
//                     <p><strong>Salary Range:</strong> {application.salaryRange}</p>
//                     <p><strong>Posting Date:</strong> {application.postingDate ? new Date(application.postingDate).toLocaleDateString() : "N/A"}</p>
//                     <p><strong>Closing Date:</strong> {application.closingDate ? new Date(application.closingDate).toLocaleDateString() : "N/A"}</p>
//                     <p><strong>Date Applied:</strong> {application.dateApplied ? new Date(application.dateApplied).toLocaleDateString() : "N/A"}</p>
//                     <p><strong>Interview Scheduled:</strong> {application.interviewScheduled ? "Yes" : "No"}</p>
//                     <p><strong>Interview Date:</strong> {application.interviewDate ? new Date(application.interviewDate).toLocaleDateString() : "N/A"}</p>
//                     <p><strong>Follow Up Date:</strong> {application.followUpDate ? new Date(application.followUpDate).toLocaleDateString() : "N/A"}</p>
//                     <p><strong>Description:</strong> {application.description}</p>
//                     {isAdmin && (
//                         <p><strong>User:</strong> {application.userFullName}</p>
//                     )}

//                     <div className="mb-4 col-span-2">
//                         <h3 className="font-semibold">Resume</h3>
//                         {application.resumeName ? (
//                             <div>
//                                 <p className="text-gray-700">{application.resumeName}</p>
//                                 <button
//                                     className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                                     onClick={() => {
//                                         alert("This resume is part of a demo and cannot be downloaded.");
//                                     }}
//                                 >
//                                     Download Resume
//                                 </button>
//                             </div>
//                         ) : (
//                             <p className="text-gray-500">No resume available for this application.</p>
//                         )}
//                     </div>
//                 </div>

//                 <div className="mt-6 flex justify-center gap-4">
//                     <Link
//                         to={`/applications/edit/${application.applicationId}`}
//                         className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                     >
//                         Edit
//                     </Link>
//                     <button
//                         type="button"
//                         onClick={() => navigate("/applications")}
//                         className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition mx-2"
//                     >
//                         Cancel
//                     </button>
//                 </div>
//             </main>
//         </div>
//     );
// }

// export default ViewApplication;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

function ViewApplication() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const isAdmin = localStorage.getItem("role") === "admin";

    useEffect(() => {
        const fetchApplication = async () => {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            try {
                const response = await axios.get(`https://jat.azurewebsites.net/api/applications/${id}`, { headers });
                setApplication(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching application:', error);
                setError("Failed to load application details.");
                setIsLoading(false);
            }
        };

        fetchApplication();
    }, [id]);

    const handleLogout = () => {
        const confirmed = window.confirm("Are you sure you want to logout?");
        if (confirmed) {
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Not specified";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return "Not specified";
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            'Pending': 'bg-yellow-100 text-yellow-800',
            'Interviewing': 'bg-blue-100 text-blue-800',
            'Offered': 'bg-green-100 text-green-800',
            'Rejected': 'bg-red-100 text-red-800'
        };
        
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
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

    if (error || !application) {
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
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 text-center">
                        <div className="text-red-600 mb-4">
                            <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Application Not Found</h2>
                        <p className="text-gray-600 mb-6">{error || "The requested application could not be found."}</p>
                        <Link 
                            to="/applications"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Back to Applications
                        </Link>
                    </div>
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
                        <h1 className="text-3xl font-bold text-gray-900">Application Details</h1>
                        <div className="flex items-center space-x-3">
                            {getStatusBadge(application.status)}
                            <Link
                                to={`/applications/edit/${application.applicationId}`}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                                Edit
                            </Link>
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="border-b border-gray-200 pb-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                        <div className={`grid gap-6 ${isAdmin ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                            {isAdmin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Created By</label>
                                    <p className="text-lg text-gray-900">{application.userFullName || "Not specified"}</p>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Company Name</label>
                                <p className="text-lg text-gray-900">{application.companyName || "Not specified"}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Job Title</label>
                                <p className="text-lg text-gray-900">{application.jobTitle || "Not specified"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Important Dates */}
                    <div className="border-b border-gray-200 pb-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Dates</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Date Applied</label>
                                <p className="text-gray-900">{formatDate(application.dateApplied)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Posting Date</label>
                                <p className="text-gray-900">{formatDate(application.postingDate)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Closing Date</label>
                                <p className="text-gray-900">{formatDate(application.closingDate)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Resume Section */}
                    {application.resumeName && (
                        <div className="border-b border-gray-200 pb-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume</h3>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <svg className="w-8 h-8 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                        </svg>
                                        <div>
                                            <p className="font-medium text-gray-900">{application.resumeName}</p>
                                            <p className="text-sm text-gray-500">Resume file</p>
                                        </div>
                                    </div>
                                    <button
                                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        onClick={() => {
                                            alert("This resume is part of a demo and cannot be downloaded.");
                                        }}
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

                    {/* Job Details */}
                    <div className="border-b border-gray-200 pb-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Job Location</label>
                                <p className="text-gray-900">{application.jobLocation || "Not specified"}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Employment Type</label>
                                <p className="text-gray-900">{application.employmentType || "Not specified"}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Work Model</label>
                                <p className="text-gray-900">{application.workModel || "Not specified"}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Application Status</label>
                                <p className="text-gray-900">{application.status || "Not specified"}</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-500 mb-1">Salary Range</label>
                                <p className="text-gray-900">{application.salaryRange || "Not specified"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="border-b border-gray-200 pb-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Interview Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Interview Scheduled</label>
                                <p className="text-gray-900 mb-3">{application.interviewScheduled ? "Yes" : "No"}</p>
                                {application.interviewScheduled && application.interviewDate && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Interview Date & Time</label>
                                        <p className="text-gray-900">{formatDateTime(application.interviewDate)}</p>
                                    </div>
                                )}
                            </div>

                            {/* Follow Up */}
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Follow Up Date</label>
                                <p className="text-gray-900">{formatDate(application.followUpDate)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {application.description && (
                        <div className="border-b border-gray-200 pb-6 mb-6">
                            <label className="block text-sm font-medium text-gray-500 mb-3">Job Description & Notes</label>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-gray-900 whitespace-pre-wrap">{application.description}</p>
                            </div>
                        </div>
                    )}

                    {/* Admin Section */}
                    {isAdmin && application.userFullName && (
                        <div className="border-b border-gray-200 pb-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Information</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Additional Details</label>
                                <p className="text-gray-900">Created by {application.userFullName}</p>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => navigate("/applications")}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
                        >
                            Back to Applications
                        </button>
                        <Link
                            to={`/applications/edit/${application.applicationId}`}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium shadow-sm"
                        >
                            Edit Application
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewApplication;