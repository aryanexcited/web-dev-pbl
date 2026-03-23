const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        role: {
            type: String,
            enum: ["admin", "cashier", "manager"],
            required: true,
            default: "cashier"
        },
        profileImage: {
            type: String,
            default: ""
        },
        isActive: {
            type: Boolean,
            default: true
        },
        lastLogin: {
            type: Date,
            default: null
        },
        loginAttempts: {
            type: Number,
            default: 0,
            min: 0
        },
        isBlocked: {
            type: Boolean,
            default: false
        },
        resetPasswordToken: {
            type: String,
            default: null
        },
        resetPasswordExpire: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);