import React, { useState } from 'react';
import Create from './Create.jsx';
import Join from './Join.jsx';
import View from './View.jsx';

const Home = ({ setView, username, handleLogout }) => {
  const [currentView, setCurrentView] = useState('home');

  if (currentView === 'create') {
    return <Create setCurrentView={setCurrentView} username={username} />;
  }

  if (currentView === 'join') {
    return <Join setCurrentView={setCurrentView} username={username} />;
  }

  if (currentView === 'view') {
    return <View setCurrentView={setCurrentView} username={username} />;
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 flex flex-col p-6">
      {/* Sign Out Button */}
      <div className="mb-8">
        <button
          onClick={handleLogout}
          className="text-lg md:text-xl px-6 py-2 bg-red-300 text-red-900 font-semibold hover:bg-red-400 cursor-pointer rounded-lg shadow-md transition-all"
        >
          🚪 Sign Out
        </button>
      </div>

      {/* Main Options */}
      <div className="flex flex-col items-center justify-center flex-grow gap-12">
        <h1 className="text-4xl md:text-5xl font-bold text-purple-800 text-center">
          Hello, What do you wish to do?
        </h1>

        <button
          onClick={() => setCurrentView('create')}
          className="w-[80%] max-w-xl text-xl md:text-3xl bg-indigo-400 text-white py-4 rounded-xl hover:bg-indigo-500 transition cursor-pointer shadow-md"
        >
          Create a New Group
        </button>

        <button
          onClick={() => setCurrentView('join')}
          className="w-[80%] max-w-xl text-xl md:text-3xl bg-pink-400 text-white py-4 rounded-xl hover:bg-pink-500 transition cursor-pointer shadow-md"
        >
          Join a Group
        </button>

        <button
          onClick={() => setCurrentView('view')}
          className="w-[80%] max-w-xl text-xl md:text-3xl bg-fuchsia-500 text-white py-4 rounded-xl hover:bg-fuchsia-600 transition cursor-pointer shadow-md"
        >
          View Current Groups
        </button>
      </div>
    </div>
  );
};

export default Home;
