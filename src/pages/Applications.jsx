import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

export default function ApplicationsPage() {
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'companyName', direction: 'ascending' });
    const [isAdmin, setIsAdmin] = useState(false);
    const [userName, setUserName] = useState('user');

    useEffect(() => {
        const token = localStorage.getItem('token');
        let role;

        if (token) {
            try {
                const payload = JSON.parse(window.atob(token.split('.')[1]));
                role = payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
                setIsAdmin(role === 'Admin');
            } catch {
                setIsAdmin(false);
            }
        }

        const endpoint = role === 'Admin'
            // ? 'http://localhost:5169/api/applications/all'
            // : 'http://localhost:5169/api/applications';
            ? 'https://jat.azurewebsites.net/api/applications/all'
            : 'https://jat.azurewebsites.net/api/applications';

        if (token) {
            axios.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => setApplications(res.data))
                .catch(err => {
                    console.error('Failed to load applications', err);
                    setError('Could not load applications');
                });
        }
    }, []);

    const handleDeleteAll = async () => {
        if (!window.confirm('Are you sure you want to delete ALL applications?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete('https://jat.azurewebsites.net/api/applications/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setApplications([]);
        } catch (err) {
            console.error('Delete all failed', err);
            setError('Failed to delete all applications');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this application?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://jat.azurewebsites.net/api/applications/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setApplications(prev => prev.filter(app => app.applicationId !== id));
        } catch (err) {
            console.error('Delete failed', err);
            setError('Failed to delete application');
        }
    };

    const handleDownloadCSV = () => {
        const token = localStorage.getItem('token');
        let userName = userFullName;

        if (token) {
            try {
                const payload = JSON.parse(window.atob(token.split('.')[1]));
                userName = (payload.name || payload.unique_name || 'user').replace(/\s+/g, '_');
            } catch {
                console.warn("Failed to decode token for username");
            }
        }

        const csvData = sortedAndFiltered.map(app => ({
            Name: isAdmin ? app.userFullName : undefined,
            Company: app.companyName,
            JobTitle: app.jobTitle,
            Status: app.status,
            DateApplied: new Date(app.dateApplied).toLocaleDateString()
        }));

        const cleanedData = csvData.map(row => {
            const result = {};
            Object.entries(row).forEach(([key, value]) => {
                if (value !== undefined) result[key] = value;
            });
            return result;
        });

        const csv = Papa.unparse(cleanedData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

        const dateOnly = new Date().toISOString().split('T')[0];
        const keywordPart = searchTerm ? `_${searchTerm.replace(/\s+/g, '_')}` : '';
        const fileName = `${userName}_applications${keywordPart}_${dateOnly}.csv`;

        saveAs(blob, fileName);
    };



    const sortedAndFiltered = useMemo(() => {
        let filtered = applications.filter(app => {
            const term = searchTerm.toLowerCase();
            return (
                (app.userFullName?.toLowerCase() || '').includes(term) ||
                (app.companyName?.toLowerCase() || '').includes(term) ||
                (app.jobTitle?.toLowerCase() || '').includes(term) ||
                (app.status?.toLowerCase() || '').includes(term)
            );
        });
        const { key, direction } = sortConfig;
        filtered.sort((a, b) => {
            const aVal = a[key];
            const bVal = b[key];
            if (aVal < bVal) return direction === 'ascending' ? -1 : 1;
            if (aVal > bVal) return direction === 'ascending' ? 1 : -1;
            return 0;
        });
        return filtered;
    }, [applications, searchTerm, sortConfig]);

    const requestSort = key => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = key =>
        sortConfig.key === key ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '';

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
                <nav className="flex items-center space-x-4">
                    <Link to="/" className="text-blue-600 hover:underline mx-2">Home</Link>
                    <Link to="/applications" className="text-blue-600 hover:underline mx-2">Applications</Link>
                    <Link to="/resumes" className="text-blue-600 hover:underline mx-2">Resumes</Link>
                    <Link to="/profile" className="text-blue-600 hover:underline mx-2">Profile</Link>
                    {isAdmin && (
                        <button
                            onClick={handleDeleteAll}
                            className="text-red-600 hover:underline mx-2"
                        >
                            Delete All
                        </button>
                    )}
                    <button onClick={handleLogout} className="text-red-500 hover:underline mx-2">Logout</button>
                </nav>
            </header>

            <div className="relative m-4 flex items-center justify-center">
                <div className="absolute left-0">
                    <Link to="/applications/new">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                            New Application
                        </button>
                    </Link>
                </div>
                <h2 className="text-3xl font-bold">My Applications</h2>
                <div className="absolute right-0">
                    <input
                        type="text"
                        placeholder="Search by company, job title or status"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="border rounded p-2 w-80"
                    />
                    <button
                        onClick={handleDownloadCSV}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ml-2"
                    >
                        Download CSV
                    </button>
                </div>
            </div>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {isAdmin && (
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => requestSort('userFullName')}
                                >
                                    Name {getSortIndicator('userFullName')}
                                </th>
                            )}
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => requestSort('companyName')}
                            >
                                Company {getSortIndicator('companyName')}
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => requestSort('jobTitle')}
                            >
                                Job Title {getSortIndicator('jobTitle')}
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => requestSort('dateApplied')}
                            >
                                Date Applied {getSortIndicator('dateApplied')}
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => requestSort('status')}
                            >
                                Status {getSortIndicator('status')}
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedAndFiltered.map(app => (
                            <tr key={app.applicationId}>
                                {isAdmin && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                        {app.userFullName || 'N/A'}
                                    </td>
                                )}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                    {app.companyName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                    {app.jobTitle}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                    {new Date(app.dateApplied).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                    {app.status}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="flex justify-center space-x-2">
                                        <Link
                                            to={`/applications/${app.applicationId}`}
                                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                        >
                                            View
                                        </Link>
                                        <Link
                                            to={`/applications/edit/${app.applicationId}`}
                                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(app.applicationId)}
                                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {applications.length === 0 && !error && (
                <p className="mt-4 text-gray-600 text-center">No applications found.</p>
            )}
        </div>
    );
}
