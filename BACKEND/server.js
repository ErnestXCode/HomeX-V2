const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const compression = require("compression");
const helmet = require("helmet");
// verification of data availability in the controllers -----remember
const { connectDB, getGFS, getGridFSBucket } = require("./config/db");
// const { setTimeout } = require("timers/promises");

// const { options } = require("./routes/user");
const app = express();
dotenv.config();

const whiteList = [process.env.VITE_URL];

const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.includes(origin) || !origin) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error("Not allowed by CORS")); // Reject the request
    }
  },
  credentials: true,
};

app.use(compression());
// app.use(helmet())   inafanya sijui si same origin so inakata for now
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

(async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;
 
    console.log("gfs", getGFS()   ? 'DEFINED' : 'UNDEFINED');
    console.log("gridfsbucket", getGridFSBucket() ? 'DEFINED' : 'UNDEFINED');
 

  app.listen(PORT, () => {
    console.log(`App connected on: http://localhost:${PORT}`);
  });
})();
