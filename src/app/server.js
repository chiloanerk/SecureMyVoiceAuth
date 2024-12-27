const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") }); // Adjusted path

const apiRoutes = require("./routes/api");

// Use process.env to get environment variables from the .env file
const { MONGO_URL, PORT } = process.env;

const app = express();

app.use(express.json());
app.use("/api", apiRoutes);

// Check if MONGO_URL or PORT are undefined
if (!MONGO_URL) {
    console.error("Error: MONGO_URL is not defined. Check your .env file.");
    process.exit(1);
}

if (!PORT) {
    console.error("Error: PORT is not defined. Check your .env file.");
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(MONGO_URL)
    .then(() => console.log("App MongoDB is connected successfully"))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });

// Start the server
app.listen(PORT, () => {
    console.log(`App Server is listening on port ${PORT}`);
});
