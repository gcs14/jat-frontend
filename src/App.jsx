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

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="applications/new" element={<NewApplication />} />
      <Route path="applications" element={<ApplicationsPage />} />
      <Route path="/applications/:id" element={<ViewApplication />} />
      <Route path="/applications/edit/:id" element={<EditApplication />} />
      <Route path="/followups" element={<FollowUps />} />
      <Route path="/resumes" element={<Resumes />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;