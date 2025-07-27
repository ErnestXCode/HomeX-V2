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
const axios = require('axios')
const moment = require('moment')

// have url for production

const app = express();
dotenv.config();

const whiteList = [
  process.env.VITE_URL,
  "http://localhost:4173",
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



async function getAccessToken() {
  const auth = Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`).toString('base64');
  const { data } = await axios.get(`${process.env.STK_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` }
  });
  return data.access_token;
}

app.post('/stkpush', async (req, res) => {
  console.log('stkpush')
  try {
    const { phone } = req.body;
    const amount = 250;
    const token = await getAccessToken();
    console.log('token', token)
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const password = Buffer.from(process.env.SHORTCODE + process.env.PASSKEY + timestamp).toString('base64');

    const payload = {
      BusinessShortCode: process.env.SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone,
      PartyB: process.env.SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: process.env.CALLBACK_URL,
      AccountReference: 'Fixed250',
      TransactionDesc: 'Access content'
    };
    console.log('started axios in stk')
    const { data } = await axios.post(`${process.env.STK_URL}/mpesa/stkpush/v1/processrequest`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('finished axios in stk', data)


    res.json({ message: 'STK push sent', data });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Payment initiation failed' });
  }
});

app.post('/callback', (req, res) => {
  console.log('callback')
  const cb = req.body.Body.stkCallback;
  console.log('Callback:', JSON.stringify(cb, null, 2));
  // If cb.ResultCode === 0 → grant access
  res.sendStatus(200);
});


app.use("/", require("./routes/areas"));
app.use("/", require("./routes/refresh"));
app.use("/", require("./routes/houses"));
app.use("/", require("./routes/images"));
app.use("/", require("./routes/token"));
app.use("/", require("./routes/tokenCallback"));


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
