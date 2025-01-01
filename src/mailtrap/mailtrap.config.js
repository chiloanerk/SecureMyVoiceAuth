const { MailtrapClient } = require("mailtrap");
require("dotenv").config();

const MAILTRAP_TOKEN = process.env.MAILTRAP_TOKEN;
const SENDER_NAME = process.env.SENDER_NAME;
const SENDER_EMAIL = process.env.SENDER_EMAIL;

if (!MAILTRAP_TOKEN || !SENDER_NAME) {
    console.error("Missing environment variables. Ensure MAILTRAP_TOKEN, SENDER_EMAIL, and SENDER_NAME are set in the .env file.");
    process.exit(1);
}

const mailtrapClient = new MailtrapClient({
    token: MAILTRAP_TOKEN,
});

const sender = {
    email: SENDER_EMAIL,
    name: SENDER_NAME,
};

module.exports = { mailtrapClient, sender };