import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const ClientHome = () => {
    const { user } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [statusFilter, setStatusFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [departmentName, setDepartmentName] = useState();
    const [selectedComplaint, setSelectedComplaint] = useState(null); // ✅ For modal view

    const fetchComplaints = async () => {
        if (!user?.departmentId) return;
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/department/find-complaint-data/${user.departmentId}`);
            const data = await res.json();
            if (res.ok) {
                setComplaints(data.complaints || []);
                setDepartmentName(data.departmentName);
            } else {
                console.error(data.message || "Failed to fetch complaints");
            }
        } catch (err) {
            console.error("Error fetching complaints:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, [user]);

    const filteredComplaints = complaints.filter(c => {
        const matchesStatus = statusFilter === "All" || c.status === statusFilter;
        const matchesSearch = c.complaintTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              c.address?.areaOrVillage?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              c.department?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "Resolved": return "bg-green-500";
            case "In Progress": return "bg-blue-500";
            case "Pending": return "bg-yellow-500";
            default: return "bg-gray-500";
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "High": return "border-red-500";
            case "Medium": return "border-orange-400";
            case "Low": return "border-green-400";
            default: return "border-gray-300";
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleStatusUpdate = async (complaintId, newStatus) => {
        try {
            const res = await fetch(`http://localhost:3000/department/update-complaint-status/${complaintId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (res.ok) {
                setComplaints(prev =>
                    prev.map(c => c._id === complaintId ? { ...c, status: newStatus } : c)
                );
                if (selectedComplaint?._id === complaintId)
                    setSelectedComplaint({ ...selectedComplaint, status: newStatus }); // Update modal view too
            } else {
                console.error(data.message || "Failed to update status");
            }
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-[#0f052c] via-[#1a0f45] to-[#2d1b69]">
            <div className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')" }}></div>

            {/* Floating Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-40 h-40 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-60 h-60 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            </div>

            <div className="relative z-10 py-10 px-4 flex justify-center">
                <div className="w-full max-w-7xl">
                    <h1 className="text-3xl font-bold mb-2 text-center text-white">
                        {`${departmentName}`} Dashboard
                    </h1>
                    <p className="text-lg mb-6 text-center text-gray-300">
                        Welcome, <span className="text-yellow-400">{user?.name || "Department Admin"}</span>
                    </p>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-lg p-4 text-center shadow-lg">
                            <h3 className="text-2xl font-bold text-gray-800">{complaints.length}</h3>
                            <p className="text-gray-600">Total Complaints</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center shadow-lg">
                            <h3 className="text-2xl font-bold text-green-600">
                                {complaints.filter(c => c.status === "Resolved").length}
                            </h3>
                            <p className="text-gray-600">Resolved</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center shadow-lg">
                            <h3 className="text-2xl font-bold text-blue-600">
                                {complaints.filter(c => c.status === "In Progress").length}
                            </h3>
                            <p className="text-gray-600">In Progress</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center shadow-lg">
                            <h3 className="text-2xl font-bold text-yellow-600">
                                {complaints.filter(c => c.status === "Pending").length}
                            </h3>
                            <p className="text-gray-600">Pending</p>
                        </div>
                    </div>

                    {/* Search & Filter */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <input
                            type="text"
                            placeholder="Search complaints..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                        <button 
                            onClick={() => { setSearchTerm(""); setStatusFilter("All"); }}
                            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                        >
                            Reset
                        </button>
                    </div>

                    {/* Complaints Grid */}
                    {loading ? (
                        <div className="text-center text-white py-20">Loading complaints...</div>
                    ) : filteredComplaints.length === 0 ? (
                        <div className="text-center text-white py-20">No complaints found.</div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredComplaints.map((c) => (
                                <div 
                                    key={c._id} 
                                    className={`bg-white p-5 rounded-lg shadow-lg hover:shadow-2xl transition border-l-4 cursor-pointer ${getPriorityColor(c.priority)}`}
                                    onClick={() => setSelectedComplaint(c)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-lg text-gray-800">{c.complaintTitle}</h3>
                                        <span className={`px-2 py-1 rounded text-white text-xs ${getStatusColor(c.status)}`}>{c.status}</span>
                                    </div>
                                    <p className="text-gray-700 text-sm mb-1"><strong>Department:</strong> {c.department}</p>
                                    <p className="text-gray-700 text-sm mb-1"><strong>Submitted:</strong> {formatDate(c.createdAt)}</p>
                                    <p className="text-gray-700 text-sm mb-2 line-clamp-2"><strong>Address:</strong> {c.address?.areaOrVillage}, {c.address?.cityOrTown}</p>
                                    <p className="text-gray-700 text-sm mb-3 line-clamp-3"><strong>Description:</strong> {c.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ✅ Complaint Details Modal */}
            {selectedComplaint && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full p-6 relative">
                        <button 
                            onClick={() => setSelectedComplaint(null)}
                            className="absolute top-3 right-4 text-gray-600 hover:text-red-600 text-2xl"
                        >
                            ✖
                        </button>

                        <h2 className="text-2xl font-bold mb-3 text-gray-800">{selectedComplaint.complaintTitle}</h2>
                        <div className="flex items-center gap-2 mb-4">
                            <span className={`px-3 py-1 rounded text-white text-sm ${getStatusColor(selectedComplaint.status)}`}>
                                {selectedComplaint.status}
                            </span>
                            <span className="text-gray-600 text-sm">Priority: {selectedComplaint.priority}</span>
                        </div>

                        <p className="text-gray-700 mb-2"><strong>Department:</strong> {selectedComplaint.department}</p>
                        <p className="text-gray-700 mb-2"><strong>Submitted on:</strong> {formatDate(selectedComplaint.createdAt)}</p>
                        <p className="text-gray-700 mb-2"><strong>Description:</strong> {selectedComplaint.description}</p>
                        <p className="text-gray-700 mb-2">
                            <strong>Address:</strong> {`${selectedComplaint.address?.houseNumber || ''}, ${selectedComplaint.address?.street || ''}, ${selectedComplaint.address?.areaOrVillage || ''}, ${selectedComplaint.address?.cityOrTown || ''}, ${selectedComplaint.address?.district || ''}, ${selectedComplaint.address?.state || ''} - ${selectedComplaint.address?.pincode || ''}`}
                        </p>

                        {/* Status update inside modal */}
                        <div className="flex gap-3 mt-5">
                            {["Pending", "In Progress", "Resolved"].map(status => (
                                <button
                                    key={status}
                                    onClick={() => handleStatusUpdate(selectedComplaint._id, status)}
                                    className={`flex-1 px-3 py-2 rounded text-sm font-semibold transition ${
                                        selectedComplaint.status === status
                                            ? status === "Pending" ? "bg-yellow-600 text-white" :
                                              status === "In Progress" ? "bg-blue-600 text-white" :
                                              "bg-green-600 text-white"
                                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientHome;
