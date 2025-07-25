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
const morgan = require("morgan");
const cron = require("node-cron");
const webpush = require("web-push");
const rateLimit = require("express-rate-limit");
const House = require("./models/houseModel");
const redisClient = require("./config/redisConfig");

// have url for production

const app = express();
dotenv.config();

const whiteList = [
  process.env.VITE_URL,
  "http://localhost:4173",
  "https://home-x-v2-38ye-nesters-projects-0b5aae41.vercel.app/",
];

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

const publicVapidKey =
  "BAde7VA6f9OY0ymntvlgviHfBNqUQGWO-q52d_HaXYhEYKPv5uyte8bQBpHjWsttayvnfdpHigsviph_gAlpMp8";
const privateVapidKey = "9i8sGgh-WoGaxPXDS6sCPVlhvHR0nxVgqxRwmJDvVVY";
// }put in .env

webpush.setVapidDetails(
  // jua no ya nini
  "mailto:test@test.com",
  publicVapidKey,
  privateVapidKey
);

// subscribe
app.post("/subscribe", async (req, res) => {
  // get push sub obj from client
  const subscription = req.body;

  res.status(201).json({ message: "successfull" });

  const payload = JSON.stringify({ title: "push test" });

  try {
    webpush.sendNotification(subscription, payload);
  } catch (err) {
    console.log(err);
  }
});

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

app.get("/ping", (req, res) => {
  res.status(200).json({ status: "ok", time: new Date().toISOString() });
});

cron.schedule("0 0 * * *", async () => {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const house = await House.updateMany(
    {
      status: "vacant",
      updatedStatusAt: { $lte: new Date(sevenDaysAgo) },
    },
    {
      status: "possibly_taken",
    }
  );
  console.log(house);
});

app.use(
  "/api/",
  rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100, // 100 requests per minute
    message: "Too many requests, try again later.",
  })
);

app.use("/", require("./routes/areas"));
app.use("/", require("./routes/refresh"));
app.use("/", require("./routes/houses"));
app.use("/", require("./routes/images"));
const x = [];

app.get("/notification", (req, res) => {
  webpush.sendNotification(x[0], "hello nesters world");
  res.json("success message sent");
});

app.post("/subscription", (req, res) => {
  console.log(req.body);
  x.push(req.body);
  res.json("saved to array");
});

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
  try {
    await redisClient.connect();
    console.log("Redis initiated Successfully");
  } catch (err) {
    console.log("Error Connecting to Redis ", err);
  }
  const PORT = process.env.PORT || 5000;

  console.log("gfs", getGFS() ? "DEFINED" : "UNDEFINED");
  console.log("gridfsbucket", getGridFSBucket() ? "DEFINED" : "UNDEFINED");

  app.listen(PORT, () => {
    console.log(`App connected on: http://localhost:${PORT}`);
  });
})();
