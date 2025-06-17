import { useEffect, useState } from 'react';
import "./index.css";
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Home from './components/Home.jsx';

function App() {
  const [currentView, setCurrentView] = useState(null); // null means "undecided"
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      setUsername(storedUser);
      setCurrentView('home');
    } else {
      setCurrentView('signup'); // or 'login' if you prefer that as default
    }
  }, []);

  const handleSetUsername = (name) => {
    setUsername(name);
    localStorage.setItem('username', name);
  };

  const handleLogout = () => {
    setUsername('');
    localStorage.removeItem('username');
    setCurrentView('login');
  };

  //Render nothing or a loading screen until view is known
  if (currentView === null) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <p className="text-lg text-gray-600 animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {currentView === 'login' && (
        <Login setCurrentView={setCurrentView} setUsername={handleSetUsername} />
      )}
      {currentView === 'signup' && (
        <Signup setCurrentView={setCurrentView} />
      )}
      {currentView === 'home' && (
        <Home setView={setCurrentView} username={username} handleLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
