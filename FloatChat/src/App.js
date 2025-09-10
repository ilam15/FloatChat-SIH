import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Homepage } from './components/HomePage';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Profile } from './components/Profile';
import { AnalyticsFilter } from './components/AnalyticsFilter';
import { Authentication } from './components/Authentication';
import { Chatbot } from './components/Chatbot';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '90vh' }}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/analytics" element={<AnalyticsFilter />} />
            <Route path="/signin" element={<Authentication />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
