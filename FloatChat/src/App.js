import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import { Homepage } from './components/HomePage';
import { Footer } from './components/Footer';
import {Header} from './components/Header';
import { AnalyticsFilter } from './components/AnalyticsFilter';
import { Authentication } from './components/Authentication';
import { Chatbot } from './components/Chatbot';
import { Settings } from './components/Settings';
 // Import the Settings component
import './App.css';

function AppContent() {
  const location = useLocation();

  return (
    <div className="app">
      <Header />
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '90vh' }}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/analytics" element={<AnalyticsFilter />} />
          <Route path="/signin" element={<Authentication />} />
          <Route path="/signup" element={<Authentication />} />
          
          <Route path="/settings" element={<Settings />} /> {/* Add Settings route */}
        </Routes>
      </main>
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