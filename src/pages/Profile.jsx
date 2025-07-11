// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';

// export default function ProfilePage() {
//     const [user, setUser] = useState({});
//     const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
//     const [isAdmin, setIsAdmin] = useState(false);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         const headers = { Authorization: `Bearer ${token}` };

//         axios.get('https://jat.azurewebsites.net/api/users/profile', { headers })
//             .then(res => {
//                 setUser(res.data);
//                 setIsAdmin(res.data.role === 'Admin');
//             })
//             .catch(err => console.error('Failed to load user profile:', err));
//     }, []);

//     const handleInputChange = (e) => {
//         setUser({ ...user, [e.target.name]: e.target.value });
//     };

//     const handleSaveProfile = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             const headers = { Authorization: `Bearer ${token}` };

//             await axios.put('https://jat.azurewebsites.net/api/users/profile', {
//                 name: user.name,
//                 email: user.email,
//                 phoneNumber: user.phoneNumber
//             }, { headers });

//             alert('Profile updated!');
//             navigate('/');
//         } catch (err) {
//             console.error('Error updating profile:', err);
//         }
//     };

//     const handlePasswordChange = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             const headers = { Authorization: `Bearer ${token}` };

//             await axios.post('https://jat.azurewebsites.net/api/users/change-password', passwords, { headers });
//             alert('Password updated!');
//             setPasswords({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
//             navigate('/');
//         } catch (err) {
//             console.error('Error changing password:', err);
//             const errorMessage = err?.response?.data || 'Password change failed.';
//             alert(errorMessage);
//         }
//     };

//     const handleDeleteAccount = async () => {
//         if (!window.confirm('Are you sure you want to delete this account?')) return;
//         try {
//             const token = localStorage.getItem('token');
//             const headers = { Authorization: `Bearer ${token}` };

//             await axios.delete('https://jat.azurewebsites.net/api/users/profile', { headers });
//             alert('Account deleted.');
//             localStorage.removeItem('token');
//             navigate('/login');
//         } catch (err) {
//             console.error('Failed to delete account:', err);
//         }
//     };

//     const handleRestartDatabase = async () => {
//         if (!window.confirm("This will erase all data and restart the demo. Continue?")) return;

//         try {
//             await axios.post("https://jat.azurewebsites.net/api/demo/restart");
//             alert("Database restarted. Reloading...");
//             // window.location.reload();
//             navigate('/login');
//         } catch (err) {
//             console.error("Restart failed", err);
//             alert("Something went wrong.");
//         }
//     };

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
//                 <nav>
//                     <Link to="/" className="text-blue-600 hover:underline mx-2">Home</Link>
//                     <Link to="/applications" className="text-blue-600 hover:underline mx-2">Applications</Link>
//                     <Link to="/resumes" className="text-blue-600 hover:underline mx-2">Resumes</Link>
//                     <Link to="/profile" className="text-blue-600 hover:underline mx-2">Profile</Link>
//                     <button onClick={handleLogout} className="text-red-500 hover:underline mx-2">Logout</button>
//                 </nav>
//             </header>

//             <main className="p-6 max-w-6xl mx-auto">
//                 {/* Header with centered title and right-aligned action buttons */}
//                 <div className="relative m-4 flex items-center justify-center mb-8">
//                     <h2 className="text-3xl font-bold">Your Profile</h2>
//                     <div className="absolute right-0 flex gap-2">
//                         {!isAdmin && (
//                             <button
//                                 onClick={handleDeleteAccount}
//                                 className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
//                             >
//                                 Delete Account
//                             </button>
//                         )}
//                         {isAdmin && (
//                             <button
//                                 onClick={handleRestartDatabase}
//                                 className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900"
//                             >
//                                 Restart Database
//                             </button>
//                         )}
//                     </div>
//                 </div>

