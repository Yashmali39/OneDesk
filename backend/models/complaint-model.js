const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    complaintTitle: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    complaintType: {
        type: String,
        required: true,
        default: 'Other'
    },
    description: {
        type: String,
        required: true,
        trim: true
    },

    // 🏠 Detailed address object
    address: {
        houseNumber: { type: String },
        street: { type: String },
        areaOrVillage: { type: String },
        cityOrTown: { type: String },
        taluka: { type: String },
        district: { type: String },
        state: { type: String, default: 'Maharashtra' },
        pincode: { type: String },
        landmark: { type: String },
    },

    // 🧾 Complaint metadata
   
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
        default: 'Pending'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'freelancer'   // Officer / Worker assigned
    },
    resolutionRemarks: {
        type: String,
        default: ''
    },
    resolvedAt: {
        type: Date
    },

    // 📸 Optional media
    images: [{
        type: String   // URLs of uploaded images (Cloudinary, etc.)
    }],

    citizenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'citizen',
        required: true
    },
    departmentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'department',
        required: true
    },

}, { timestamps: true });

module.exports = mongoose.model("complaint", complaintSchema);
