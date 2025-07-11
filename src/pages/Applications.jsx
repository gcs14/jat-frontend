// import React, { useEffect, useState, useMemo } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Papa from 'papaparse';
// import { saveAs } from 'file-saver';

// export default function ApplicationsPage() {
//     const [applications, setApplications] = useState([]);
//     const [error, setError] = useState('');
//     const [searchTerm, setSearchTerm] = useState('');
//     const [sortConfig, setSortConfig] = useState({ key: 'companyName', direction: 'ascending' });
//     const [isAdmin, setIsAdmin] = useState(false);
//     const navigate = useNavigate();
//     // const [userName, setUserName] = useState('user');

//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         let role;

//         if (token) {
//             try {
//                 const payload = JSON.parse(window.atob(token.split('.')[1]));
//                 role = payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
//                 setIsAdmin(role === 'Admin');
//             } catch {
//                 setIsAdmin(false);
//             }
//         }

//         const endpoint = role === 'Admin'
//             ? 'https://jat.azurewebsites.net/api/applications/all'
//             : 'https://jat.azurewebsites.net/api/applications';

//         if (token) {
//             axios.get(endpoint, {
//                 headers: { Authorization: `Bearer ${token}` }
//             })
//                 .then(res => setApplications(res.data))
//                 .catch(err => {
//                     console.error('Failed to load applications', err);
//                     setError('Could not load applications');
//                 });
//         }
//     }, []);

//     const handleDeleteAll = async () => {
//         if (!window.confirm('Are you sure you want to delete ALL applications?')) return;
//         try {
//             const token = localStorage.getItem('token');
//             await axios.delete('https://jat.azurewebsites.net/api/applications/all', {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setApplications([]);
//         } catch (err) {
//             console.error('Delete all failed', err);
//             setError('Failed to delete all applications');
//         }
//     };

//     const handleDelete = async (id) => {
//         if (!window.confirm('Are you sure you want to delete this application?')) return;
//         try {
//             const token = localStorage.getItem('token');
//             await axios.delete(`https://jat.azurewebsites.net/api/applications/${id}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setApplications(prev => prev.filter(app => app.applicationId !== id));
//         } catch (err) {
//             console.error('Delete failed', err);
//             setError('Failed to delete application');
//         }
//     };

//     // const handleDownloadCSV = () => {
//     //     const token = localStorage.getItem('token');
//     //     let userName = userName;

//     //     if (token) {
//     //         try {
//     //             const payload = JSON.parse(window.atob(token.split('.')[1]));
//     //             userName = (payload.name || payload.unique_name || 'user').replace(/\s+/g, '_');
//     //         } catch {
//     //             console.warn("Failed to decode token for username");
//     //         }
//     //     }

//     //     const csvData = sortedAndFiltered.map(app => ({
//     //         Name: isAdmin ? app.userFullName : undefined,
//     //         Company: app.companyName,
//     //         JobTitle: app.jobTitle,
//     //         Status: app.status,
//     //         DateApplied: new Date(app.dateApplied).toLocaleDateString()
//     //     }));

//     //     const cleanedData = csvData.map(row => {
//     //         const result = {};
//     //         Object.entries(row).forEach(([key, value]) => {
//     //             if (value !== undefined) result[key] = value;
//     //         });
//     //         return result;
//     //     });

//     //     const csv = Papa.unparse(cleanedData);
//     //     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

//     //     const dateOnly = new Date().toISOString().split('T')[0];
//     //     const keywordPart = searchTerm ? `_${searchTerm.replace(/\s+/g, '_')}` : '';
//     //     const fileName = `${userName}_applications${keywordPart}_${dateOnly}.csv`;

//     //     saveAs(blob, fileName);
//     // };

//     const handleDownloadCSV = () => {
//         // Use the first application to grab the user name (assuming it's the same across the list)
//         const firstApp = sortedAndFiltered[0];
//         let userName = firstApp?.userFullName || 'user';

//         // Clean username and search term for file name
//         userName = userName.replace(/\s+/g, '_');
//         const keywordPart = searchTerm ? `_${searchTerm.replace(/\s+/g, '_')}` : '';
//         const dateOnly = new Date().toISOString().split('T')[0];

//         const fileName = `${userName}_applications${keywordPart}_${dateOnly}.csv`;

//         const csvData = sortedAndFiltered.map(app => ({
//             Name: isAdmin ? app.userFullName : undefined,
//             Company: app.companyName,
//             JobTitle: app.jobTitle,
//             Status: app.status,
//             DateApplied: new Date(app.dateApplied).toLocaleDateString()
//         }));

//         const cleanedData = csvData.map(row => {
//             const result = {};
//             Object.entries(row).forEach(([key, value]) => {
//                 if (value !== undefined) result[key] = value;
//             });
//             return result;
//         });

//         const csv = Papa.unparse(cleanedData);
//         const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//         saveAs(blob, fileName);
//     };


