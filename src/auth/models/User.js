const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: [true, "Your email address is required"],
        match: [/^\S+@\S+\.\S*$/, "Please enter a valid email address"]
    },
    username: {
        type: String,
        required: [true, "Your username is required"],
    },
    password: {
        type: String,
        required: [true, "Your password is required"],
    },
    unique_link: {
        type: String,
        unique: true,
        default: () => crypto.randomBytes(16).toString("hex"),
    },
    biography: {
        type: String,
        maxlength: 200,
    },
    name: {
        type:String,
        required: false,
        default: 'empty',
    },
    organisation: String,
    website: String,
    phone: String,
    address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
    },
}, { timestamps: true });

userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }
});

module.exports = mongoose.model("User", userSchema);