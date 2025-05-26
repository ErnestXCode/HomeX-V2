const House = require("../models/houseModel");
const fs = require("fs");
const path = require("path");
const User = require("../models/userModel");
const sharp = require("sharp");
const { Readable } = require("stream");
const { getGridFSBucket, getGFS } = require("../config/db");
const { ObjectId } = require("mongodb");

const createHouse = async (req, res) => {
  const content = req.body;
  // if (
  //   !content.area ||
  //   !content.pricing ||
  //   !content.landMarks ||
  //   !content.landLord
  // ) {
  //   return res.status(400).json({ error: "All inputs are mandatory" });
  // }
  try {
    const refreshToken = req.cookies?.jwt;

    const verifiedUser = await User.findOne({ refreshToken }).exec();

    if (!verifiedUser) return res.status(400).json("user not authorized");
    if (!req.files) return res.status(400).json("image required");
    const imageIds = [];
    for (const file of req.files) {
      try {
        const compressedBuffer = await sharp(file.buffer)
          .resize({ width: 1000 })
          .webp({ quality: 70 })
          .toBuffer();

        const stream = Readable.from(compressedBuffer);

        const uploadStream = getGridFSBucket().openUploadStream(
          file.originalname.split(".")[0] + ".webp",
          {
            contentType: "image/webp",
          }
        );

        await new Promise((resolve, reject) => {
          stream
            .pipe(uploadStream)
            .on("finish", () => {
              imageIds.push(uploadStream.id.toString());
              resolve();
            })
            .on("error", reject);
        });
      } catch (err) {
        // console.log("error", file, err);
        res.status(500).json("failed to upload image", file, err);
      }
    }

    // const imagePaths = req.files.map((file) => file.filename);

    const data = { ...content, images: imageIds, landLord: verifiedUser._id };
   
    const newHouse = await new House(data);
    try {
      await newHouse.save();
    } catch (err) {
      console.log('err kwa house', err)
    }


    return res.status(200).json(newHouse);
  } catch (err) {
    return res.status(400).json("Could not create House");
  }
};

const getHouseById = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "No id provided" });
  try {
    const house = await House.findById(id).populate("landLord");
    res.status(200).json(house);
  } catch (error) {
    console.log("error getting house", error);
    res.status(400).json(error);
  }
};

const getAllHouses = async (req, res) => {
  try {
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 3;
    const area = req.query?.area;
    const pricing = req.query?.price;

    const houses = area
      ? await House.find({ area })
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
      : pricing
      ? await House.find({ pricing })
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
      : await House.find()
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit);

    const total = await House.countDocuments();

    res.status(200).json({
      data: houses,
      hasMore: page * limit < total,
      nextPage: page + 1,
    });
  } catch (error) {
    console.log("error getting all houses", error);
    res.status(400).json(error);
  }
};

const updateHouse = async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ error: "invalid request, provide an id" });

  const content = req.body;
  if (
    !content.image ||
    !content.area ||
    !content.pricing ||
    !content.landMarks ||
    !content.landLord
  )
    return res.status(400).json({ error: "All inputs are mandatory" });
  try {
    const updatedHouse = await House.findByIdAndUpdate(id, content, {
      new: true,
    });
    res.status(200).json(updatedHouse);
  } catch (error) {
    console.log("error updating house", error);
    res.status(400).json(error);
  }
};
const deleteHouse = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await House.findByIdAndDelete(id, { new: true });
    if (!result) return res.status(200).json({ error: "House does not exist" });
    const imageIds = result?.images;
    // delete images from uploads before deploying
    const bucket = getGridFSBucket();
    imageIds.forEach(async (imageId) => {
      const imageAsObjectId = new ObjectId(imageId);
      return await bucket.delete({ _id: imageAsObjectId });
    });
    console.log(result);

    res.status(200).json({ status: "successfully deleted house" });
  } catch (error) {
    console.log("error deleting house", error);
    res.status(400).json(error);
  }
};

module.exports = {
  createHouse,
  getHouseById,
  getAllHouses,
  updateHouse,
  deleteHouse,
};
