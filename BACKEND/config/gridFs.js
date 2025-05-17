const Grid = require("gridfs-stream");
const mongoose = require("mongoose");

const conn = mongoose.createConnection(process.env.MONGO_URI, {});

let gfs;
let gridfsBucket;

conn.once("open", () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

module.exports = { gfs, gridfsBucket };
