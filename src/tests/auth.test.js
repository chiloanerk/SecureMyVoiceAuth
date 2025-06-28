const request = require('supertest');
const express = require('express');
require('mongoose');
const apiRoutes = require('../routes/auth');
const errorMiddleware = require('../middlewares/errorMiddleware');
const EmailService = require('../mailtrap/EmailService');

jest.mock('../mailtrap/EmailService');

const app = express();
app.use(express.json());
app.use('/api/auth', apiRoutes);
app.use(errorMiddleware);

describe('Auth API', () => {
    let consoleLogSpy;
    let consoleErrorSpy;

    beforeAll(() => {
        // Suppress console.log and console.error during tests
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
        // Restore original console functions after all tests
        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });

    beforeEach(() => {
        // Reset mocks before each test
        EmailService.verificationEmail.mockClear();
        EmailService.sendWelcomeEmail.mockClear();
        EmailService.resendVerificationEmail.mockClear();
        EmailService.forgotPasswordEmail.mockClear();
        EmailService.verifyEmail.mockClear();

        // Set up mock return values
        EmailService.verificationEmail.mockResolvedValue({
            success: true,
            message: "Verification email has been successfully!",
            verificationToken: "123456"
        });
        EmailService.sendWelcomeEmail.mockResolvedValue({
            success: true,
            message: "Welcome email sent successfully!"
        });
        EmailService.resendVerificationEmail.mockResolvedValue({
            success: true,
            message: "Verification email sent",
            verificationToken: "123456"
        });
        EmailService.forgotPasswordEmail.mockResolvedValue({
            success: true,
            message: "Password reset email has been send successfully!",
            resetLink: "http://test.com/reset"
        });
        EmailService.verifyEmail.mockResolvedValue({
            message: "Email verification successful !"
        });
    });

    it('should signup a new user', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                email: 'test@example.com',
                password: 'password123',
                username: 'testuser'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body).toHaveProperty('refreshToken');
    });

    it('should not signup a user with an existing email', async () => {
        await request(app)
            .post('/api/auth/signup')
            .send({
                email: 'test2@example.com',
                password: 'password123',
                username: 'testuser2'
            });

        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                email: 'test2@example.com',
                password: 'password123',
                username: 'testuser2'
            });
        expect(res.statusCode).toEqual(400);
    });

    it('should login an existing user', async () => {
        await request(app)
            .post('/api/auth/signup')
            .send({
                email: 'login@example.com',
                password: 'password123',
                username: 'loginuser'
            });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'login@example.com',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body).toHaveProperty('refreshToken');
    });
});
