import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './i18n/LanguageContext';
import { MainLayout } from './layouts/MainLayout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { MyFarm } from './pages/MyFarm';
import { RiskMap } from './pages/RiskMap';
import { OfficerPortal } from './pages/OfficerPortal';
import { CropDoctor } from './pages/CropDoctor';
import { CropDoctorHistory } from './pages/CropDoctorHistory';
import { AdminCropDoctor } from './pages/AdminCropDoctor';
import { Schemes } from './pages/Schemes';
import { Alerts } from './pages/Alerts';
import { Market } from './pages/Market';
import { Community } from './pages/Community';
import { CommunityPostDetail } from './pages/CommunityPostDetail';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            {/* Landing Page (Stand-alone without app below) */}
            <Route path="/" element={<Landing />} />
            <Route path="/landing" element={<Landing />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Application Environment inside MainLayout */}
            <Route path="/app" element={<Navigate to="/dashboard" replace />} />
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-farm" element={<MyFarm />} />
              <Route path="/risk-map" element={<RiskMap />} />
              <Route path="/officer-portal" element={<OfficerPortal />} />
              <Route path="/crop-doctor" element={<CropDoctor />} />
              <Route path="/crop-doctor/history" element={<CropDoctorHistory />} />
              <Route path="/admin/crop-doctor" element={<AdminCropDoctor />} />
              <Route path="/schemes" element={<Schemes />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/market" element={<Market />} />
              <Route path="/community" element={<Community />} />
              <Route path="/community/post/:id" element={<CommunityPostDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
