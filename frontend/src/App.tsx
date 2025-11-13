import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets';
import Clients from './pages/Clients';
import Agents from './pages/Agents';
import Reports from './pages/Reports';
import Configuration from './pages/Configuration';
import { Toaster } from './components/ui/toast';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="tickets" element={<Tickets />} />
              <Route path="clients" element={<Clients />} />
              <Route path="agents" element={<Agents />} />
              <Route path="reports" element={<Reports />} />
              <Route path="configuration" element={<Configuration />} />
            </Route>
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

