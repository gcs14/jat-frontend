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
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    axios.get('https://jat.azurewebsites.net/api/users/profile', { headers })
      .then(res => {
        console.log("USER PROFILE:", res.data);
        setFirstName(res.data.name.split(' ')[0]);
        setRole(res.data.role);

        fetchRecentApps(headers);
      })
      .catch(err => console.error('Profile load failed', err));

    fetchStats(headers);
  }, []);

  const fetchStats = async (headers) => {
    try {
      const res = await axios.get('https://jat.azurewebsites.net/api/applications/stats', { headers });
      const { totalApplications, interviewsScheduled, byStatus } = res.data;
      const offered = byStatus['Offer Received'] || 0;
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
    { name: 'Pending', value: stats.pending },
    { name: 'Interviewing', value: stats.interviewing },
    { name: 'Offered', value: stats.offered },
    { name: 'Rejected', value: stats.rejected }
  ].filter(entry => entry.value > 0);

  const COLORS = ['#3B82F6', '#60A5FA', '#93C5FD', '#EF4444'];

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

      <main className="p-6">
        <h1 className="text-4xl font-semibold mb-4 text-center">Welcome Back, {firstName}!</h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-500">Applications Submitted</p>
              <h3 className="text-2xl font-bold">{stats.submitted}</h3>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-500">Interviews Scheduled</p>
              <h3 className="text-2xl font-bold">{stats.interviewing}</h3>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-500">Offers Received</p>
              <h3 className="text-2xl font-bold">{stats.offered}</h3>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <section className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
              <div className="flex flex-wrap gap-4">
                <Link to="/applications/new" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">New Application</Link>
                <Link to="/resumes" className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">Manage Resumes</Link>
                <Link to="/followups" className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700">Upcoming Follow-Ups</Link>
              </div>
            </section>

            <section className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">Recent Applications</h2>
              {recentApps.length === 0 ? (
                <p className="text-gray-500">No recent applications available.</p>
              ) : (
                <ul className="divide-y">
                  {recentApps.map(app => (
                    <li key={app.applicationId} className="py-2 flex justify-between items-center">
                      <div>
                        <span className="font-semibold">{app.jobTitle}</span> at <span className="text-gray-600">{app.companyName}</span>
                        <div className="text-sm text-gray-500">{new Date(app.dateApplied).toLocaleDateString()}</div>
                      </div>
                      <Link to={`/applications/${app.applicationId}`} className="bg-blue-500 text-white px-3 py-1 rounded shadow hover:bg-blue-600">
                        View
                      </Link>
                    </li>
                  ))}

                </ul>
              )}
            </section>
          </div>

          <section className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Visual Summary</h2>
            <p className="text-lg font-medium mb-4 text-center">Total Applications: {stats.submitted}</p>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}`, '%']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-1">
              {pieData.map((entry, index) => {
                const percent = stats.submitted > 0
                  ? ((entry.value / stats.submitted) * 100).toFixed(1)
                  : '0.0';
                return (
                  <div key={entry.name} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                      <span>{entry.name}</span>
                    </div>
                    <div>{entry.value} ({percent}%)</div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
