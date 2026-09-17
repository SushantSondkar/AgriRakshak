import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './i18n/LanguageContext';
import { MainLayout } from './layouts/MainLayout';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Profile } from './pages/Profile';
import { Dashboard } from './pages/Dashboard';
import { Alerts } from './pages/Alerts';
import { Market } from './pages/Market';
import { Community } from './pages/Community';
import { CommunityPostDetail } from './pages/CommunityPostDetail';
import { Schemes } from './pages/Schemes';
import { Settings } from './pages/Settings';
import { CropDoctor } from './pages/CropDoctor';
import { CropDoctorHistory } from './pages/CropDoctorHistory';
import { AdminCropDoctor } from './pages/AdminCropDoctor';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="crop-doctor" element={<CropDoctor />} />
              <Route path="crop-doctor/history" element={<CropDoctorHistory />} />
              <Route path="admin/crop-doctor" element={<AdminCropDoctor />} />
              <Route path="schemes" element={<Schemes />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="market" element={<Market />} />
              <Route path="community" element={<Community />} />
              <Route path="community/post/:id" element={<CommunityPostDetail />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
