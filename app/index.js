const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/apiRoutes");
require("dotenv").config();

const apiRoutes = require("./Routes/apiRoutes");
const viewRoutes = require("./Routes/viewRoutes");

const { MONGO_URL, PORT} = process.env;
const app = express();

app.set("view engine", "ejs");
app.set("views", "app/views");

app.use(
    cors({
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api", apiRoutes);
app.use("/", viewRoutes);


mongoose.connect(MONGO_URL)
    .then(() => console.log("MongoDB is connected successfully"))
    .catch((err) => console.error(err));

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

