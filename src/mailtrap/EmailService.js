const {mailtrapClient, sender} = require("./mailtrap.config");
const {VERIFICATION_EMAIL_TEMPLATE, FORGOT_PASSWORD_EMAIL_TEMPLATE} = require("./templates");
const User = require("../models/UserModel");
const crypto = require("crypto");

class EmailService {
    async verificationEmail({email}) {
        const verificationToken = (Math.floor(100000 + Math.random() * 900000)).toString();
        const verificationTokenExpiry = Date.now() + 15 * 60 * 1000;

        try {
            const user = await User.findOne({ email });
            if (!user) return { success: false, message: "User not found" };

            user.verificationToken = verificationToken;
            user.verificationTokenExpiry = verificationTokenExpiry;
            await user.save();

            const recipient = [{ email}];

            await mailtrapClient.send({
                from: sender,
                to: recipient,
                subject: "Verify your email",
                html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
                category: "verification",
            });

            return { success: true, message: "Verification email has been successfully!", verificationToken };
        } catch (error) {
            console.error("Error in sending verification email.", error);
            return { success: false, message: "Verification email failed", verificationToken };
        }
    }

    async resendVerificationEmail({ email }) {
        const user = await User.findOne({ email });
        if (!user) throw new Error("User not found");

        if (user.isVerified) throw new Error("User is already verified");

        if (user.verificationToken &&
            user.verificationTokenExpiry instanceof Date &&
            Date.now() <= user.verificationTokenExpiry.getTime()) {
            return {
                message: "Verification token is still valid. No new email sent.",
                expiry: user.verificationTokenExpiry.toLocaleTimeString(),
                noActionTaken: true
            };
        }
        // If token is expired, doesn't exist, or expiry is not a Date, send a new one.
        return this.verificationEmail({ email });
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
            if (!user) {
                console.error("Welcome email failed: User not found for email:", email);
                return { success: false, message: "User not found" };
            }

            const name = user.first_name && user.last_name
                ? `${user.first_name} ${user.last_name}`  // Full name if both are available
                : "Valued User";

            await mailtrapClient.send({
                from: sender,
                to: recipient,
                template_uuid: "5778151e-ae4d-430a-868b-c72e07c95f7c",
                template_variables: {
                    "company_info_name": company_info_name,
                    "name": name
                }
            });

            return { success: true, message: "Welcome email sent successfully!" };
        } catch (error) {
            console.error("Error in sending welcome email.", error);
            return { success: false, message: "Failed to send welcome email." };
        }
    }
}

module.exports = new EmailService();