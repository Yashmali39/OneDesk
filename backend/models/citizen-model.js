const mongoose = require('mongoose');

const citizenSchema = new mongoose.Schema({
    profilePhoto: String,
    
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
    age: Number,

    contactNumber: {
        type: String,
    },
   
    aadhaarNumber: {
        type: String,
        required: false,
    },

    address: {
        houseNo: String,
        street: String,
        area: String,
        landmark: String,
        villageOrCity: String,
        taluka: String,
        district: String,
        state: String,
        pincode: Number,
    },

    // Optional: Citizen’s social data
    occupation: String,
    education: String,

    // Complaints raised by this citizen
    complaints: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'complaint',
        }
    ],

    // If your system allows tracking resolved or pending complaints
    resolvedComplaints: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'complaint',
        }
    ],

    // Reference to User (for login/auth)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

}, {
    timestamps: true,
});

module.exports = mongoose.model("citizen", citizenSchema);
