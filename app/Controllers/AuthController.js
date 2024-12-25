const UserService = require('../Services/UserService');
const {createSecretToken} = require("../util/SecretToken");

module.exports.Signup = async (req, res) => {
    try {
        const {email, password, username} = req.body;
        const user = await UserService.signUp({ email, password, username });
        const token = createSecretToken(user._id);

        res.status(201).json({
            message: "Sign up successful",
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                unique_link: user.unique_link,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

module.exports.Login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await UserService.login({ email, password });
        const token = createSecretToken(user._id);

        res.status(201).json({
            message: "User logged in successfuly",
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                unique_link: user.unique_link
            }
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

module.exports.Profile = async (req, res) => {
    try {
        const userId = req.user.id; // Retrieved from middlewarer
        const user = await UserService.getProfile(userId);

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(400).json({message: error.message });
    }
};

module.exports.UpdateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updateData = req.body;

        console.log("Request body:", updateData);
        console.log("User id:", userId);

        const updatedUser = await UserService.updateProfile(userId, updateData);

        res.status(200).json({
            message: "Updated profile successfully",
            success: true,
            user: updatedUser,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({message: error.message });
    }
}