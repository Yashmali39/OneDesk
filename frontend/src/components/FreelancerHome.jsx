import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import CitizenComplaintForm from "./CitizenComplaintForm";

export default function FreelancerHome() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [bestMatched, setBestMatched] = useState(true);
  const [recent, setRecent] = useState(false);
  const [saved, setSaved] = useState(false);

  // ✅ Fetch Complaints Data
  // ✅ Fetch Complaints Data (FIXED)
  const fetchComplaints = async () => {
    try {
      if (!user?.citizenId) return;

      const res = await fetch(
        `http://13.218.220.39:5000/citizen/find-complaint-data/${user.citizenId}`
      );

      // 🔥 HANDLE ERROR PROPERLY
      if (!res.ok) {
        const text = await res.text();
        console.error("Server Error:", text);
        return;
      }

      const data = await res.json();
      setJobs(data.complaints || []);

    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [user]);

  // 🟢 Tabs Handlers
  const handleBest = () => { setBestMatched(true); setRecent(false); setSaved(false); };
  const handleRecent = () => { setBestMatched(false); setRecent(true); setSaved(false); };
  const handleSaved = () => { setBestMatched(false); setRecent(false); setSaved(true); };

  // 🟢 Save / Unsave Complaint
  const handleSave = (id) => {
    setJobs(prev => prev.map(c => c._id === id ? { ...c, isSaved: !c.isSaved } : c));
    const updated = jobs.find(c => c._id === id);
    if (updated && !updated.isSaved) {
      setSavedJobs(prev => [...prev, updated]);
    } else {
      setSavedJobs(prev => prev.filter(c => c._id !== id));
    }
  };

  // 🟢 Status Colors
  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved": return "bg-green-500";
      case "In Progress": return "bg-blue-500";
      case "Pending": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  // 🟢 Format Address
  const formatAddress = (address) => {
    if (!address) return "No address provided";
    const {
      houseNumber, street, areaOrVillage, cityOrTown,
      taluka, district, state, pincode
    } = address;
    return `${houseNumber ? houseNumber + ", " : ""}${street ? street + ", " : ""}${areaOrVillage ? areaOrVillage + ", " : ""}${cityOrTown ? cityOrTown + ", " : ""}${taluka ? taluka + ", " : ""}${district ? district + ", " : ""}${state ? state + ", " : ""}${pincode ? "Pin: " + pincode : ""}`;
  };

  // 🟢 Calculate Stats in Frontend
  const stats = {
    total: jobs.length,
    resolved: jobs.filter(j => j.status === "Resolved").length,
    inProgress: jobs.filter(j => j.status === "In Progress").length,
    pending: jobs.filter(j => j.status === "Pending").length,
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0f052c] via-[#1a0f45] to-[#2d1b69] pb-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')" }}></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 py-10 px-4 flex justify-center">
        <div className="w-full max-w-6xl">
          <h1 className="text-3xl font-bold mb-2 text-center text-white">Complaint Management System</h1>
          <p className="text-lg mb-6 text-center text-gray-300">
            Hello, <span className="text-yellow-400">{user?.firstName} {user?.lastName}</span>
          </p>

          {/* ✅ Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 text-center shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800">{stats.total}</h3>
              <p className="text-gray-600">Total Complaints</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-lg">
              <h3 className="text-2xl font-bold text-green-600">{stats.resolved}</h3>
              <p className="text-gray-600">Resolved</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-lg">
              <h3 className="text-2xl font-bold text-blue-600">{stats.inProgress}</h3>
              <p className="text-gray-600">In Progress</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-lg">
              <h3 className="text-2xl font-bold text-yellow-600">{stats.pending}</h3>
              <p className="text-gray-600">Pending</p>
            </div>
          </div>

          {/* ✅ Complaint Form */}
          <CitizenComplaintForm user={user} onComplaintAdded={fetchComplaints} />

          {/* Tabs */}
          <div className="flex gap-4 mb-6 justify-center mt-8">
            <button onClick={handleBest} className={`px-6 py-2 rounded-full font-medium transition ${bestMatched ? "bg-yellow-400 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}>All Complaints</button>
            <button onClick={handleRecent} className={`px-6 py-2 rounded-full font-medium transition ${recent ? "bg-yellow-400 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}>Recent</button>
            <button onClick={handleSaved} className={`px-6 py-2 rounded-full font-medium transition ${saved ? "bg-yellow-400 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}>Saved ({savedJobs.length})</button>
          </div>

          {/* Complaints Grid */}
          <h2 className="text-2xl font-semibold mb-4 text-center text-white">
            Your Complaints ({(saved ? savedJobs : jobs).length})
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(saved ? savedJobs : jobs).map((c) => (
              <div key={c._id} className="bg-white p-5 rounded-lg shadow-md hover:shadow-xl transition">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg text-gray-800">{c.complaintTitle}</h3>
                  <span className={`px-3 py-1 rounded text-white text-sm ${getStatusColor(c.status)}`}>
                    {c.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-gray-700"><strong>Department:</strong> {c.departmentID?.departmentName || c.department}</p>
                  <p className="text-gray-700"><strong>Type:</strong> {c.complaintType}</p>
                  <p className="text-gray-700"><strong>Address:</strong> {formatAddress(c.address)}</p>
                  <p className="text-gray-700"><strong>Description:</strong> {c.description}</p>
                </div>
                <div className="flex justify-between items-center mt-4 pt-3 border-t">
                  <button
                    onClick={() => handleSave(c._id)}
                    className={`px-4 py-2 rounded-lg transition ${c.isSaved
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                  >
                    {c.isSaved ? "Unsave" : "Save"}
                  </button>
                  <span className="text-sm text-gray-500">ID: {c._id}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Empty States */}
          {!saved && jobs.length === 0 && (
            <div className="text-center mt-8 py-12 bg-white rounded-lg shadow">
              <p className="text-gray-600 text-lg">No complaints submitted yet.</p>
            </div>
          )}
          {saved && savedJobs.length === 0 && (
            <div className="text-center mt-8 py-12 bg-white rounded-lg shadow">
              <p className="text-gray-600 text-lg">No saved complaints.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
