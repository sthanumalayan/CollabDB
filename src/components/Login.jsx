import React, { useState } from 'react';

const Login = ({ setCurrentView, setUsername }) => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    setCurrentView('signup');
  };

  const handleSubmit = async () => {
    const data = { user, password };
    const res = await fetch('https://collabdb-backend.onrender.com/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const result = await res.json();
      setUsername(result.username);
      setCurrentView("home");
    } else {
      alert("Wrong username or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-blue-500">
      <div className="flex w-[90%] max-w-4xl h-[70%] bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-blue-800">
        
        {/* Left Decorative Panel */}
        <div className="hidden md:flex w-1/2 bg-blue-800 text-white items-center justify-center text-4xl font-bold p-6">
          Welcome to CollabDB!
        </div>

        {/* Right Login Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center gap-6">
          <h1 className="text-4xl font-bold text-center text-blue-800 mb-4">Login</h1>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">Username</label>
            <input
              onChange={(e) => setUser(e.target.value)}
              type="text"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your username"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 cursor-pointer transition"
          >
            Submit
          </button>

          <div className="text-center mt-4 text-sm text-gray-600">
            New user?{' '}
            <button
              onClick={handleSignup}
              className="text-blue-700 hover:underline cursor-pointer font-medium"
            >
              Click here to sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
