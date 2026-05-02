import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import ReportViolation from './pages/ReportViolation';
import CheckFines from './pages/CheckFines';
import Payment from './pages/Payment';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import MyReports from './pages/MyReports';


// Protected Route Component for Admin
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/" />;
  return children;
};

// Protected Route Component for Users
const UserRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Auth />} />

            
            {/* User Routes */}
            <Route path="/report" element={
              <UserRoute>
                <ReportViolation />
              </UserRoute>
            } />
            <Route path="/my-reports" element={
              <UserRoute>
                <MyReports />
              </UserRoute>
            } />
            
            <Route path="/fines" element={<CheckFines />} />
            <Route path="/payment/:id" element={<Payment />} />
            
            {/* Admin Route */}
            <Route path="/admin" element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            } />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
