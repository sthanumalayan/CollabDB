import React, { useEffect, useState } from 'react';

const Join = ({ setCurrentView, username }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('');

  const handleBack = () => setCurrentView("home");

  const handleJoin = async () => {
    if (!selectedGroup) return;

    const data = { username, group: selectedGroup };

    try {
      const res = await fetch('https://collabdb-backend.onrender.com/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        if (result.alreadyJoined) {
          setStatusType('info');
          setStatusMessage('You are already a member of this group!');
        } else {
          setStatusType('success');
          setStatusMessage('Successfully joined the group!');
        }
        setSelectedGroup(result.group);
      } else {
        throw new Error('Failed to join');
      }
    } catch (err) {
      setStatusType('error');
      setStatusMessage('Something went wrong. Please try again.');
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchGroups = async () => {
      const res = await fetch('https://collabdb-backend.onrender.com/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setGroups(data);
    };
    fetchGroups();
  }, [selectedGroup]);

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
    <div className="min-h-screen w-full bg-gradient-to-br from-yellow-100 via-orange-100 to-rose-100 flex flex-col p-4 sm:p-6">
      {/* Back Button */}
      <div className="mb-4 sm:mb-6">
        <button
          onClick={handleBack}
          className="text-base sm:text-lg px-4 sm:px-6 py-2 bg-amber-300 text-amber-900 font-semibold hover:bg-amber-400 rounded-lg shadow-md transition-all"
        >
          ⬅ Back
        </button>
      </div>

      {/* Content Layout */}
      <div className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden">
        {/* Groups List */}
        <div className="w-full md:w-[65%] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pr-1 sm:pr-2">
          {groups.map((group) => (
            <div
              key={group._id}
              onClick={() => setSelectedGroup(group)}
              className="cursor-pointer border border-yellow-300 rounded-2xl p-4 bg-white shadow-md hover:shadow-xl transform hover:scale-[1.02] transition duration-300 flex flex-col"
            >
              <img
                src={group.url}
                alt="Group"
                className="h-40 sm:h-48 w-full object-cover rounded-xl mb-3"
              />
              <h2 className="text-lg sm:text-xl font-semibold text-orange-700">{group.name}</h2>
              <p className="text-gray-700 mt-2 text-sm sm:text-base">{group.description}</p>
            </div>
          ))}
        </div>

        {/* Group Detail Panel */}
        <div className="w-full md:w-[35%] border border-yellow-300 rounded-2xl p-4 sm:p-6 bg-white shadow-inner relative overflow-y-auto max-h-[75vh]">
          {statusMessage && (
            <div
              className={`mb-4 px-4 py-3 rounded-lg text-center font-semibold text-sm sm:text-base ${
                statusType === 'success'
                  ? 'bg-green-100 text-green-800'
                  : statusType === 'info'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {statusMessage}
            </div>
          )}

          {selectedGroup ? (
            <>
              <h2 className="text-xl sm:text-2xl font-bold text-orange-800 mb-3 pr-16">
                {selectedGroup.name}
              </h2>
              <p className="text-gray-700 mb-4 text-sm sm:text-base">
                {selectedGroup.description}
              </p>

              <h3 className="text-base sm:text-lg font-semibold text-orange-700 mb-2">
                Members:
              </h3>
              <ul className="list-disc list-inside mb-4 text-gray-800 text-sm sm:text-base max-h-[200px] overflow-y-auto pr-2">
                {selectedGroup.members?.map((member, index) => (
                  <li key={index}>{member}</li>
                ))}
              </ul>

              <button
                onClick={handleJoin}
                className="absolute top-4 right-4 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-white rounded-lg text-sm sm:text-base transition-all"
              >
                Join?
              </button>
            </>
          ) : (
            <p className="text-gray-600 text-sm sm:text-base">Click on a group to view details</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Join;
