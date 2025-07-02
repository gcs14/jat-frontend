import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

function ViewApplication() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);

    const isAdmin = localStorage.getItem("role") === "admin"; // assumes 'role' is saved on login

    useEffect(() => {
        const fetchApplication = async () => {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            try {
                const response = await axios.get(`http://localhost:5169/api/applications/${id}`, { headers });
                setApplication(response.data);
            } catch (error) {
                console.error('Error fetching application:', error);
                setApplication(null);
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

    if (!application) {
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
                <main className="p-6 text-red-600">Application not found.</main>
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
                    <Link to="/logout" className="text-red-500 hover:underline mx-2">Logout</Link>
                </nav>
            </header>

            <main className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow mt-6">
                <h2 className="text-2xl font-bold mb-4">Application Details</h2>

                <div className="grid grid-cols-2 gap-4">
                    <p><strong>Job Title:</strong> {application.jobTitle}</p>
                    <p><strong>Company:</strong> {application.companyName}</p>
                    <p><strong>Location:</strong> {application.jobLocation}</p>
                    <p><strong>Status:</strong> {application.status}</p>
                    <p><strong>Employment Type:</strong> {application.employmentType}</p>
                    <p><strong>Work Model:</strong> {application.workModel}</p>
                    <p><strong>Salary Range:</strong> {application.salaryRange}</p>
                    <p><strong>Posting Date:</strong> {application.postingDate ? new Date(application.postingDate).toLocaleDateString() : "N/A"}</p>
                    <p><strong>Closing Date:</strong> {application.closingDate ? new Date(application.closingDate).toLocaleDateString() : "N/A"}</p>
                    <p><strong>Date Applied:</strong> {application.dateApplied ? new Date(application.dateApplied).toLocaleDateString() : "N/A"}</p>
                    <p><strong>Interview Scheduled:</strong> {application.interviewScheduled ? "Yes" : "No"}</p>
                    <p><strong>Interview Date:</strong> {application.interviewDate ? new Date(application.interviewDate).toLocaleDateString() : "N/A"}</p>
                    <p><strong>Follow Up Date:</strong> {application.followUpDate ? new Date(application.followUpDate).toLocaleDateString() : "N/A"}</p>
                    <p><strong>Description:</strong> {application.description}</p>
                    {isAdmin && (
                        <p><strong>User:</strong> {application.userFullName}</p>
                    )}

                    <div className="mb-4 col-span-2">
                        <h3 className="font-semibold">Resume</h3>
                        {application.resumeName ? (
                            <div>
                                <p className="text-gray-700">{application.resumeName}</p>
                                <button
                                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    onClick={() => {
                                        alert("This resume is part of a demo and cannot be downloaded.");
                                    }}
                                >
                                    Download Resume
                                </button>
                            </div>
                        ) : (
                            <p className="text-gray-500">No resume available for this application.</p>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-center gap-4">
                    <Link
                        to={`/applications/edit/${application.applicationId}`}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Edit
                    </Link>
                    <button
                        type="button"
                        onClick={() => navigate("/applications")}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition mx-2"
                    >
                        Cancel
                    </button>
                </div>
            </main>
        </div>
    );
}

export default ViewApplication;
