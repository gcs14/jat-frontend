// import React, { useEffect, useState, useMemo } from 'react';
// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';

// const getDisplayFileType = (mimeType) => {
//     const typeMap = {
//         'application/pdf': 'PDF',
//         'application/msword': 'DOC',
//         'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
//         'text/plain': 'TXT'
//     };

//     return typeMap[mimeType] || mimeType.split('/').pop().toUpperCase();
// };

// export default function ResumesPage() {
//     const [resumes, setResumes] = useState([]);
//     const [error, setError] = useState('');
//     const [searchTerm, setSearchTerm] = useState('');
//     const [isAdmin, setIsAdmin] = useState(false);
//     const navigate = useNavigate();

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

//         if (token) {
//             axios.get('https://jat.azurewebsites.net/api/resumes', {
//                 headers: { Authorization: `Bearer ${token}` }
//             })
//                 .then(res => setResumes(res.data))
//                 .catch(() => setError('Failed to load resumes'));
//         }
//     }, []);

//     const handleDelete = async (id) => {
//         if (!window.confirm('Delete this resume?')) return;
//         const token = localStorage.getItem('token');
//         try {
//             await axios.delete(`https://jat.azurewebsites.net/api/resumes/${id}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setResumes(prev => prev.filter(r => r.resumeId !== id));
//         } catch {
//             setError('Failed to delete resume');
//         }
//     };

//     const handleDeleteAll = async () => {
//         if (!window.confirm("Are you sure you want to delete all resumes?")) return;

//         const token = localStorage.getItem('token');
//         try {
//             await axios.delete("https://jat.azurewebsites.net/api/resumes/admin/delete-all", {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setResumes([]);
//             alert("All resumes deleted.");
//         } catch (err) {
//             if (err.response?.data) {
//                 alert(err.response.data);
//             } else {
//                 alert("Failed to delete all resumes.");
//             }
//         }
//     };

//     const handleDownload = async (id, fileName, filePath) => {
//         if (!filePath) {
//             alert("This resume is part of a demo and cannot be downloaded.");
//             return;
//         }

//         const token = localStorage.getItem('token');
//         try {
//             const response = await axios.get(`https://jat.azurewebsites.net/api/resumes/${id}/download`, {
//                 responseType: 'blob',
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             const url = window.URL.createObjectURL(new Blob([response.data]));
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', fileName || 'resume.pdf');
//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//         } catch {
//             alert("Failed to download resume.");
//         }
//     };

//     const filteredResumes = useMemo(() => {
//         return resumes.filter(res =>
//             res.fileName?.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//     }, [resumes, searchTerm]);

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
//                 <h2 className="text-3xl font-bold">My Resumes</h2>
//                 <div className="absolute right-0">
//                     <input
//                         type="text"
//                         placeholder="Search by file name"
//                         value={searchTerm}
//                         onChange={e => setSearchTerm(e.target.value)}
//                         className="border rounded p-2 w-80"
//                     />
//                 </div>
//             </div>

//             {error && <p className="text-red-500 text-center mb-4">{error}</p>}

