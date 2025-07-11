import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const getStatusColor = (status) => {
    const colorMap = {
        'Pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'Applied': 'bg-blue-100 text-blue-700 border-blue-200',
        'Interview': 'bg-purple-100 text-purple-700 border-purple-200',
        'Interviewing': 'bg-purple-100 text-purple-700 border-purple-200',
        'Offer': 'bg-green-100 text-green-700 border-green-200',
        'Offer Received': 'bg-green-100 text-green-700 border-green-200',
        'Rejected': 'bg-red-100 text-red-700 border-red-200',
        'Withdrawn': 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-700 border-gray-200';
};

const getUrgencyColor = (followUpDate) => {
    if (!followUpDate) return '';

    const today = new Date();
    const followUp = new Date(followUpDate);
    const diffTime = followUp.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'bg-red-50 border-l-4 border-red-400'; // Overdue
    if (diffDays === 0) return 'bg-yellow-50 border-l-4 border-yellow-400'; // Today
    if (diffDays <= 2) return 'bg-orange-50 border-l-4 border-orange-400'; // Soon
    return ''; // Normal
};

function FollowUps() {
    const [followUps, setFollowUps] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'followUpDate', direction: 'ascending' });
    const [isLoading, setIsLoading] = useState(true);
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
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error fetching follow-ups", err);
                setError('Could not load follow-ups');
                setIsLoading(false);
            });
    }, []);

    const sortedAndFiltered = useMemo(() => {
        let filtered = followUps.filter(app => {
            const term = searchTerm.toLowerCase();
            return (
                (app.companyName?.toLowerCase() || '').includes(term) ||
                (app.jobTitle?.toLowerCase() || '').includes(term) ||
                (app.status?.toLowerCase() || '').includes(term) ||
                (app.jobLocation?.toLowerCase() || '').includes(term)
            );
        });

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];

                if (sortConfig.key === 'followUpDate') {
                    aVal = new Date(aVal);
                    bVal = new Date(bVal);
                }

                if (aVal < bVal) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [followUps, searchTerm, sortConfig]);

    const requestSort = key => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = key =>
        sortConfig.key === key ? (sortConfig.direction === 'ascending' ? ' ↑' : ' ↓') : '';

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
        if (!dateStr) return "Not specified";
        const date = new Date(dateStr);
        return isNaN(date) ? "Invalid Date" : date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getDateStatus = dateStr => {
        if (!dateStr) return { text: '', color: '' };

        const today = new Date();
        const followUp = new Date(dateStr);
        const diffTime = followUp.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { text: `${Math.abs(diffDays)} days overdue`, color: 'text-red-600' };
        if (diffDays === 0) return { text: 'Due today', color: 'text-yellow-600' };
        if (diffDays === 1) return { text: 'Due tomorrow', color: 'text-orange-600' };
        if (diffDays <= 7) return { text: `Due in ${diffDays} days`, color: 'text-orange-600' };
        return { text: `Due in ${diffDays} days`, color: 'text-gray-500' };
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading follow-ups...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Job Application Tracker</h1>
                <nav className="flex items-center space-x-4">
                    <Link to="/" className="text-blue-600 hover:underline mx-2">Home</Link>
                    <Link to="/applications" className="text-blue-600 hover:underline mx-2">Applications</Link>
                    <Link to="/resumes" className="text-blue-600 hover:underline mx-2">Resumes</Link>
                    <Link to="/profile" className="text-blue-600 hover:underline mx-2">Profile</Link>
                    <button onClick={handleLogout} className="text-red-500 hover:underline mx-2">Logout</button>
                </nav>
            </header>

            <div className="relative m-4 flex items-center justify-center">
                <div className="absolute left-0">
                    <Link to="/applications">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm">
                            ← Back to Applications
                        </button>
                    </Link>
                </div>
                <h1 className="text-3xl font-bold">Upcoming Follow-Ups</h1>
                <div className="absolute right-0 flex items-center space-x-3">
                    <input
                        type="text"
                        placeholder="Search follow-ups..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {error && (
                <div className="mx-4 mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <strong>Error:</strong> {error}
                </div>
            )}

            <div className="mx-4 overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                                onClick={() => requestSort('companyName')}
                            >
                                Company{getSortIndicator('companyName')}
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                                onClick={() => requestSort('jobTitle')}
                            >
                                Job Title{getSortIndicator('jobTitle')}
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                                onClick={() => requestSort('followUpDate')}
                            >
                                Follow-Up Date{getSortIndicator('followUpDate')}
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                                onClick={() => requestSort('status')}
                            >
                                Status{getSortIndicator('status')}
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedAndFiltered.map((app, index) => {
                            const dateStatus = getDateStatus(app.followUpDate);
                            const urgencyClass = getUrgencyColor(app.followUpDate);

                            return (
                                <tr key={app.applicationId} className={`hover:bg-gray-50 transition duration-150 ${urgencyClass}`}>
                                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                        <div className="font-medium">{app.companyName}</div>
                                        {app.jobLocation && (
                                            <div className="text-xs text-gray-500">{app.jobLocation}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="font-medium">{app.jobTitle}</div>
                                        {app.employmentType && (
                                            <div className="text-xs text-gray-500">{app.employmentType} • {app.workModel}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                        <div className="font-medium">
                                            {formatDate(app.followUpDate)}
                                        </div>
                                        <div className={`text-xs ${dateStatus.color}`}>
                                            {dateStatus.text}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border ${getStatusColor(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex justify-center space-x-2">
                                            <Link
                                                to={`/applications/${app.applicationId}`}
                                                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-xs font-medium shadow-sm"
                                                title="View details"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                to={`/applications/edit/${app.applicationId}`}
                                                className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition duration-200 text-xs font-medium shadow-sm"
                                                title="Edit application"
                                            >
                                                Edit
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {sortedAndFiltered.length === 0 && !error && (
                <div className="mt-12 text-center">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mx-4 max-w-md mx-auto">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {searchTerm ? 'No follow-ups found' : 'No follow-ups scheduled'}
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {searchTerm
                                ? 'Try adjusting your search terms to find what you\'re looking for.'
                                : 'You don\'t have any follow-ups scheduled at the moment.'
                            }
                        </p>
                        {!searchTerm && (
                            <Link to="/applications">
                                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm">
                                    View Applications
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default FollowUps;