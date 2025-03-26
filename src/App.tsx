import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StatusPage from './pages/StatusPage';
import SignUpPage from './pages/teacher/auth/SignUpPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/status" element={<StatusPage />} />
        <Route path="/teacher/auth/sign-up" element={<SignUpPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/404" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Система мониторинга
        </h1>
        <Link 
          to="/status" 
          className="inline-flex items-center px-6 py-3 bg-accent-light dark:bg-accent-dark 
                   text-white rounded-lg transition-colors duration-200
                   hover:bg-accent-light/90 dark:hover:bg-accent-dark/90 gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Перейти на страницу статуса
        </Link>
      </div>
    </div>
  );
}

export default App;
