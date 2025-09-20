import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import { Homepage } from './components/HomePage';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { AnalyticsFilter } from './components/AnalyticsFilter';
import { Authentication } from './components/Authentication';
import { Chatbot } from './components/Chatbot';
import { Settings } from './components/Settings';
import './App.css';

function AppContent() {
  const location = useLocation();

  return (
    <div className="app">
       <Header /> 
      {/* Main content wrapper with spacing for fixed header */}
      <div className="main-content-wrapper">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/chatbot" element={<div className="chatbot-page"><Chatbot /></div>} />
          <Route path="/analytics" element={<div className="analytics-container"><AnalyticsFilter /></div>} />
          <Route path="/signin" element={<div className="authentication-container"><Authentication /></div>} />
          <Route path="/signup" element={<div className="authentication-container"><Authentication /></div>} />
          <Route path="/settings" element={<div className="settings-container"><Settings /></div>} />
        </Routes>
      </div>
      {location.pathname !== '/' && location.pathname !== '/chatbot' && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;