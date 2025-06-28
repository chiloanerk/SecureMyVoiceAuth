const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require('cors');

const apiRoutes = require("./routes/auth");

const { MONGO_URL, AUTH_PORT } = process.env;

const app = express();

app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
    if (req.method === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE"); // Adjust allowed methods as needed
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Adjust allowed headers as needed
        res.status(200).send();
    } else {
        next();
    }
});

app.use("/auth", apiRoutes);
app.get("/", (req, res) => {
    res.status(200).json({message: `Welcome to the ${process.env.NAME} auth API`});
});

app.use((req, res) => {
    res.status(404).json({ message: "Not Found" });
});

console.log("MongoURL is: " + MONGO_URL);
if (!MONGO_URL) {
    console.error("Error: MONGO_URL is not defined. Check your .env file.");
    process.exit(1);
}

if (!AUTH_PORT) {
    console.error("Error: AUTH_PORT is not defined. Check your .env file.");
    process.exit(1);
}

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
