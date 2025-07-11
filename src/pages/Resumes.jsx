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

export default function ResumesPage() {
    const [resumes, setResumes] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
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
                .then(res => setResumes(res.data))
                .catch(() => setError('Failed to load resumes'));
        }
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this resume?')) return;
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
        if (!window.confirm("Are you sure you want to delete all resumes?")) return;

        const token = localStorage.getItem('token');
        try {
            await axios.delete("https://jat.azurewebsites.net/api/resumes/admin/delete-all", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResumes([]);
            alert("All resumes deleted.");
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
        } catch {
            alert("Failed to download resume.");
        }
    };

    const filteredResumes = useMemo(() => {
        return resumes.filter(res =>
            res.fileName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [resumes, searchTerm]);

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
                <h2 className="text-3xl font-bold">My Resumes</h2>
                <div className="absolute right-0">
                    <input
                        type="text"
                        placeholder="Search by file name"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="border rounded p-2 w-80"
                    />
                </div>
            </div>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {isAdmin && (
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                            )}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                File Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                File Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Size
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Uploaded
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredResumes.map(resume => (
                            <tr key={resume.resumeId}>
                                {isAdmin && (
                                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                        {resume.userName}
                                    </td>
                                )}
                                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">{resume.fileName}</td>
                                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                    {getDisplayFileType(resume.fileType)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">{(resume.fileSize / 1024).toFixed(1)} KB</td>
                                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                    {resume.uploadDate ? new Date(resume.uploadDate).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="flex justify-center space-x-2">
                                        <button
                                            onClick={() => handleDownload(resume.resumeId, resume.fileName, resume.filePath)}
                                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                        >
                                            Download
                                        </button>
                                        <button
                                            onClick={() => handleDelete(resume.resumeId)}
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

            {filteredResumes.length === 0 && !error && (
                <p className="mt-4 text-center text-gray-600">No resumes found.</p>
            )}
        </div>
    );
}