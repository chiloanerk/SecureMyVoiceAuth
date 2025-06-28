const EmailService = jest.fn();

EmailService.prototype.verificationEmail = jest.fn().mockResolvedValue({
    success: true,
    message: "Verification email has been successfully!",
    verificationToken: "123456"
});

EmailService.prototype.sendWelcomeEmail = jest.fn().mockResolvedValue({
    success: true,
    message: "Welcome email sent successfully!"
});

EmailService.prototype.resendVerificationEmail = jest.fn().mockResolvedValue({
    success: true,
    message: "Verification email sent",
    verificationToken: "123456"
});

EmailService.prototype.forgotPasswordEmail = jest.fn().mockResolvedValue({
    success: true,
    message: "Password reset email has been send successfully!",
    resetLink: "http://test.com/reset"
});

EmailService.prototype.verifyEmail = jest.fn().mockResolvedValue({
    message: "Email verification successful !"
});

module.exports = new EmailService();