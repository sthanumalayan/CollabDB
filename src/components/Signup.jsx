import React, { useState } from 'react';

function usernamecheck(u) {
  return /^[a-zA-Z]{4,20}$/.test(u);
}

function passwordcheck(p) {
  return p.length >= 4 && p.length <= 20;
}

function upicheck(u) {
  return /^[\w.-]+@[\w.-]+$/.test(u);
}

const Signup = ({ setCurrentView }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [upiId, setUpiId] = useState("");

  const handleLogin = () => {
    setCurrentView('login');
  };

  const handleSubmit = async () => {
    if (confirmpassword !== password) {
      alert("Passwords do not match!");
      return;
    }
    if (!usernamecheck(username)) {
      alert("Username must be 4–20 letters, no special characters.");
      return;
    }
    if (!passwordcheck(password)) {
      alert("Password must be 4–20 characters.");
      return;
    }
    if (!upicheck(upiId)) {
      alert("Invalid UPI ID format.");
      return;
    }

    const data = { username, password, upiId };

    try {
      const res = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setCurrentView('login');
      } else {
        const err = await res.json();
        alert(err.error || "Signup failed.");
      }
    } catch (err) {
      alert("Error connecting to server.");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-blue-500">
      <div className="flex w-[90%] max-w-4xl h-[80%] bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-blue-800">
        
        {/* Left panel */}
        <div className="hidden md:flex w-1/2 bg-blue-800 text-white items-center justify-center text-4xl font-bold p-6">
          Create Account
        </div>

        {/* Right Signup Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center gap-6">
          <h1 className="text-4xl font-bold text-center text-blue-800 mb-2">Sign Up</h1>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">Username</label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your username"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">Confirm Password</label>
            <input
              onChange={(e) => setConfirmpassword(e.target.value)}
              type="password"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Re-enter your password"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">UPI ID</label>
            <input
              onChange={(e) => setUpiId(e.target.value)}
              type="text"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g., name@bank"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 cursor-pointer transition"
          >
            Submit
          </button>

          <div className="text-center mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={handleLogin}
              className="text-blue-700 hover:underline cursor-pointer font-medium"
            >
              Click here to log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