//                 {/* Side-by-side grid layout */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//                     {/* Profile Information Section */}
//                     <div className="bg-white p-6 rounded shadow">
//                         <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
//                         <div className="space-y-4">
//                             <div>
//                                 <label className="block font-medium">Name</label>
//                                 <input
//                                     name="name"
//                                     value={user.name || ''}
//                                     onChange={handleInputChange}
//                                     className="w-full mt-1 p-2 border rounded"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block font-medium">Email</label>
//                                 <input
//                                     name="email"
//                                     value={user.email || ''}
//                                     onChange={handleInputChange}
//                                     className="w-full mt-1 p-2 border rounded"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block font-medium">Phone Number</label>
//                                 <input
//                                     name="phoneNumber"
//                                     value={user.phoneNumber || ''}
//                                     onChange={handleInputChange}
//                                     className="w-full mt-1 p-2 border rounded"
//                                 />
//                             </div>
//                             <div className="flex gap-2">
//                                 <button
//                                     onClick={handleSaveProfile}
//                                     className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
//                                 >
//                                     Save Profile
//                                 </button>
//                                 <button
//                                     type="button"
//                                     onClick={() => navigate(-1)}
//                                     className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Password Change Section */}
//                     <div className="bg-white p-6 rounded shadow">
//                         <h3 className="text-xl font-semibold mb-4">Change Password</h3>
//                         <div className="space-y-4">
//                             <div>
//                                 <label className="block font-medium">Current Password</label>
//                                 <input
//                                     type="password"
//                                     value={passwords.currentPassword}
//                                     onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
//                                     className="w-full mt-1 p-2 border rounded"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block font-medium">New Password</label>
//                                 <input
//                                     type="password"
//                                     value={passwords.newPassword}
//                                     onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
//                                     className="w-full mt-1 p-2 border rounded"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block font-medium">Confirm New Password</label>
//                                 <input
//                                     type="password"
//                                     value={passwords.confirmNewPassword || ''}
//                                     onChange={(e) => setPasswords({ ...passwords, confirmNewPassword: e.target.value })}
//                                     className="w-full mt-1 p-2 border rounded"
//                                 />
//                             </div>
//                             <div className="flex gap-2">
//                                 <button
//                                     type="button"
//                                     onClick={handlePasswordChange}
//                                     className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
//                                 >
//                                     Update Password
//                                 </button>
//                                 <button
//                                     type="button"
//                                     onClick={() => navigate(-1)}
//                                     className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// }

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function ProfilePage() {
    const [user, setUser] = useState({});
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
    const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        axios.get('https://jat.azurewebsites.net/api/users/profile', { headers })
            .then(res => {
                setUser(res.data);
                setIsAdmin(res.data.role === 'Admin');
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Failed to load user profile:', err);
                setError('Failed to load profile data');
                setIsLoading(false);
            });
    }, []);

    const handleInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmittingProfile(true);

        // Validation
        if (!user.name?.trim() || !user.email?.trim()) {
            setError('Name and email are required.');
            setIsSubmittingProfile(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            await axios.put('https://jat.azurewebsites.net/api/users/profile', {
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber
            }, { headers });

            alert('Profile updated successfully!');
            navigate('/');
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile. Please try again.');
        } finally {
            setIsSubmittingProfile(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmittingPassword(true);

        // Validation
        if (!passwords.currentPassword || !passwords.newPassword) {
            setError('Current password and new password are required.');
            setIsSubmittingPassword(false);
            return;
        }

        if (passwords.newPassword !== passwords.confirmNewPassword) {
            setError('New passwords do not match.');
            setIsSubmittingPassword(false);
            return;
        }

        if (passwords.newPassword.length < 6) {
            setError('New password must be at least 6 characters long.');
            setIsSubmittingPassword(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            await axios.post('https://jat.azurewebsites.net/api/users/change-password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            }, { headers });

            alert('Password updated successfully!');
            setPasswords({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
            navigate('/');
        } catch (err) {
            console.error('Error changing password:', err);
            const errorMessage = err?.response?.data || 'Password change failed.';
            setError(typeof errorMessage === 'string' ? errorMessage : 'Password change failed.');
        } finally {
            setIsSubmittingPassword(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;

        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            await axios.delete('https://jat.azurewebsites.net/api/users/profile', { headers });
            alert('Account deleted successfully.');
            localStorage.removeItem('token');
            navigate('/login');
        } catch (err) {
            console.error('Failed to delete account:', err);
            alert('Failed to delete account. Please try again.');
        }
    };

    const handleRestartDatabase = async () => {
        if (!window.confirm("This will erase all data and restart the demo. Continue?")) return;

        try {
            await axios.post("https://jat.azurewebsites.net/api/demo/restart");
            alert("Database restarted successfully. Redirecting to login...");
            navigate('/login');
        } catch (err) {
            console.error("Restart failed", err);
            alert("Failed to restart database. Please try again.");
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
                    <p className="mt-4 text-gray-600">Loading profile...</p>
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

            <div className="max-w-6xl mx-auto mt-8 p-6">
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
                        <div className="flex items-center space-x-3">
                            {!isAdmin && (
                                <button
                                    onClick={handleDeleteAccount}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition duration-200"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Delete Account
                                </button>
                            )}
                            {isAdmin && (
                                <button
                                    onClick={handleRestartDatabase}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-800 hover:bg-red-900 transition duration-200"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                    </svg>
                                    Restart Database
                                </button>
                            )}
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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Profile Information Section */}
                        <div className="border-b border-gray-200 pb-6 lg:border-b-0 lg:border-r lg:border-gray-200 lg:pr-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                            <form onSubmit={handleSaveProfile} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={user.name || ''}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={user.email || ''}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter your email address"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={user.phoneNumber || ''}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                                {isAdmin && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Role
                                        </label>
                                        <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-blue-100 text-blue-800">
                                                Administrator
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <div className="flex space-x-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmittingProfile}
                                        className={`px-6 py-2 rounded-lg font-medium transition duration-200 ${isSubmittingProfile
                                            ? 'bg-gray-400 text-white cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                                            }`}
                                    >
                                        {isSubmittingProfile ? (
                                            <div className="flex items-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Saving...
                                            </div>
                                        ) : (
                                            'Save Profile'
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => navigate(-1)}
                                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Password Change Section */}
                        <div className="lg:pl-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Current Password *
                                    </label>
                                    <input
                                        type="password"
                                        value={passwords.currentPassword}
                                        onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter current password"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        New Password *
                                    </label>
                                    <input
                                        type="password"
                                        value={passwords.newPassword}
                                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                        required
                                        minLength={6}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter new password (min 6 characters)"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm New Password *
                                    </label>
                                    <input
                                        type="password"
                                        value={passwords.confirmNewPassword}
                                        onChange={(e) => setPasswords({ ...passwords, confirmNewPassword: e.target.value })}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                    <div className="flex">
                                        <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                        <div className="text-sm text-blue-700">
                                            <p className="font-medium">Password Requirements:</p>
                                            <ul className="mt-1 list-disc list-inside space-y-1">
                                                <li>Minimum 6 characters long</li>
                                                <li>New password must be different from current password</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmittingPassword}
                                        className={`px-6 py-2 rounded-lg font-medium transition duration-200 ${isSubmittingPassword
                                            ? 'bg-gray-400 text-white cursor-not-allowed'
                                            : 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
                                            }`}
                                    >
                                        {isSubmittingPassword ? (
                                            <div className="flex items-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Updating...
                                            </div>
                                        ) : (
                                            'Update Password'
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPasswords({ currentPassword: '', newPassword: '', confirmNewPassword: '' })}
                                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}