const House = require("../models/houseModel");
const fs = require("fs");
const path = require("path");
const User = require("../models/userModel");
const sharp = require("sharp");
const { Readable } = require("stream");
const { getGridFSBucket, getGFS } = require("../config/db");
const mongoose = require("mongoose");
const cron = require("node-cron");
const { landlord } = require("../config/roles_list");

const createHouse = async (req, res) => {
  console.time("total");
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
    // const refreshToken = req.cookies?.jwt;

    const verifiedUser = req.user;

    if (!verifiedUser) return res.status(400).json("user not authorized");
    if (!req.files.images) return res.status(400).json("image required");
    if (!req.files.thumbnails)
      return res.status(400).json("thumbnail required");

    const imageIds = [];
    const thumbnailIds = [];
    const base64Array = [];

    const imagePromise = Promise.all(
      req.files.images.map(async (file) => {
        try {
          const compressedBuffer = await sharp(file.buffer)
            .resize({ width: 500 })
            .webp({ quality: 75 })
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
          res.status(500).json("failed to upload thumbnail", file, err);
        }
      })
    );

    const thumbnailPromise = Promise.all(
      req.files.thumbnails.map(async (file) => {
        try {
          const compressedBuffer = await sharp(file.buffer)
            .resize({ width: 500 })
            .webp({ quality: 75 })
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
                thumbnailIds.push(uploadStream.id.toString());
                resolve();
              })
              .on("error", reject);
          });
        } catch (err) {
          // console.log("error", file, err);
          res.status(500).json("failed to upload thumbnail", file, err);
        }
      })
    );
    console.time("promises");
    await Promise.all([
      imagePromise,
      thumbnailPromise,
      (async () => {
        const unBlurredThumbnail = req.files.thumbnails[0];
        const base64String = await sharp(unBlurredThumbnail.buffer)
          .resize(10)
          .blur()
          .webp({ quality: 20 })
          .toBuffer();

        const base64 = `data:image/webp;base64,${base64String.toString(
          "base64"
        )}`;
        base64Array.push(base64);
      })(),
    ]);
    console.timeEnd("promises");

    // console.log(req.files.thumbnails)
    // const imagePaths = req.files.images.map((file) => file.filename);

    const data = {
      ...content,
      images: imageIds,
      thumbnails: thumbnailIds,
      placeholderThumbnail: base64Array[0],
      landLord: verifiedUser._id,
      coords: JSON.parse(content.coords),
      amenities: JSON.parse(content.amenities),
      updatedStatusAt: new Date(),
    };

    const newHouse = await new House(data);

    // console.log(newHouse.coords);

    await newHouse.save();

    res.status(200).json("success creating house");
  } catch (err) {
    res.status(400).json("Could not create House");
  }
  console.timeEnd("total");
};

const updateHouseStatus = async (req, res) => {
  const user = req.user;
  console.log("user", user);
  console.log("query", req.query);
  const HouseId = new mongoose.Types.ObjectId(req.query.id);
  if (!HouseId) return res.json("hakuna houseId").status(400);
  console.log("body", req.body);
  const { numOfHouses } = req.body;
  if (!numOfHouses) return res.json("hakuna numofhouses").status(400);
  await House.findByIdAndUpdate(
    HouseId,
    {
      status: "vacant",
      numOfHouses,
      updatedStatusAt: new Date(),
    },
    { new: true }
  );

  res.json("success updating house").status(201);
};

const getHouseById = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "No id provided" });
  try {
    const house = await House.findById(id).populate("landLord");
    console.log("populated_house", house);
    res.status(200).json(house);
  } catch (error) {
    console.log("error getting house", error);
    res.status(400).json(error);
  }
};

const getShortLists = async (req, res) => {
  try {
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 10;
    console.log("page", page);
    const housesArray = req.user.shortLists;
    if (!housesArray) return res.sendStatus(204);
    const revArray = housesArray.reverse();

    const allShortListsData = await Promise.all(
      revArray.map(async (houseId) => await House.findById(houseId))
    );

    const start = (page - 1) * limit;
    const end = start + limit;

    const paginatedHouses = allShortListsData.slice(start, end);

    res.status(200).json({
      data: paginatedHouses,
      hasMore: page * limit < allShortListsData.length,
      nextPage: page + 1,
    });
  } catch (error) {
    console.log("error getting all houses", error);
    res.status(400).json(error);
  }
};

const markAsTaken = async (req, res) => {
  const { id } = req.query;
  const takenHouse = await House.findByIdAndUpdate(
    id,
    { status: "taken" },
    { new: true }
  );
  if (!takenHouse) return res.json("imekataa kupata takenhouse");
  res.status(200).json("imeitikia");
};

const getAllHouses = async (req, res) => {
  try {
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 10;
    const area = req.query?.area;
    const pricing = req.query?.price;

    const houses =
      area !== "All"
        ? await House.find(
            { area },
            {
              landLord: false,
              amenities: false,
              updatedStatusAt: false,
              coords: false,
            }
          )
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
        : await House.find(
            {},
            {
              landLord: false,
              amenities: false,
              updatedStatusAt: false,
              coords: false,
            }
          )
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

const getLAndlordsHouses = async (req, res) => {
  const user = req.user;
  const userId = user?._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;

  const landLordListings = await House.aggregate([
    { $match: { landLord: userId } },
    { $sort: { createdAt: -1 } },
  ]);

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginatedPosts = landLordListings.slice(start, end);

  const total = landLordListings.length;

  res
    .json({
      data: paginatedPosts,
      hasMore: page * limit < total,
      nextPage: page + 1,
    })
    .status(200);
};

const deleteShortlist = async (req, res) => {
  const { id } = req.query;

  const user = req.user;

  const userId = user._id;

  try {
    const shortlistArray = user.shortLists;

    const updatedShortlistArray = shortlistArray.filter(
      (shortlist) => shortlist.toString() !== id
    );

    await User.findByIdAndUpdate(userId, {
      ...user,
      shortLists: updatedShortlistArray,
    });
    res.status(200).json("successfully deleted shortlist");
  } catch (err) {
    console.log(err);
    res.json("error deleting shortlist", err);
  }
};

const updateHouse = async (req, res) => {
  console.log("started updating");
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ error: "invalid request, provide an id" });

  const content = req.body;
  console.log("content", content);

  const updatedCont = {
    ...content,
    status: "vacant",
    updatedStatusAt: new Date(),
    amenities: JSON.parse(content.amenities),
  };

  try {
    const updatedHouse = await House.findByIdAndUpdate(id, updatedCont, {
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
      const imageAsObjectId = new mongoose.Types.ObjectId(imageId);
      try {
        await bucket.delete({ _id: imageAsObjectId });
      } catch (err) {
        console.log("err deleting image", imageId);
      }
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
  getShortLists,
  getLAndlordsHouses,
  updateHouseStatus,
  markAsTaken,
  deleteShortlist,
};
