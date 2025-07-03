import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function FollowUps() {
    const [followUps, setFollowUps] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        axios
            .get("https://jat.azurewebsites.net/api/applications/followups", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(res => {
                setFollowUps(res.data);
            })
            .catch(err => {
                console.error("Error fetching follow-ups", err);
            });
    }, []);

    const handleLogout = () => {
        const confirmed = window.confirm("Are you sure you want to logout?");
        if (confirmed) {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("userId");
            navigate('/login');
        }
    };

    const formatDate = dateStr => {
        if (!dateStr) return "N/A";
        const date = new Date(dateStr);
        return isNaN(date) ? "Invalid Date" : `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    };

    const isTodayOrOverdue = dateStr => {
        if (!dateStr) return false;
        const today = new Date();
        const date = new Date(dateStr);
        return (
            date.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0)
        );
    };

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

            <main className="p-6">
                <div className="relative m-4 flex items-center justify-center">
                    <h2 className="text-3xl font-bold">Upcoming Follow-Ups</h2>
                </div>

                {followUps.length === 0 ? (
                    <p className="text-center text-gray-500 mt-8">No upcoming follow-ups.</p>
                ) : (
                    <div className="overflow-x-auto bg-white rounded shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Follow-Up Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {followUps.map(app => (
                                    <tr key={app.applicationId} className={isTodayOrOverdue(app.followUpDate) ? "bg-yellow-100" : ""}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{app.companyName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{app.jobTitle}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{formatDate(app.followUpDate)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{app.status}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <Link
                                                to={`/applications/${app.applicationId}`}
                                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 mx-2"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                to={`/applications/edit/${app.applicationId}`}
                                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mx-2"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}

export default FollowUps;
