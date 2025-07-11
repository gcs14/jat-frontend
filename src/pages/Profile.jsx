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

//             <main className="p-6 max-w-3xl mx-auto">
//                 <h2 className="text-3xl font-semibold mb-6">Your Profile</h2>
//                 <div className="bg-white p-6 rounded shadow space-y-4">
//                     <div>
//                         <label className="block font-medium">Name</label>
//                         <input
//                             name="name"
//                             value={user.name || ''}
//                             onChange={handleInputChange}
//                             className="w-full mt-1 p-2 border rounded"
//                         />
//                     </div>
//                     <div>
//                         <label className="block font-medium">Email</label>
//                         <input
//                             name="email"
//                             value={user.email || ''}
//                             onChange={handleInputChange}
//                             className="w-full mt-1 p-2 border rounded"
//                         />
//                     </div>
//                     <div>
//                         <label className="block font-medium">Phone Number</label>
//                         <input
//                             name="phoneNumber"
//                             value={user.phoneNumber || ''}
//                             onChange={handleInputChange}
//                             className="w-full mt-1 p-2 border rounded"
//                         />
//                     </div>
//                     <button onClick={handleSaveProfile} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">Save Profile</button>
//                     <button
//                         type="button"
//                         onClick={() => navigate(-1)}
//                         className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition mx-2"
//                     >
//                         Cancel
//                     </button>
//                 </div>

//                 <h3 className="text-xl font-semibold mt-8 mb-2">Change Password</h3>
//                 <div className="bg-white p-6 rounded shadow space-y-4">
//                     <div>
//                         <label className="block font-medium">Current Password</label>
//                         <input
//                             type="password"
//                             value={passwords.currentPassword}
//                             onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
//                             className="w-full mt-1 p-2 border rounded"
//                         />
//                     </div>
//                     <div>
//                         <label className="block font-medium">New Password</label>
//                         <input
//                             type="password"
//                             value={passwords.newPassword}
//                             onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
//                             className="w-full mt-1 p-2 border rounded"
//                         />
//                     </div>
//                     <div>
//                         <label className="block font-medium">Confirm New Password</label>
//                         <input
//                             type="password"
//                             value={passwords.confirmNewPassword || ''}
//                             onChange={(e) => setPasswords({ ...passwords, confirmNewPassword: e.target.value })}
//                             className="w-full mt-1 p-2 border rounded"
//                         />
//                     </div>
//                     <button
//                         type="button"
//                         onClick={handlePasswordChange}
//                         className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">
//                         Update Password
//                     </button>
//                     <button
//                         type="button"
//                         onClick={() => navigate(-1)}
//                         className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition mx-2"
//                     >
//                         Cancel
//                     </button>
//                 </div>

//                 {!isAdmin && (
//                     <div className="mt-8">
//                         <h3 className="text-xl font-semibold text-red-600">Account Actions</h3>
//                         <button onClick={handleDeleteAccount} className="mt-2 bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700">
//                             Delete Account
//                         </button>
//                         <button
//                             onClick={handleRestartDatabase}
//                             className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 mx-2"
//                         >
//                             Restart Database
//                         </button>
//                         <button
//                             type="button"
//                             onClick={() => navigate(-1)}
//                             className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 )}
//                 {isAdmin && (
//                     <div className="mt-8">
//                         <h3 className="text-xl font-semibold text-red-600">Account Actions</h3>
//                         <button
//                             onClick={handleRestartDatabase}
//                             className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 mx-2"
//                         >
//                             Restart Database
//                         </button>
//                         <button
//                             type="button"
//                             onClick={() => navigate(-1)}
//                             className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 )}
//             </main>
//         </div>
//     );
// }

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function ProfilePage() {
    const [user, setUser] = useState({});
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        axios.get('https://jat.azurewebsites.net/api/users/profile', { headers })
            .then(res => {
                setUser(res.data);
                setIsAdmin(res.data.role === 'Admin');
            })
            .catch(err => console.error('Failed to load user profile:', err));
    }, []);

    const handleInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            await axios.put('https://jat.azurewebsites.net/api/users/profile', {
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber
            }, { headers });

            alert('Profile updated!');
            navigate('/');
        } catch (err) {
            console.error('Error updating profile:', err);
        }
    };

    const handlePasswordChange = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            await axios.post('https://jat.azurewebsites.net/api/users/change-password', passwords, { headers });
            alert('Password updated!');
            setPasswords({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
            navigate('/');
        } catch (err) {
            console.error('Error changing password:', err);
            const errorMessage = err?.response?.data || 'Password change failed.';
            alert(errorMessage);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure you want to delete this account?')) return;
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            await axios.delete('https://jat.azurewebsites.net/api/users/profile', { headers });
            alert('Account deleted.');
            localStorage.removeItem('token');
            navigate('/login');
        } catch (err) {
            console.error('Failed to delete account:', err);
        }
    };

    const handleRestartDatabase = async () => {
        if (!window.confirm("This will erase all data and restart the demo. Continue?")) return;

        try {
            await axios.post("https://jat.azurewebsites.net/api/demo/restart");
            alert("Database restarted. Reloading...");
            // window.location.reload();
            navigate('/login');
        } catch (err) {
            console.error("Restart failed", err);
            alert("Something went wrong.");
        }
    };

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
                <nav>
                    <Link to="/" className="text-blue-600 hover:underline mx-2">Home</Link>
                    <Link to="/applications" className="text-blue-600 hover:underline mx-2">Applications</Link>
                    <Link to="/resumes" className="text-blue-600 hover:underline mx-2">Resumes</Link>
                    <Link to="/profile" className="text-blue-600 hover:underline mx-2">Profile</Link>
                    <button onClick={handleLogout} className="text-red-500 hover:underline mx-2">Logout</button>
                </nav>
            </header>

            <main className="p-6 max-w-6xl mx-auto">
                <h2 className="text-3xl font-semibold mb-6">Your Profile</h2>

                {/* Side-by-side grid layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Profile Information Section */}
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-medium">Name</label>
                                <input
                                    name="name"
                                    value={user.name || ''}
                                    onChange={handleInputChange}
                                    className="w-full mt-1 p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block font-medium">Email</label>
                                <input
                                    name="email"
                                    value={user.email || ''}
                                    onChange={handleInputChange}
                                    className="w-full mt-1 p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block font-medium">Phone Number</label>
                                <input
                                    name="phoneNumber"
                                    value={user.phoneNumber || ''}
                                    onChange={handleInputChange}
                                    className="w-full mt-1 p-2 border rounded"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSaveProfile}
                                    className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                                >
                                    Save Profile
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Password Change Section */}
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="text-xl font-semibold mb-4">Change Password</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-medium">Current Password</label>
                                <input
                                    type="password"
                                    value={passwords.currentPassword}
                                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                    className="w-full mt-1 p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block font-medium">New Password</label>
                                <input
                                    type="password"
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    className="w-full mt-1 p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block font-medium">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwords.confirmNewPassword || ''}
                                    onChange={(e) => setPasswords({ ...passwords, confirmNewPassword: e.target.value })}
                                    className="w-full mt-1 p-2 border rounded"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handlePasswordChange}
                                    className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
                                >
                                    Update Password
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Actions Section */}
                {!isAdmin && (
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="text-xl font-semibold text-red-600 mb-4">Account Actions</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={handleDeleteAccount}
                                className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
                            >
                                Delete Account
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
                {isAdmin && (
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="text-xl font-semibold text-red-600 mb-4">Admin Actions</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={handleRestartDatabase}
                                className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900"
                            >
                                Restart Database
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}