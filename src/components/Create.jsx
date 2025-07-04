import React, { useState, useEffect } from 'react';

const Create = ({ setCurrentView, username }) => {
  const [group, setGroup] = useState('');
  const [imgurl, setImgUrl] = useState('');
  const [description, setDescription] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('');

  const handleBack = () => setCurrentView('home');
  const handleGroupName = (e) => setGroup(e.target.value);
  const handleImg = (e) => setImgUrl(e.target.value);
  const handleDesc = (e) => setDescription(e.target.value);

  const handleSubmit = async () => {
    const data = { group, imgurl, description, username };
    try {
      const res = await fetch('https://collabdb-backend.onrender.com/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (res.ok) {
        setStatusType('success');
        setStatusMessage('Group created successfully!');
        setGroup('');
        setImgUrl('');
        setDescription('');
      } else {
        setStatusType('error');
        setStatusMessage(result.error || 'Failed to create group.');
      }
    } catch (err) {
      setStatusType('error');
      setStatusMessage('Something went wrong. Please try again.');
      console.error(err);
    }
  };

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage('');
        setStatusType('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-100 via-rose-100 to-pink-200 flex flex-col p-4 sm:p-6">
      {/* Back button */}
      <div className="mb-4 sm:mb-6">
        <button
          onClick={handleBack}
          className="text-base sm:text-lg px-4 sm:px-6 py-2 bg-amber-300 text-amber-900 font-semibold hover:bg-amber-400 rounded-lg shadow-md transition-all"
        >
          ⬅ Back
        </button>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div
          className={`mb-4 px-4 py-3 rounded-xl text-base sm:text-lg font-semibold shadow-md w-full max-w-xl mx-auto text-center ${
            statusType === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {statusMessage}
        </div>
      )}

      {/* Main content: Form + Preview */}
      <div className="flex flex-col md:flex-row gap-10 items-center md:items-start md:px-20 lg:px-40 flex-1">
        {/* Form Section */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xl sm:text-2xl font-semibold text-orange-800">Group Name</label>
            <input
              value={group}
              onChange={handleGroupName}
              type="text"
              className="text-lg border border-orange-300 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="Enter group name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xl sm:text-2xl font-semibold text-orange-800">Image URL</label>
            <input
              value={imgurl}
              onChange={handleImg}
              type="url"
              className="text-lg border border-orange-300 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="Enter image URL"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xl sm:text-2xl font-semibold text-orange-800">Description</label>
            <textarea
              value={description}
              onChange={handleDesc}
              className="text-lg border border-orange-300 rounded-xl px-4 py-3 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="Enter group description"
              rows={5}
            ></textarea>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-2 text-lg font-bold bg-amber-400 hover:bg-amber-500 text-white rounded-xl px-6 py-3 shadow-md transition-all"
          >
            Create Group
          </button>
        </div>

        {/* Preview Section */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          {imgurl ? (
            <img
              src={imgurl}
              alt="Preview"
              className="h-52 w-52 sm:h-64 sm:w-64 object-cover rounded-xl border shadow-md"
            />
          ) : (
            <div className="h-52 w-52 sm:h-64 sm:w-64 flex items-center justify-center border-2 border-dashed border-orange-300 rounded-xl text-gray-500 shadow-sm text-center text-sm sm:text-base">
              Image Preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Create;