//     const sortedAndFiltered = useMemo(() => {
//         let filtered = applications.filter(app => {
//             const term = searchTerm.toLowerCase();
//             return (
//                 (app.userFullName?.toLowerCase() || '').includes(term) ||
//                 (app.companyName?.toLowerCase() || '').includes(term) ||
//                 (app.jobTitle?.toLowerCase() || '').includes(term) ||
//                 (app.status?.toLowerCase() || '').includes(term)
//             );
//         });
//         const { key, direction } = sortConfig;
//         filtered.sort((a, b) => {
//             const aVal = a[key];
//             const bVal = b[key];
//             if (aVal < bVal) return direction === 'ascending' ? -1 : 1;
//             if (aVal > bVal) return direction === 'ascending' ? 1 : -1;
//             return 0;
//         });
//         return filtered;
//     }, [applications, searchTerm, sortConfig]);

//     const requestSort = key => {
//         let direction = 'ascending';
//         if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//             direction = 'descending';
//         }
//         setSortConfig({ key, direction });
//     };

//     const getSortIndicator = key =>
//         sortConfig.key === key ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '';

//     const handleLogout = () => {
//         const confirmed = window.confirm("Are you sure you want to logout?");
//         if (confirmed) {
//             localStorage.removeItem('token');
//             navigate('/login');
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-100">
//             <header className="bg-white shadow p-4 flex justify-between items-center">
//                 <h1 className="text-2xl font-bold">Job Application Tracker</h1>
//                 <nav className="flex items-center space-x-4">
//                     <Link to="/" className="text-blue-600 hover:underline mx-2">Home</Link>
//                     <Link to="/applications" className="text-blue-600 hover:underline mx-2">Applications</Link>
//                     <Link to="/resumes" className="text-blue-600 hover:underline mx-2">Resumes</Link>
//                     <Link to="/profile" className="text-blue-600 hover:underline mx-2">Profile</Link>
//                     {isAdmin && (
//                         <button
//                             onClick={handleDeleteAll}
//                             className="text-red-600 hover:underline mx-2"
//                         >
//                             Delete All
//                         </button>
//                     )}
//                     <button onClick={handleLogout} className="text-red-500 hover:underline mx-2">Logout</button>
//                 </nav>
//             </header>

//             <div className="relative m-4 flex items-center justify-center">
//                 <div className="absolute left-0">
//                     <Link to="/applications/new">
//                         <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
//                             New Application
//                         </button>
//                     </Link>
//                 </div>
//                 <h2 className="text-3xl font-bold">My Applications</h2>
//                 <div className="absolute right-0">
//                     <input
//                         type="text"
//                         placeholder="Search by company, job title or status"
//                         value={searchTerm}
//                         onChange={e => setSearchTerm(e.target.value)}
//                         className="border rounded p-2 w-80"
//                     />
//                     <button
//                         onClick={handleDownloadCSV}
//                         className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ml-2"
//                     >
//                         Download CSV
//                     </button>
//                 </div>
//             </div>
//             {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

