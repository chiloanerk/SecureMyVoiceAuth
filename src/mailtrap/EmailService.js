const {mailtrapClient, sender} = require("./mailtrap.config");
const {VERIFICATION_EMAIL_TEMPLATE, FORGOT_PASSWORD_EMAIL_TEMPLATE} = require("./templates");
const User = require("../models/UserModel");
const crypto = require("crypto");

class EmailService {
    async verificationEmail({email}) {
        try {
            const verificationToken = (Math.floor(100000 + Math.random() * 900000)).toString();
            const verificationTokenExpiry = Date.now() + 15 * 60 * 1000;

            const user = await User.findOne({ email });
            if (!user) throw new Error("User not found");

            user.verificationToken = verificationToken;
            user.verificationTokenExpiry = verificationTokenExpiry;
            await user.save();

            const recipient = [{ email}];

            const response = await mailtrapClient.send({
                from: sender,
                to: recipient,
                subject: "Verify your email",
                html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
                category: "verification",
            });

            if (!response || !response.success) return { success: false, message: "Failed to send verification email"};

            return {message: "Verification email has been successfully!", verificationToken};
        } catch (error) {
            console.error("Error in sending verification email.", error);
            throw new Error("Verification email failed");
        }
    }

    async resendVerificationEmail({ email }) {
        const user = await User.findOne({ email });
        if (!user) throw new Error("User not found");

        if (user.isVerified) throw new Error("User is already verified");

        if (Date.now() > user.verificationTokenExpiry) {
            return this.verificationEmail({ email });
        }

        throw new Error("Verification token is still valid, no need to resend.");
    }

    async verifyEmail({email, verificationToken}) {
        if (!email || !verificationToken) throw new Error("Verification token and  email required");

        const user = await User.findOne({ email });
        if (!user) throw new Error("User not found");
        if (Date.now() > user.verificationTokenExpiry) throw new Error("Verification token expired");

        if (user.verificationToken !== verificationToken) {
            throw new Error("Invalid verification token");

        }

        user.isVerified = true;
        user.verificationToken = null;
        user.verificationTokenExpiry = null;
        await user.save();

        return { message: "Email verification successful !" };
    }

    async forgotPasswordEmail({email}) {
        try {
            const resetToken = crypto.randomBytes(16).toString("hex");
            const resetTokenExpiry = Date.now() + 15 * 60 * 1000;

            const user = await User.findOne({ email });
            if (!user) return { success: false, message: "User not found"};

            user.resetPasswordToken = resetToken;
            user.resetPasswordTokenExpiry = resetTokenExpiry;
            await user.save();

            const resetLink = `${process.env.AUTH_BASE_URL}/reset-password?token=${resetToken}`;

            const recipient = [{ email }];
            const response = await mailtrapClient.send({
                from: sender,
                to: recipient,
                subject: "Password Reset Request",
                html: FORGOT_PASSWORD_EMAIL_TEMPLATE.replace("{resetLink}", resetLink),
                category: "password-reset-request",
            });

            if (!response || !response.success) return { success: false, message: "Failed to send password reset email"};

            return { message: "Password reset email has been send successfully!", resetLink };
        } catch (error) {
            console.error("Error in sending password reset email", error);
            throw new Error("Password reset email failed");
        }
    }

    async sendWelcomeEmail({email}) {
        const recipient = [{ email }];
        const company_info_name = process.env.ORG_NAME;

        try {
            const user =  await User.findOne({ email });
            if (!user) return { success: false, message: "User not found"};

            const name = user.first_name && user.last_name
                ? `${user.first_name} ${user.last_name}`  // Full name if both are available
                : user.username || "Valued User";

            const response = await mailtrapClient.send({
                from: sender,
                to: recipient,
                template_uuid: "5778151e-ae4d-430a-868b-c72e07c95f7c",
                template_variables: {
                    "company_info_name": company_info_name,
                    "name": name
                }
            })

            return { message: "Welcome email sent successfully!", response };
        } catch (error) {
            console.error("Error in sending welcome email.", error);
            throw new Error("Error sending welcome email");
        }
    }
}

module.exports = new EmailService();