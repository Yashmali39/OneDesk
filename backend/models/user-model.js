const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    role: String,
    
    citizenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'citizen',
     },
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'department',
     }
})
module.exports = mongoose.model("user", userSchema);