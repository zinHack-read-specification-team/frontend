import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StatusPage from './pages/StatusPage';
import SignUpPage from './pages/teacher/auth/SignUpPage';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/teacher/DashboardPage';
import Header from './components/Header';
import LandingHeader from './components/LandingHeader';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Routes>
          <Route path="/" element={<LandingHeader />} />
          <Route path="*" element={<Header />} />
        </Routes>
        <main className="flex-grow">
          <Routes>
            <Route path="/status" element={<StatusPage />} />
            <Route path="/teacher/auth/sign-up" element={<SignUpPage />} />
            <Route path="/teacher" element={<DashboardPage />} />
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
