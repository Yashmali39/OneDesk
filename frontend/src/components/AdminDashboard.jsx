import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);

  // Fetch all departments
  const fetchDepartments = async () => {
    try {
      const res = await fetch("http://13.218.220.39:5000/department/find-all-departments");
      const data = await res.json();
      if (res.ok) {
        setDepartments(data.departments);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Compute complaint stats for a department or all complaints
  const getComplaintStats = (complaints) => {
    const counts = { Resolved: 0, "In Progress": 0, Pending: 0 };
    complaints.forEach((c) => {
      if (counts[c.status] !== undefined) counts[c.status]++;
    });
    return counts;
  };

  // Colors for pie chart
  const COLORS = ["#4CAF50", "#2196F3", "#FFC107", "#9E9E9E"];

  // Compute stats for all complaints
  const allComplaints = departments.flatMap((dept) => dept.complaints || []);
  const globalStats = getComplaintStats(allComplaints);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f052c] via-[#1a0f45] to-[#2d1b69] text-white p-8">
      <h1 className="text-3xl font-bold text-center mb-10">Admin Dashboard</h1>

      {/* ------------------ Global Complaints Pie Chart ------------------ */}
      <div className="bg-white text-gray-800 p-6 rounded-2xl shadow-md mb-10 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-indigo-700 mb-4 text-center">All Complaints Overview</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="w-full md:w-1/2 h-60">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={Object.entries(globalStats).map(([name, value]) => ({ name, value }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {Object.entries(globalStats).map(([, value], index) => (
                    <Cell key={`cell-global-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full md:w-1/2">
            <h3 className="font-semibold text-lg mb-2 text-center">Summary</h3>
            {Object.entries(globalStats).map(([status, count]) => (
              <p key={status} className="text-sm mb-1 text-center">
                <span className="font-medium">{status}:</span> {count}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------ Department Cards ------------------ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div
            key={dept._id}
            className="bg-white text-gray-800 p-6 rounded-2xl shadow-md hover:shadow-2xl transition cursor-pointer"
            onClick={() => setSelectedDept(dept)}
          >
            <h3 className="text-xl font-semibold text-indigo-700 mb-2">{dept.departmentName}</h3>
            <p className="text-gray-600 mb-1"><strong>Type:</strong> {dept.departmentType}</p>
            <p className="text-gray-600 mb-1"><strong>Contact:</strong> {dept.contactNumber || "N/A"}</p>
            <p className="text-gray-600 mb-1"><strong>Rating:</strong> ⭐ {dept.rating.toFixed(1)}</p>
            <p className="text-gray-600"><strong>Total Complaints:</strong> {dept.complaints.length}</p>
          </div>
        ))}
      </div>

      {/* ------------------ Detailed Modal ------------------ */}
      {selectedDept && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white text-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl p-6 relative">
            <button
              onClick={() => setSelectedDept(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-lg"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-indigo-700 mb-4">
              {selectedDept.departmentName} Department
            </h2>

            {/* Basic Info */}
            <div className="mb-4">
              <p><strong>Type:</strong> {selectedDept.departmentType}</p>
              <p><strong>Contact:</strong> {selectedDept.contactNumber || "N/A"}</p>
              <p><strong>Office:</strong> {selectedDept.officeAddress?.cityOrTown || "N/A"}</p>
            </div>

            {/* Stats Chart */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="w-full md:w-1/2 h-60">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={Object.entries(getComplaintStats(selectedDept.complaints)).map(
                        ([name, value]) => ({ name, value })
                      )}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label
                    >
                      {Object.entries(getComplaintStats(selectedDept.complaints)).map(
                        ([, value], index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Stats Summary */}
              <div className="text-gray-800 w-full md:w-1/2">
                <h3 className="font-semibold text-lg mb-2">Complaint Summary</h3>
                {Object.entries(getComplaintStats(selectedDept.complaints)).map(([status, count]) => (
                  <p key={status} className="text-sm mb-1">
                    <span className="font-medium">{status}:</span> {count}
                  </p>
                ))}
              </div>
            </div>

            {/* Complaints List */}
            <div className="mt-6 max-h-60 overflow-y-auto border-t pt-3">
              <h3 className="font-semibold text-lg mb-2">Complaints</h3>
              {selectedDept.complaints.length > 0 ? (
                <ul className="space-y-2">
                  {selectedDept.complaints.map((c) => (
                    <li
                      key={c._id}
                      className="bg-gray-100 rounded-lg p-3 shadow-sm border-l-4 border-indigo-500"
                    >
                      <h4 className="font-semibold text-gray-800">{c.complaintTitle}</h4>
                      <p className="text-sm text-gray-600">
                        <strong>Status:</strong> {c.status} | <strong>Type:</strong> {c.complaintType}
                      </p>
                      <p className="text-sm text-gray-600"><strong>Description:</strong> {c.description}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No complaints found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
