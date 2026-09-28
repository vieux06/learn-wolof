import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Exercise from './components/Exercise';
import Dashboard from './pages/Dashboard';
import LearningPath from './pages/LearningPath';
import LessonPage from './pages/LessonPage';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Profile from './pages/Profile';
import Register from './pages/Register';
import UnitPage from './pages/UnitPage';
import './App.css';

const NotFound = () => <div className="page-state">Cette page est introuvable.</div>;

function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

function AppInner() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="page-state">Chargement…</div>;
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Protected routes */}
            <Route
              path="/onboarding"
              element={user ? <Onboarding /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/learning-path"
              element={user ? <LearningPath /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/unit/:unitId"
              element={user ? <UnitPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/lesson/:lessonId"
              element={user ? <LessonPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/exercise/:exerciseId"
              element={user ? <Exercise /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/profile"
              element={user ? <Profile /> : <Navigate to="/login" replace />}
            />
            {/* Redirect to dashboard if root path */}
            <Route
              path="/"
              element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
            />
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;