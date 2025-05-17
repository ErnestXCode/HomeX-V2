const Grid = require("gridfs-stream");
const mongoose = require("mongoose");

let gridfsBucket;
let gfs;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    const db = conn.connection;

    gridfsBucket = new mongoose.mongo.GridFSBucket(db.db, {
      bucketName: "uploads",
    });
    gfs = Grid(db.db, mongoose.mongo);
    gfs.collection("uploads");

    console.log("Connected to MongoDB and GridFS successfully");
    return db;
  } catch (err) {
    throw new Error("Could not connect to Mong0DB");
  }
};
const getGFS = () => gfs;
const getGridFSBucket = () => gridfsBucket;

module.exports = {
  connectDB,
  getGFS,
  getGridFSBucket,
};
