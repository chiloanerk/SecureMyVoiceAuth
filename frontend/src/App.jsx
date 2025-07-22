import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import ResendVerificationEmail from './pages/ResendVerificationEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPasswordWithToken from './pages/ResetPasswordWithToken';
import ResetPassword from './pages/ResetPassword';
import Logout from './pages/Logout';
import Profile from './pages/Profile';
import UpdateProfile from './pages/UpdateProfile';
import LoginHistory from './pages/LoginHistory';
import ActiveSessions from './pages/ActiveSessions';
import AuthRoute from './components/AuthRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/resend-verification-email" element={<ResendVerificationEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password-with-token" element={<ResetPasswordWithToken />} />

        {/* Protected Routes */}
        <Route path="/reset-password" element={<AuthRoute><ResetPassword /></AuthRoute>} />
        <Route path="/logout" element={<AuthRoute><Logout /></AuthRoute>} />
        <Route path="/profile" element={<AuthRoute><Profile /></AuthRoute>} />
        <Route path="/update-profile" element={<AuthRoute><UpdateProfile /></AuthRoute>} />
        <Route path="/history" element={<AuthRoute><LoginHistory /></AuthRoute>} />
        <Route path="/sessions" element={<AuthRoute><ActiveSessions /></AuthRoute>} />
      </Routes>
    </Router>
  );
}

export default App;