//             <div className="overflow-x-auto bg-white rounded shadow">
//                 <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                         <tr>
//                             {isAdmin && (
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     User
//                                 </th>
//                             )}
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 File Name
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 File Type
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 Size
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 Uploaded
//                             </th>
//                             <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 Actions
//                             </th>
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                         {filteredResumes.map(resume => (
//                             <tr key={resume.resumeId}>
//                                 {isAdmin && (
//                                     <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
//                                         {resume.userName}
//                                     </td>
//                                 )}
//                                 <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">{resume.fileName}</td>
//                                 <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
//                                     {getDisplayFileType(resume.fileType)}
//                                 </td>
//                                 <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">{(resume.fileSize / 1024).toFixed(1)} KB</td>
//                                 <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
//                                     {resume.uploadDate ? new Date(resume.uploadDate).toLocaleDateString() : 'N/A'}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-center">
//                                     <div className="flex justify-center space-x-2">
//                                         <button
//                                             onClick={() => handleDownload(resume.resumeId, resume.fileName, resume.filePath)}
//                                             className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
//                                         >
//                                             Download
//                                         </button>
//                                         <button
//                                             onClick={() => handleDelete(resume.resumeId)}
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

//             {filteredResumes.length === 0 && !error && (
//                 <p className="mt-4 text-center text-gray-600">No resumes found.</p>
//             )}
//         </div>
//     );
// }

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const getDisplayFileType = (mimeType) => {
    const typeMap = {
        'application/pdf': 'PDF',
        'application/msword': 'DOC',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
        'text/plain': 'TXT'
    };

    return typeMap[mimeType] || mimeType.split('/').pop().toUpperCase();
};

const getFileTypeColor = (fileType) => {
    const colorMap = {
        'PDF': 'bg-red-100 text-red-700 border-red-200',
        'DOC': 'bg-blue-100 text-blue-700 border-blue-200',
        'DOCX': 'bg-blue-100 text-blue-700 border-blue-200',
        'TXT': 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colorMap[fileType] || 'bg-gray-100 text-gray-700 border-gray-200';
};

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export default function ResumesPage() {
    const [resumes, setResumes] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: 'uploadDate', direction: 'descending' });
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

        if (token) {
            axios.get('https://jat.azurewebsites.net/api/resumes', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    setResumes(res.data);
                    setIsLoading(false);
                })
                .catch(() => {
                    setError('Failed to load resumes');
                    setIsLoading(false);
                });
        }
    }, []);

    const handleDelete = async (id, fileName) => {
        if (!window.confirm(`Are you sure you want to delete "${fileName}"? This action cannot be undone.`)) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`https://jat.azurewebsites.net/api/resumes/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResumes(prev => prev.filter(r => r.resumeId !== id));
        } catch {
            setError('Failed to delete resume');
        }
    };

    const handleDeleteAll = async () => {
        if (!window.confirm("Are you sure you want to delete all resumes? This action cannot be undone.")) return;

        const token = localStorage.getItem('token');
        try {
            await axios.delete("https://jat.azurewebsites.net/api/resumes/admin/delete-all", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResumes([]);
            alert("All resumes deleted successfully.");
        } catch (err) {
            if (err.response?.data) {
                alert(err.response.data);
            } else {
                alert("Failed to delete all resumes.");
            }
        }
    };

    const handleDownload = async (id, fileName, filePath) => {
        if (!filePath) {
            alert("This resume is part of a demo and cannot be downloaded.");
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`https://jat.azurewebsites.net/api/resumes/${id}/download`, {
                responseType: 'blob',
                headers: { Authorization: `Bearer ${token}` }
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName || 'resume.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch {
            alert("Failed to download resume.");
        }
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
        }
        return '';
    };

    const sortedAndFilteredResumes = useMemo(() => {
        let filtered = resumes.filter(res =>
            res.fileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (isAdmin && res.userName?.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];

                if (sortConfig.key === 'uploadDate') {
                    aVal = new Date(aVal);
                    bVal = new Date(bVal);
                }

                if (aVal < bVal) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aVal > bVal) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        return filtered;
    }, [resumes, searchTerm, sortConfig, isAdmin]);

    const handleLogout = () => {
        const confirmed = window.confirm("Are you sure you want to logout?");
        if (confirmed) {
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    const handleUploadNew = () => {
        navigate('/applications/new');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading resumes...</p>
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
                    <button
                        onClick={handleUploadNew}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 shadow-sm"
                    >
                        Upload Resume
                    </button>
                </div>
                <h2 className="text-3xl font-bold">My Resumes</h2>
                <div className="absolute right-0 flex items-center space-x-3">
                    <input
                        type="text"
                        placeholder="Search resumes..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                        {sortedAndFilteredResumes.length} resume{sortedAndFilteredResumes.length !== 1 ? 's' : ''}
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
                                    onClick={() => requestSort('userName')}
                                >
                                    User{getSortIndicator('userName')}
                                </th>
                            )}
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                                onClick={() => requestSort('fileName')}
                            >
                                File Name{getSortIndicator('fileName')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                File Type
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                                onClick={() => requestSort('fileSize')}
                            >
                                Size{getSortIndicator('fileSize')}
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                                onClick={() => requestSort('uploadDate')}
                            >
                                Uploaded{getSortIndicator('uploadDate')}
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedAndFilteredResumes.map((resume, index) => (
                            <tr key={resume.resumeId} className="hover:bg-gray-50 transition duration-150">
                                {isAdmin && (
                                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-3 shadow-sm">
                                                <span className="text-white font-semibold text-xs">
                                                    {resume.userName?.charAt(0)?.toUpperCase() || 'U'}
                                                </span>
                                            </div>
                                            <span className="font-medium">{resume.userName || 'Unknown User'}</span>
                                        </div>
                                    </td>
                                )}
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    <div className="font-medium truncate max-w-xs" title={resume.fileName}>
                                        {resume.fileName}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border ${getFileTypeColor(getDisplayFileType(resume.fileType))}`}>
                                        {getDisplayFileType(resume.fileType)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap font-mono">
                                    {formatFileSize(resume.fileSize)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="font-medium">
                                            {resume.uploadDate ? new Date(resume.uploadDate).toLocaleDateString() : 'N/A'}
                                        </span>
                                        {resume.uploadDate && (
                                            <span className="text-xs text-gray-400">
                                                {new Date(resume.uploadDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="flex justify-center space-x-2">
                                        <button
                                            onClick={() => handleDownload(resume.resumeId, resume.fileName, resume.filePath)}
                                            className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-xs font-medium shadow-sm"
                                            title="Download resume"
                                        >
                                            Download
                                        </button>
                                        <button
                                            onClick={() => handleDelete(resume.resumeId, resume.fileName)}
                                            className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition duration-200 text-xs font-medium shadow-sm"
                                            title="Delete resume"
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

            {sortedAndFilteredResumes.length === 0 && !error && (
                <div className="mt-12 text-center">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mx-4 max-w-md mx-auto">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No resumes found</h3>
                        <p className="text-gray-500 mb-6">
                            {searchTerm ? 'Try adjusting your search terms' : 'Upload your first resume to get started'}
                        </p>
                        {!searchTerm && (
                            <button
                                onClick={handleUploadNew}
                                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200 inline-flex items-center shadow-sm"
                            >
                                Upload Your First Resume
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}