import { Authentication } from './components/Authentication';
import { Chatbot } from './components/Chatbot';
import { HomePage } from './components/HomePage';
import './App.css';

function App() {
  return (
    <>
      <Authentication/>
      <Chatbot/>
      <HomePage/>
    </>
  );
}

export default App;
