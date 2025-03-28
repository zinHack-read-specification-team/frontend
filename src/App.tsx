import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StatusPage from './pages/StatusPage';
import SignUpPage from './pages/teacher/auth/SignUpPage';
import SignInPage from './pages/teacher/auth/SignInPage';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/teacher/DashboardPage';
import LinksPage from './pages/teacher/LinksPage';
import FireGame from './pages/school/games/FireGame';
import Header from './components/Header';
import LandingHeader from './components/LandingHeader';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import LinksStats from './pages/teacher/LinksStats';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Routes>
          <Route path="/" element={<LandingHeader />} />
          <Route path="/status" element={<LandingHeader />} />
          <Route path="/teacher/auth/sign-in" element={<LandingHeader />} />
          <Route path="/teacher/auth/sign-up" element={<LandingHeader />} />
          <Route path="/school/games/*" element={<LandingHeader />} />
          <Route path="*" element={<Header />} />
        </Routes>
        <main className="flex-grow">
          <Routes>
            <Route path="/status" element={<StatusPage />} />
            <Route path="/teacher/auth/sign-up" element={<SignUpPage />} />
            <Route path="/teacher/auth/sign-in" element={<SignInPage />} />
            <Route
              path="/teacher"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/links"
              element={
                <ProtectedRoute>
                  <LinksPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/links/stats"
              element={
                <ProtectedRoute>
                  <LinksStats />
                </ProtectedRoute>
              }
            />
            <Route path="/school/games/fire" element={<FireGame />} />
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
