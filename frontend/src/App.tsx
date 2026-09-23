import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignUpPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from '@/context/LanguageContext';
import { Layout } from '@/components/layout/Layout';
import { HomePage } from '@/pages/HomePage';
import { MyApplicationsPage } from './pages/MyApplicationsPage';
import { AssistantPage } from '@/pages/AssistantPage';
import { ServicesPage } from '@/pages/ServicesPage';
import { ServiceDetailPage } from '@/pages/ServiceDetailPage';
import { RegisterGrievancePage } from '@/pages/RegisterGrievancePage';
import { MyGrievancesPage } from '@/pages/MyGrievancesPage';
import { TrackStatusPage } from '@/pages/TrackStatusPage';
import { DocumentAIPage } from '@/pages/DocumentAIPage';
import { CitizenDashboardPage } from '@/pages/CitizenDashboardPage';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage';
import { HelpPage } from '@/pages/HelpPage';
import { ApplyServicePage } from './pages/ApplyServicePage';
import { VerifyOTPPage } from './pages/VerifyOTPPage';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>

          {/* Login page — NO navbar/layout */}
          <Route path="/login" element={<LoginPage />} />

          {/* Signup page — NO navbar/layout */}
          <Route path="/signup" element={<SignupPage />} />
          {/* OTP verification page — NO navbar/layout */}
          <Route path="/verify-otp" element={<VerifyOTPPage/>} />
          {/* Admin dashboard uses its own layout */}
          <Route path="/admin" element={<AdminDashboardPage />} />

          {/* All other citizen pages use the standard layout */}
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>

                  <Route
                    path="/"
                    element={
                      localStorage.getItem('access_token')
                        ? <HomePage />
                        : <LoginPage />
                    }
                  />

                  <Route path="/assistant" element={<AssistantPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/services/:id" element={<ServiceDetailPage />} />
                  <Route path="/apply/:id" element={<ApplyServicePage />} />
                  <Route
                    path="/register-grievance"
                    element={<RegisterGrievancePage />}
                  />
                  <Route path="/grievances" element={<MyGrievancesPage />} />
                  <Route path="/applications" element={<MyApplicationsPage />} />
                  <Route path="/track" element={<TrackStatusPage />} />
                  <Route path="/document-ai" element={<DocumentAIPage />} />
                  <Route path="/dashboard" element={<CitizenDashboardPage />} />
                  <Route path="/help" element={<HelpPage />} />

                </Routes>
              </Layout>
            }
          />

        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
