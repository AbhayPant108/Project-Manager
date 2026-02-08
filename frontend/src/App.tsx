import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ProjectList } from './pages/ListProjects';
import { TaskDetailPage } from './pages/TaskDetailPage';
import { SearchPage } from './pages/SearchPage';
import { ProfilePage } from './pages/ProfilePage';

/**
 * Main Application Component
 * 
 * Sets up the routing for the Project Manager application.
 * Includes public routes for authentication and protected routes
 * for the core application features.
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes (In a real app, these would be wrapped in an AuthGuard) */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path='/projects/:id' element={<ProjectDetailPage/>} />
        <Route path="/tasks" element={<TaskDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Fallback routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
