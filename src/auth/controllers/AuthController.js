const UserService = require('../services/UserService');
module.exports.Signup = async (req, res) => {
    try {
        const {email, password, username} = req.body;
        const { user, accessToken, refreshToken } = await UserService.signUp({ email, password, username });

        res.status(201).json({
            message: "Sign up successful",
            success: true,
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                unique_link: user.unique_link,
            },
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports.Login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const { user, accessToken, refreshToken } = await UserService.login({ email, password });


        res.status(201).json({
            message: "User logged in successfuly",
            success: true,
            accessToken,
            refreshToken,
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

module.exports.RefreshToken = async (req, res) => {
    try {
        const refreshToken = req.body;
        if (!refreshToken) {
            res.status(400).json({message: 'Refresh token is required.'});
        }

        const { accessToken, refreshToken: newRefreshToken } = await UserService.refreshToken(refreshToken);

        res.status(200).json({
            success: true,
            accessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
}

module.exports.Profile = async (req, res) => {
    try {
        const userId = req.user.id; // Retrieved from middlewarer
        const user = await UserService.getProfile(userId);

        res.status(200).json({success: true, user});
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
            message: "Updated profile successfully.",
            success: true,
            user: updatedUser,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({message: error.message });
    }
}