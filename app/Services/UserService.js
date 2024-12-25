const User = require("../Models/User");
const bcrypt = require("bcryptjs");

class UserService {
    async signUp({ email, password, username }) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error("User already exists");
        }

        return await User.create({email, password, username});
    }

    async login({ email, password }) {
        if (!email || !password) {
            throw new Error("All fields are required");
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("Incorrect email or password");
        }

        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            throw new Error("Incorrect email or password");
        }

        return user;
    }

    async getProfile(userId) {
        console.log("User data: ", userId);
        const user = await User.findById(userId).select("-password");
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }

    async updateProfile(userId, updateData) {
        console.log("Update data: " + updateData);
        if (!updateData) {
            throw new Error("Invalid update data");
        }

        console.log("User id: " + userId);
        for (let key in updateData) {
            if (updateData[key] === "" || updateData[key] === null) {
                delete updateData[key];
            }
        }

        const user = await User.findByIdAndUpdate( userId, filteredData, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
}

module.exports = new UserService();