//             <div className="overflow-x-auto bg-white rounded shadow">
//                 <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                         <tr>
//                             {isAdmin && (
//                                 <th
//                                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                                     onClick={() => requestSort('userFullName')}
//                                 >
//                                     Name {getSortIndicator('userFullName')}
//                                 </th>
//                             )}
//                             <th
//                                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                                 onClick={() => requestSort('companyName')}
//                             >
//                                 Company {getSortIndicator('companyName')}
//                             </th>
//                             <th
//                                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                                 onClick={() => requestSort('jobTitle')}
//                             >
//                                 Job Title {getSortIndicator('jobTitle')}
//                             </th>
//                             <th
//                                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                                 onClick={() => requestSort('dateApplied')}
//                             >
//                                 Date Applied {getSortIndicator('dateApplied')}
//                             </th>
//                             <th
//                                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                                 onClick={() => requestSort('status')}
//                             >
//                                 Status {getSortIndicator('status')}
//                             </th>
//                             <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 Action
//                             </th>
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                         {sortedAndFiltered.map(app => (
//                             <tr key={app.applicationId}>
//                                 {isAdmin && (
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
//                                         {app.userFullName || 'N/A'}
//                                     </td>
//                                 )}
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
//                                     {app.companyName}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
//                                     {app.jobTitle}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
//                                     {new Date(app.dateApplied).toLocaleDateString()}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
//                                     {app.status}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-center">
//                                     <div className="flex justify-center space-x-2">
//                                         <Link
//                                             to={`/applications/${app.applicationId}`}
//                                             className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
//                                         >
//                                             View
//                                         </Link>
//                                         <Link
//                                             to={`/applications/edit/${app.applicationId}`}
//                                             className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
//                                         >
//                                             Edit
//                                         </Link>
//                                         <button
//                                             onClick={() => handleDelete(app.applicationId)}
//                                             className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
//                                         >
//                                             Delete
//                                         </button>
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {applications.length === 0 && !error && (
//                 <p className="mt-4 text-gray-600 text-center">No applications found.</p>
//             )}
//         </div>
//     );
// }

import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

const getStatusColor = (status) => {
    const colorMap = {
        'Pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'Applied': 'bg-blue-100 text-blue-700 border-blue-200',
        'Interview': 'bg-purple-100 text-purple-700 border-purple-200',
        'Offer': 'bg-green-100 text-green-700 border-green-200',
        'Rejected': 'bg-red-100 text-red-700 border-red-200',
        'Withdrawn': 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-700 border-gray-200';
};

export default function ApplicationsPage() {
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'dateApplied', direction: 'descending' });
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

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
            ? 'https://jat.azurewebsites.net/api/applications/all'
            : 'https://jat.azurewebsites.net/api/applications';

        if (token) {
            axios.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    setApplications(res.data);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error('Failed to load applications', err);
                    setError('Could not load applications');
                    setIsLoading(false);
                });
        }
    }, []);

    const handleDeleteAll = async () => {
        if (!window.confirm('Are you sure you want to delete ALL applications? This action cannot be undone.')) return;
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

    const handleDelete = async (id, companyName, jobTitle) => {
        if (!window.confirm(`Are you sure you want to delete the application for "${jobTitle}" at "${companyName}"? This action cannot be undone.`)) return;
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
        if (sortedAndFiltered.length === 0) {
            alert('No applications to export.');
            return;
        }

        const firstApp = sortedAndFiltered[0];
        let userName = firstApp?.userFullName || 'user';

        userName = userName.replace(/\s+/g, '_');
        const keywordPart = searchTerm ? `_${searchTerm.replace(/\s+/g, '_')}` : '';
        const dateOnly = new Date().toISOString().split('T')[0];

        const fileName = `${userName}_applications${keywordPart}_${dateOnly}.csv`;

        const csvData = sortedAndFiltered.map(app => ({
            Name: isAdmin ? app.userFullName : undefined,
            Company: app.companyName,
            JobTitle: app.jobTitle,
            Status: app.status,
            DateApplied: new Date(app.dateApplied).toLocaleDateString(),
            JobLocation: app.jobLocation,
            EmploymentType: app.employmentType,
            WorkModel: app.workModel,
            SalaryRange: app.salaryRange || '',
            Description: app.description || ''
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
        saveAs(blob, fileName);
    };

    const sortedAndFiltered = useMemo(() => {
        let filtered = applications.filter(app => {
            const term = searchTerm.toLowerCase();
            return (
                (app.userFullName?.toLowerCase() || '').includes(term) ||
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

                if (sortConfig.key === 'dateApplied') {
                    aVal = new Date(aVal);
                    bVal = new Date(bVal);
                }

                if (aVal < bVal) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }

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
        sortConfig.key === key ? (sortConfig.direction === 'ascending' ? ' ↑' : ' ↓') : '';

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
                    <p className="mt-4 text-gray-600">Loading applications...</p>
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
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm">
                            New Application
                        </button>
                    </Link>
                </div>
                <h2 className="text-3xl font-bold">My Applications</h2>
                <div className="absolute right-0 flex items-center space-x-3">
                    <input
                        type="text"
                        placeholder="Search applications..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                        onClick={handleDownloadCSV}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 shadow-sm"
                        disabled={sortedAndFiltered.length === 0}
                        title={sortedAndFiltered.length === 0 ? 'No applications to export' : 'Export to CSV'}
                    >
                        Export CSV
                    </button>
                    <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                        {sortedAndFiltered.length} application{sortedAndFiltered.length !== 1 ? 's' : ''}
                    </div>
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
                            {isAdmin && (
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                                    onClick={() => requestSort('userFullName')}
                                >
                                    User{getSortIndicator('userFullName')}
                                </th>
                            )}
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
                                onClick={() => requestSort('dateApplied')}
                            >
                                Date Applied{getSortIndicator('dateApplied')}
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
                        {sortedAndFiltered.map((app, index) => (
                            <tr key={app.applicationId} className="hover:bg-gray-50 transition duration-150">
                                {isAdmin && (
                                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-3 shadow-sm">
                                                <span className="text-white font-semibold text-xs">
                                                    {app.userFullName?.charAt(0)?.toUpperCase() || 'U'}
                                                </span>
                                            </div>
                                            <span className="font-medium">{app.userFullName || 'N/A'}</span>
                                        </div>
                                    </td>
                                )}
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
                                        {new Date(app.dateApplied).toLocaleDateString()}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {Math.ceil((new Date() - new Date(app.dateApplied)) / (1000 * 60 * 60 * 24))} days ago
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
                                        <button
                                            onClick={() => handleDelete(app.applicationId, app.companyName, app.jobTitle)}
                                            className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition duration-200 text-xs font-medium shadow-sm"
                                            title="Delete application"
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

            {sortedAndFiltered.length === 0 && !error && (
                <div className="mt-12 text-center">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mx-4 max-w-md mx-auto">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {searchTerm ? 'No applications found' : 'No applications yet'}
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {searchTerm
                                ? 'Try adjusting your search terms to find what you\'re looking for.'
                                : 'Start tracking your job applications by creating your first one.'
                            }
                        </p>
                        {!searchTerm && (
                            <Link to="/applications/new">
                                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm">
                                    Create Your First Application
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
