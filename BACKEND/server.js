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
const  rateLimit  = require("express-rate-limit");
const morgan = require("morgan");
const cron = require('node-cron')
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
// can add an authorized token
// const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :date[web] :type', {  stream: accessLogStream})) 

// morgan.token('type', (req, res) => {
//   return req.headers.authorization || req.headers.Authorization
// })

app.use(compression());
// app.use(helmet())   inafanya sijui si same origin so inakata for now
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.use("/", require("./routes/houses"));
app.use("/", require("./routes/areas"));
app.use("/", require("./routes/images"));
app.use("/", require("./routes/refresh"));



// const limiter = rateLimit(
//   max: 100, 
//   windowMs: 60*60*1000, 
//   message: 'Too many requests from this IP, please try again in an hour'
// })
// app.use('/', limiter)

app.use("/", require("./routes/auth"));
app.use("/", require("./routes/user"));

(async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;

  console.log("gfs", getGFS() ? "DEFINED" : "UNDEFINED");
  console.log("gridfsbucket", getGridFSBucket() ? "DEFINED" : "UNDEFINED");

  app.listen(PORT, () => {
    console.log(`App connected on: http://localhost:${PORT}`);
  });
})();
