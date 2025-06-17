import React, { useEffect, useState } from 'react';

const View = ({ setCurrentView, username }) => {
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [dueModalOpen, setDueModalOpen] = useState(false);
  const [dueToUser, setDueToUser] = useState(null);
  const [due, setDue] = useState(0);
  const [Qrlink, setQRlink] = useState('');

  const handleBack = () => setCurrentView('home');

  const toggleMember = (member) => {
    setSelectedMembers((prev) =>
      prev.includes(member) ? prev.filter((m) => m !== member) : [...prev, member]
    );
  };

  const handleSubmitExpense = async () => {
    if (!amount || isNaN(amount) || amount <= 0 || selectedMembers.length === 0) {
      alert('Please enter a valid amount and select at least one member.');
      return;
    }

    setSubmitting(true);
    try {
      await fetch('http://localhost:3000/expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedMembers,
          amount,
          username,
          groupId: selectedGroup.groupID,
        }),
      });
      setShowModal(false);
      setSelectedMembers([]);
      setAmount('');
    } catch (err) {
      console.error('Error submitting expense:', err);
      alert('Failed to submit expense. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDue = async (member) => {
    try {
      const res = await fetch('http://localhost:3000/dues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupId: selectedGroup.groupID,
          from: username,
          to: member,
        }),
      });

      const data = await res.json();
      setDue(data.amount);
      setDueToUser(member);
      setDueModalOpen(true);
      setQRlink(data.qr);
    } catch (err) {
      console.error('Fetch error:', err);
      alert('Failed to fetch dues. Please try again.');
    }
  };

  useEffect(() => {
    setLoadingGroups(true);
    fetch('http://localhost:3000/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    })
      .then((res) => res.json())
      .then((data) => setGroups(data.groups))
      .catch((err) => {
        console.error('Failed to fetch groups:', err);
        alert('Failed to load groups.');
      })
      .finally(() => setLoadingGroups(false));
  }, [username]);

  useEffect(() => {
    setShowModal(false);
    setDueModalOpen(false);
    setSelectedMembers([]);
    setAmount('');
    setDue(0);
    setDueToUser(null);
    setQRlink('');
  }, [selectedGroup]);

  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-indigo-100 via-pink-100 to-yellow-100 p-6">
      {(showModal || dueModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40" />
      )}

      <button
        onClick={handleBack}
        className="text-lg md:text-xl px-6 py-2 bg-purple-300 text-purple-900 font-semibold hover:bg-purple-400 hover:cursor-pointer rounded-lg shadow-md w-fit mb-6"
      >
        ⬅ Back
      </button>

      <div className="flex gap-6 flex-col md:flex-row h-[80vh]">
        {/* Group Cards */}
        <div className="w-full md:w-[60%] grid grid-cols-1 sm:grid-cols-2 gap-6 overflow-y-auto pr-2">
          {loadingGroups ? (
            <p className="text-gray-600">Loading groups...</p>
          ) : groups.length === 0 ? (
            <p className="text-gray-500">You’re not part of any groups yet.</p>
          ) : (
            groups.map((group) => (
              <div
                key={group.groupID}
                onClick={() => setSelectedGroup(group)}
                className={`bg-white p-4 rounded-xl shadow border cursor-pointer transition ${
                  selectedGroup?.groupID === group.groupID
                    ? 'ring-2 ring-indigo-500'
                    : 'hover:shadow-lg'
                }`}
              >
                <img
                  src={group.url}
                  alt="Group"
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
                <h2 className="text-xl font-semibold text-indigo-700">{group.name}</h2>
                <p className="text-gray-600">{group.description}</p>
              </div>
            ))
          )}
        </div>

        {/* Group Detail Panel */}
        <div className="w-full md:w-[40%] bg-white border rounded-xl p-6 shadow max-h-full overflow-hidden">
          {selectedGroup ? (
            <>
              <h2 className="text-2xl font-bold text-indigo-700 mb-2">{selectedGroup.name}</h2>
              <p className="text-gray-700 mb-4">{selectedGroup.description}</p>

              <h3 className="text-lg font-semibold mb-2">Members:</h3>
              <ul className="space-y-2 mb-4 overflow-y-auto max-h-52 border border-indigo-100 rounded-md p-2 bg-indigo-50">
                {selectedGroup.members.map((member, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-indigo-100"
                  >
                    <span>{member}</span>
                    {member !== username && (
                      <button
                        onClick={() => handleDue(member)}
                        className="text-sm bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600 cursor-pointer transition"
                      >
                        💰 Dues
                      </button>
                    )}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setShowModal(true)}
                className="mt-4 w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer transition"
              >
                + Add Expense
              </button>
            </>
          ) : (
            <p className="text-center text-gray-600">Click a group to view details</p>
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
      {showModal && selectedGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md relative">
            <button
              className="absolute top-2 right-3 text-xl text-gray-500 hover:text-red-500 cursor-pointer"
              onClick={() => setShowModal(false)}
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">Add Expense</h2>

            <label className="block mb-2 font-medium">Select Members:</label>
            <div className="max-h-32 overflow-y-auto mb-4 border p-2 rounded bg-indigo-50">
              {selectedGroup.members.map((member) => (
                <div key={member} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member)}
                    onChange={() => toggleMember(member)}
                  />
                  <span>{member}</span>
                </div>
              ))}
            </div>

            <label className="block mb-2 font-medium">Amount (₹):</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="e.g. 200"
            />

            <button
              onClick={handleSubmitExpense}
              disabled={submitting}
              className={`w-full py-2 rounded ${
                submitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600 transition cursor-pointer'
              }`}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      )}

      {/* Dues Modal */}
      {dueModalOpen && dueToUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-sm relative">
            <button
              className="absolute top-2 right-3 text-xl text-gray-600 hover:text-red-500 cursor-pointer"
              onClick={() => setDueModalOpen(false)}
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold text-center text-purple-700 mb-4">💳 Dues</h2>
            <p className="text-center mb-2">
              You owe <strong>{dueToUser}</strong>:
            </p>
            <div className="text-center text-3xl text-blue-600 font-bold mb-4">₹{due}</div>
            <div className="flex flex-col items-center">
              <img
                src={Qrlink}
                alt="Payment QR Code"
                className="w-48 h-48 rounded shadow"
              />
              <p className="text-xs text-gray-500 mt-2 italic">Scan to pay via UPI</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default View;
