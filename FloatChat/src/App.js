import { Chatbot } from './components/Chatbot'
import { HomePage } from './components/HomePage' 
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import {Profile} from './components/Profile';
import { Comparison } from './components/Comparison';
import './App.css';
function App() {
  
  return (
      <div className="app">
        <Header/>
        <main>
          <HomePage/>
          <Chatbot/>
          <Profile/>
          <Comparison/>
        </main>
        <Footer/>
      </div>
  );
}

export default App;
