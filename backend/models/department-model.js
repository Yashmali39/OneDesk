const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    // 🏢 Department Information
    departmentName: {
        type: String,
        trim: true
    },
    departmentType: {
        type: String,
        enum: ['Water Supply', 'Electricity', 'Roads', 'Sanitation', 'Waste Management', 'Public Safety', 'Health', 'Other'],
        default: 'Other'
    },

    contactNumber: {
        type: String,
        trim: true
    },
    officeAddress: {
        buildingName: { type: String },
        street: { type: String },
        areaOrVillage: { type: String },
        cityOrTown: { type: String },
        taluka: { type: String },
        district: { type: String },
        state: { type: String, default: 'Maharashtra' },
        pincode: { type: String }
    },



    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },

    // 📈 Department Performance Tracking

    complaints: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'complaint',
        }
    ],

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },


}, { timestamps: true });

module.exports = mongoose.model("department", departmentSchema);
