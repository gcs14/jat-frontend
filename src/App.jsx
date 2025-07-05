import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NewApplication from './pages/NewApplication';
import ApplicationsPage from './pages/Applications.jsx';
import ViewApplication from './pages/ViewApplication.jsx';
import EditApplication from './pages/EditApplication.jsx'
import FollowUps from './pages/Followups.jsx';
import Resumes from './pages/Resumes.jsx';
import Profile from './pages/Profile.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="applications/new" element={<ProtectedRoute><NewApplication /></ProtectedRoute>} />
      <Route path="applications" element={<ProtectedRoute><ApplicationsPage /></ProtectedRoute>} />
      <Route path="/applications/:id" element={<ProtectedRoute><ViewApplication /></ProtectedRoute>} />
      <Route path="/applications/edit/:id" element={<ProtectedRoute><EditApplication /></ProtectedRoute>} />
      <Route path="/followups" element={<ProtectedRoute><FollowUps /></ProtectedRoute>} />
      <Route path="/resumes" element={<ProtectedRoute><Resumes /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;