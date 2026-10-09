const mongoose = require("mongoose");

const employeeschema = new mongoose.Schema({
    employeeId: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    leaveBalance: {
        type: Number,
        default: 12
    }
}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeschema);