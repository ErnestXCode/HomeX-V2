const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv')

const connectDB = require("./config/db");

// const { options } = require("./routes/user");
const app = express();
dotenv.config()

const whiteList = [process.env.VITE_URL];

const corsOptions = {
    origin: (origin, callback) => {
        if (whiteList.includes(origin) || !origin) {
            callback(null, true); // Allow the request
        } else {
            callback(new Error('Not allowed by CORS')); // Reject the request
        }
    },
    credentials: true
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use("/", express.urlencoded({ extended: true }));
app.use("/", express.json());


const uploadPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

app.use("/", express.static(uploadPath));


app.use("/", require("./routes/user"));
app.use("/", require("./routes/houses"));
app.use("/", require("./routes/areas"));
app.use("/", require("./routes/auth"));

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App connected on: http://localhost:${PORT}`);
});
