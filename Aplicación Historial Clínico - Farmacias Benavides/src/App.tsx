import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  AuthProvider,
  useAuth,
} from "./components/auth-context";
import { DesignSystemProvider } from "./components/design-system-context";
import { SplashScreen } from "./components/splash-screen";
import { LoginScreen } from "./components/login-screen";
import { RegisterScreen } from "./components/register-screen";
import { Dashboard } from "./components/dashboard";
import { UserManagement } from "./components/user-management";
import { PatientManagement } from "./components/patient-management";
import { AccessLogs } from "./components/access-logs";
import { ClinicalHistory } from "./components/clinical-history";
import { PatientClinicalView } from "./components/patient-clinical-view";
import { ProfileSettings } from "./components/profile-settings";
import { DesignSystemEditor } from "./components/design-system-editor";
import { Appointments } from "./components/appointments";
import { Toaster } from "./components/ui/sonner";

// Protected Route Component
const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" />
  );
};

// Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients"
        element={
          <ProtectedRoute>
            <PatientManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/logs"
        element={
          <ProtectedRoute>
            <AccessLogs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clinical-history"
        element={
          <ProtectedRoute>
            <ClinicalHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-clinical"
        element={
          <ProtectedRoute>
            <PatientClinicalView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <ProfileSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/design-system"
        element={
          <ProtectedRoute>
            <DesignSystemEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <Appointments />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default function App() {
  return (
    <Router>
      <DesignSystemProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster position="top-right" />
        </AuthProvider>
      </DesignSystemProvider>
    </Router>
  );
}