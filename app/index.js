const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const apiRoutes = require("./Routes/api");
const viewRoutes = require("./Routes/web");

const { MONGO_URL, PORT} = process.env;
const app = express();

app.set("view engine", "ejs");
app.set("views", "app/views");

app.use(
    cors({
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);
app.use(express.json());

app.use("/api", apiRoutes);
app.use("/", viewRoutes);


mongoose.connect(MONGO_URL)
    .then(() => console.log("MongoDB is connected successfully"))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

