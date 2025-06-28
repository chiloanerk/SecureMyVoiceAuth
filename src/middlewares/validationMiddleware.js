const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const validateSignup = [
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    
    handleValidationErrors
];

const validateLogin = [
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors
];

const validateVerifyEmail = [
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('verificationToken').isLength({ min: 6, max: 6 }).withMessage('Verification token must be 6 digits'),
    handleValidationErrors
];

const validateResendVerificationEmail = [
    body('email').isEmail().withMessage('Enter a valid email address'),
    handleValidationErrors
];

const validateForgotPassword = [
    body('email').isEmail().withMessage('Enter a valid email address'),
    handleValidationErrors
];

const validateResetPasswordWithToken = [
    body('newPassword').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    handleValidationErrors
];

const validateResetPassword = [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    handleValidationErrors
];

const validateRefreshToken = [
    body('refreshToken').notEmpty().withMessage('Refresh token is required'),
    body('sessionId').notEmpty().withMessage('Session ID is required'),
    handleValidationErrors
];

const validateRevokeAccess = [
    body('sessionId').notEmpty().withMessage('Session ID is required'),
    handleValidationErrors
];

module.exports = {
    validateSignup,
    validateLogin,
    validateVerifyEmail,
    validateResendVerificationEmail,
    validateForgotPassword,
    validateResetPasswordWithToken,
    validateResetPassword,
    validateRefreshToken,
    validateRevokeAccess
};
