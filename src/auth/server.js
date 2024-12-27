const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") }); // Adjusted path

const apiRoutes = require("./routes/auth");

// Use process.env to get environment variables from the .env file
const { MONGO_URL, AUTH_PORT } = process.env;

const app = express();

app.use(express.json());
app.use("/auth", apiRoutes);

console.log("MongoURL is: " + MONGO_URL);
// Check if MONGO_URL or AUTH_PORT are undefined
if (!MONGO_URL) {
    console.error("Error: MONGO_URL is not defined. Check your .env file.");
    process.exit(1);
}

if (!AUTH_PORT) {
    console.error("Error: AUTH_PORT is not defined. Check your .env file.");
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(MONGO_URL)
    .then(() => console.log("Auth MongoDB is connected successfully"))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });


// Start the server
app.listen(AUTH_PORT, () => {
    console.log(`Auth Server is listening on AUTH_PORT ${AUTH_PORT}`);
});
