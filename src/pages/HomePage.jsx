// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
// import axios from 'axios';

// export default function HomePage() {
//   const [firstName, setFirstName] = useState('');
//   const [role, setRole] = useState('');
//   const [stats, setStats] = useState({
//     submitted: 0,
//     interviewing: 0,
//     offered: 0,
//     rejected: 0,
//     pending: 0
//   });
//   const [recentApps, setRecentApps] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const headers = { Authorization: `Bearer ${token}` };

//     axios.get('https://jat.azurewebsites.net/api/users/profile', { headers })
//       .then(res => {
//         console.log("USER PROFILE:", res.data);
//         setFirstName(res.data.name.split(' ')[0]);
//         setRole(res.data.role);

//         fetchRecentApps(headers);
//       })
//       .catch(err => console.error('Profile load failed', err));

//     fetchStats(headers);
//   }, []);

//   const fetchStats = async (headers) => {
//     try {
//       const res = await axios.get('https://jat.azurewebsites.net/api/applications/stats', { headers });
//       const { totalApplications, interviewsScheduled, byStatus } = res.data;
//       const offered = byStatus['Offer Received'] || 0;
//       const rejected = byStatus['Rejected'] || 0;
//       const interviewing = interviewsScheduled;
//       const pending = totalApplications - (offered + rejected + interviewing);
//       setStats({ submitted: totalApplications, interviewing, offered, rejected, pending });
//     } catch (err) {
//       console.error('Failed to fetch stats:', err);
//     }
//   };

//   const fetchRecentApps = async (headers) => {
//     try {
//       const res = await axios.get('https://jat.azurewebsites.net/api/applications/recent', { headers });
//       setRecentApps(res.data);
//     } catch (err) {
//       console.error('Failed to fetch recent applications:', err);
//     }
//   };

//   const pieData = [
//     { name: 'Pending', value: stats.pending },
//     { name: 'Interviewing', value: stats.interviewing },
//     { name: 'Offered', value: stats.offered },
//     { name: 'Rejected', value: stats.rejected }
//   ].filter(entry => entry.value > 0);

//   const COLORS = ['#3B82F6', '#60A5FA', '#93C5FD', '#EF4444'];

//   const handleLogout = () => {
//     const confirmed = window.confirm("Are you sure you want to logout?");
//     if (confirmed) {
//       localStorage.removeItem('token');
//       navigate('/login');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <header className="bg-white shadow p-4 flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Job Application Tracker</h1>
//         <nav>
//           <Link to="/" className="text-blue-600 hover:underline mx-2">Home</Link>
//           <Link to="/applications" className="text-blue-600 hover:underline mx-2">Applications</Link>
//           <Link to="/resumes" className="text-blue-600 hover:underline mx-2">Resumes</Link>
//           <Link to="/profile" className="text-blue-600 hover:underline mx-2">Profile</Link>
//           <button onClick={handleLogout} className="text-red-500 hover:underline mx-2">Logout</button>
//         </nav>
//       </header>

//       <main className="p-6">
//         <h1 className="text-4xl font-semibold mb-4 text-center">Welcome Back, {firstName}!</h1>

//         <section className="mb-6">
//           <h2 className="text-xl font-semibold mb-2">Dashboard Overview</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="bg-white p-4 rounded shadow">
//               <p className="text-gray-500">Applications Submitted</p>
//               <h3 className="text-2xl font-bold">{stats.submitted}</h3>
//             </div>
//             <div className="bg-white p-4 rounded shadow">
//               <p className="text-gray-500">Interviews Scheduled</p>
//               <h3 className="text-2xl font-bold">{stats.interviewing}</h3>
//             </div>
//             <div className="bg-white p-4 rounded shadow">
//               <p className="text-gray-500">Offers Received</p>
//               <h3 className="text-2xl font-bold">{stats.offered}</h3>
//             </div>
//           </div>
//         </section>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-6">
//             <section className="bg-white p-4 rounded shadow">
//               <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
//               <div className="flex flex-wrap gap-4">
//                 <Link to="/applications/new" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">New Application</Link>
//                 <Link to="/resumes" className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">Manage Resumes</Link>
//                 <Link to="/followups" className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700">Upcoming Follow-Ups</Link>
//               </div>
//             </section>

//             <section className="bg-white p-4 rounded shadow">
//               <h2 className="text-xl font-semibold mb-2">Recent Applications</h2>
//               {recentApps.length === 0 ? (
//                 <p className="text-gray-500">No recent applications available.</p>
//               ) : (
//                 <ul className="divide-y">
//                   {recentApps.map(app => (
//                     <li key={app.applicationId} className="py-2 flex justify-between items-center">
//                       <div>
//                         <span className="font-semibold">{app.jobTitle}</span> at <span className="text-gray-600">{app.companyName}</span>
//                         <div className="text-sm text-gray-500">{new Date(app.dateApplied).toLocaleDateString()}</div>
//                       </div>
//                       <Link to={`/applications/${app.applicationId}`} className="bg-blue-500 text-white px-3 py-1 rounded shadow hover:bg-blue-600">
//                         View
//                       </Link>
//                     </li>
//                   ))}

//                 </ul>
//               )}
//             </section>
//           </div>

