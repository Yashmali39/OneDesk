import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CitizenComplaintForm = ({ user, onComplaintAdded }) => {
  const [formData, setFormData] = useState({
    complaintTitle: "",
    department: "",
    complaintType: "",
    description: "",
    address: {
      houseNumber: "",
      street: "",
      areaOrVillage: "",
      cityOrTown: "",
      taluka: "",
      district: "",
      state: "Maharashtra",
      pincode: "",
      landmark: "",
    },
    images: [],
  });

  const [complaintTypes, setComplaintTypes] = useState([]);

  const departmentComplaintMap = {
    "Water Supply": ["Water Leakage", "No Water Supply", "Water Contamination", "Other"],
    Electricity: ["Power Outage", "Meter Issue", "Transformer Fault", "Other"],
    Roads: ["Potholes", "Damaged Roads", "Signage Issue", "Other"],
    Sanitation: ["Drain Blockage", "Toilet Maintenance", "Other"],
    "Waste Management": ["Garbage Collection", "Overflowing Bins", "Other"],
    "Public Safety": ["Street Lights", "Traffic Signals", "Police Help", "Other"],
    Health: ["Hospital Complaint", "Medical Staff Issue", "Other"],
    Other: ["Other"],
  };

  useEffect(() => {
    setComplaintTypes(departmentComplaintMap[formData.department] || []);
    setFormData((prev) => ({ ...prev, complaintType: "" }));
  }, [formData.department]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("address.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ FIXED FILE HANDLING
  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      images: Array.from(e.target.files), // 🔥 IMPORTANT FIX
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.citizenId) {
      toast.error("Citizen ID not found! Please log in again.");
      return;
    }

    try {
      const formDataToSend = new FormData();

      // basic fields
      formDataToSend.append("complaintTitle", formData.complaintTitle);
      formDataToSend.append("department", formData.department);
      formDataToSend.append("complaintType", formData.complaintType);
      formDataToSend.append("description", formData.description);

      // address
      Object.keys(formData.address).forEach((key) => {
        formDataToSend.append(`address.${key}`, formData.address[key]);
      });

      // 🔥 FIXED IMAGE LOOP
      formData.images.forEach((file) => {
        formDataToSend.append("images", file);
      });

      const res = await fetch(
        `http://13.218.220.39:5000/citizen/send-complaint/${user.citizenId}`,
        {
          method: "POST",
          body: formDataToSend, // ❗ NO headers
        }
      );

      // 🔥 SAFE RESPONSE HANDLING
      let data;
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        console.error("Non-JSON response:", text);
        toast.error("Server error!");
        return;
      }

      if (res.ok) {
        toast.success("Complaint submitted successfully!");

        setFormData({
          complaintTitle: "",
          department: "",
          complaintType: "",
          description: "",
          address: {
            houseNumber: "",
            street: "",
            areaOrVillage: "",
            cityOrTown: "",
            taluka: "",
            district: "",
            state: "Maharashtra",
            pincode: "",
            landmark: "",
          },
          images: [],
        });

        if (onComplaintAdded) onComplaintAdded();
      } else {
        toast.error(data.message || "Something went wrong!");
      }

    } catch (err) {
      console.error("Error submitting complaint:", err);
      toast.error("Error submitting complaint!");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-5xl mx-auto my-8 border border-gray-200">
      <h2 className="text-xl font-semibold text-center mb-4 text-blue-700">
        File a New Complaint
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Title + Department */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="complaintTitle"
            value={formData.complaintTitle}
            onChange={handleChange}
            required
            placeholder="Complaint Title"
            className="w-full p-2 border rounded-lg"
          />

          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Select Department</option>
            {Object.keys(departmentComplaintMap).map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Complaint Type */}
        <select
          name="complaintType"
          value={formData.complaintType}
          onChange={handleChange}
          required
          disabled={!formData.department}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Select Complaint Type</option>
          {complaintTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        {/* Description */}
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          required
          placeholder="Describe your complaint..."
          className="w-full p-2 border rounded-lg"
        />

        {/* Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.keys(formData.address).map((key) => (
            <input
              key={key}
              name={`address.${key}`}
              placeholder={key}
              value={formData.address[key]}
              onChange={handleChange}
              className="border p-2 rounded-lg"
            />
          ))}
        </div>

        {/* FILE INPUT */}
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="w-full"
        />

        {/* Submit */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-2 rounded-lg"
          >
            Submit Complaint
          </button>
        </div>
      </form>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default CitizenComplaintForm;