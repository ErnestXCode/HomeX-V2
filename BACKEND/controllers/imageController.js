const mongoose = require("mongoose");
const { getGridFSBucket } = require("../config/db");
const { ObjectId } = require("mongodb");

const getImageByFilename = async (req, res) => {
  try {
    const fileId = new ObjectId(req.params.filename);

    const bucket = getGridFSBucket();
    const file = await bucket.find({ _id: fileId }).toArray();

    if (!file || file.length === 0)
      return res.status(404).json({ message: "No file found" });

    res.set({
      "Cache-Control": "public, max-age=31536000", // aggressive caching
      "Content-Type": file[0].contentType || "image/webp",
    });

    const downloadStream = bucket.openDownloadStream(fileId);
    downloadStream.pipe(res);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = getImageByFilename;