//           <section className="bg-white p-6 rounded shadow">
//             <h2 className="text-xl font-semibold mb-2">Visual Summary</h2>
//             <p className="text-lg font-medium mb-4 text-center">Total Applications: {stats.submitted}</p>
//             <ResponsiveContainer width="100%" height={250}>
//               <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
//                 <Pie
//                   data={pieData}
//                   dataKey="value"
//                   nameKey="name"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={80}
//                   label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
//                 >
//                   {pieData.map((entry, index) => (
//                     <Cell key={index} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip formatter={(value) => [`${value}`, '%']} />
//               </PieChart>
//             </ResponsiveContainer>
//             <div className="mt-4 space-y-1">
//               {pieData.map((entry, index) => {
//                 const percent = stats.submitted > 0
//                   ? ((entry.value / stats.submitted) * 100).toFixed(1)
//                   : '0.0';
//                 return (
//                   <div key={entry.name} className="flex justify-between items-center">
//                     <div className="flex items-center">
//                       <span className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
//                       <span>{entry.name}</span>
//                     </div>
//                     <div>{entry.value} ({percent}%)</div>
//                   </div>
//                 );
//               })}
//             </div>
//           </section>
//         </div>
//       </main>
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

export default function HomePage() {
  const [firstName, setFirstName] = useState('');
  const [role, setRole] = useState('');
  const [stats, setStats] = useState({
    submitted: 0,
    interviewing: 0,
    offered: 0,
    rejected: 0,
    pending: 0
  });
  const [recentApps, setRecentApps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      axios.get('https://jat.azurewebsites.net/api/users/profile', { headers }),
      fetchStats(headers),
      fetchRecentApps(headers)
    ])
      .then(([profileRes]) => {
        setFirstName(profileRes.data.name.split(' ')[0]);
        setRole(profileRes.data.role);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load dashboard data:', err);
        setError('Failed to load dashboard data');
        setIsLoading(false);
      });
  }, []);

  const fetchStats = async (headers) => {
    try {
      const res = await axios.get('https://jat.azurewebsites.net/api/applications/stats', { headers });
      const { totalApplications, interviewsScheduled, byStatus } = res.data;
      const offered = byStatus['Offer Received'] || byStatus['Offered'] || 0;
      const rejected = byStatus['Rejected'] || 0;
      const interviewing = interviewsScheduled;
      const pending = totalApplications - (offered + rejected + interviewing);
      setStats({ submitted: totalApplications, interviewing, offered, rejected, pending });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchRecentApps = async (headers) => {
    try {
      const res = await axios.get('https://jat.azurewebsites.net/api/applications/recent', { headers });
      setRecentApps(res.data);
    } catch (err) {
      console.error('Failed to fetch recent applications:', err);
    }
  };

  const pieData = [
    { name: 'Pending', value: stats.pending, color: '#3B82F6' },
    { name: 'Interviewing', value: stats.interviewing, color: '#8B5CF6' },
    { name: 'Offered', value: stats.offered, color: '#10B981' },
    { name: 'Rejected', value: stats.rejected, color: '#EF4444' }
  ].filter(entry => entry.value > 0);

  const getStatusColor = (status) => {
    const colorMap = {
      'Pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Applied': 'bg-blue-100 text-blue-700 border-blue-200',
      'Interview': 'bg-purple-100 text-purple-700 border-purple-200',
      'Interviewing': 'bg-purple-100 text-purple-700 border-purple-200',
      'Offer': 'bg-green-100 text-green-700 border-green-200',
      'Offered': 'bg-green-100 text-green-700 border-green-200',
      'Rejected': 'bg-red-100 text-red-700 border-red-200',
      'Withdrawn': 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
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

      <div className="max-w-7xl mx-auto mt-8 p-6">
        {/* Welcome Header */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back, {firstName}!</h1>
            <p className="text-gray-600">Here's what's happening with your job applications</p>
            {role === 'Admin' && (
              <div className="mt-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-blue-100 text-blue-800">
                  Administrator
                </span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Applications Submitted</p>
                <p className="text-2xl font-bold text-gray-900">{stats.submitted}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Interviews Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">{stats.interviewing}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Offers Received</p>
                <p className="text-2xl font-bold text-gray-900">{stats.offered}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions & Recent Apps */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  to="/applications/new"
                  className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Application
                </Link>
                <Link
                  to="/resumes"
                  className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 shadow-sm"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Manage Resumes
                </Link>
                <Link
                  to="/followups"
                  className="flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 shadow-sm"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Follow-Ups
                </Link>
              </div>
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
                <Link
                  to="/applications"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All →
                </Link>
              </div>
              {recentApps.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-gray-500 mb-4">No recent applications available.</p>
                  <Link
                    to="/applications/new"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm"
                  >
                    Create Your First Application
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentApps.slice(0, 5).map(app => (
                    <div key={app.applicationId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {app.jobTitle}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {app.companyName}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border ${getStatusColor(app.status)}`}>
                              {app.status}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(app.dateApplied)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link
                        to={`/applications/${app.applicationId}`}
                        className="ml-4 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-sm font-medium shadow-sm"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Visual Summary */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Status Overview</h2>
            {stats.submitted === 0 ? (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-gray-500 mb-4">No application data to display</p>
                <Link
                  to="/applications/new"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm"
                >
                  Submit Your First Application
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <p className="text-lg font-medium text-gray-900">Total Applications</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.submitted}</p>
                </div>
                <div className="h-64 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={40}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {pieData.map((entry, index) => {
                    const percent = stats.submitted > 0
                      ? ((entry.value / stats.submitted) * 100).toFixed(1)
                      : '0.0';
                    return (
                      <div key={entry.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-sm font-medium text-gray-900">{entry.name}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">{entry.value}</span> ({percent}%)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}