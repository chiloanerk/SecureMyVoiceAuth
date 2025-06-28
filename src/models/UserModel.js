const mongoose = require('mongoose');
require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: [true, "Your email address is required"],
        match: [/^\S+@\S+\.\S*$/, "Please enter a valid email address"],
        maxlength: 64,
    },
    
    password: {
        type: String,
        required: [true, "Your password is required"],
    },
    first_name: {
        type: String,
        default: null
    },
    last_name: {
        type: String,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
        default: null,
    },
    verificationTokenExpiry: {
        type: Date,
        default: null,
    },
    resetPasswordToken: {
        type: String,
        default: null,
    },
    resetPasswordTokenExpiry: {
        type: Date,
        default: null,
    },
    unique_link: {
        type: String,
        unique: true,
        default: () => crypto.randomBytes(16).toString("hex"),
        maxlength: 256
    },
    biography: {
        type: String,
        maxlength: 1024,
    },
    name: {
        type: String,
        maxlength: 32,
    },
    organisation: {
        type: String,
        required: false,
        default: null,
        maxlength: 32,
    },
    website: {
        type: String,
        required: false,
        default: null,
        maxlength: 64,
    },
    phone: {
        type: String,
        required: false,
        default: null,
        maxlength: 16,
    },
    address: {
        street: {
            type: String,
            required: false,
            default: null,
            maxlength: 32
        },
        city: {
            type: String,
            required: false,
            default: null,
            maxlength: 32
        },
        state: {
            type: String,
            required: false,
            default: null,
            maxlength: 32
        },
        postalCode: {
            type: String,
            required: false,
            default: null,
            maxlength: 8
        },
        country: {
            type: String,
            required: false,
            default: null,
            maxlength: 30
        },
    },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);