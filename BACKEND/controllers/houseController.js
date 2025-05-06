const House = require("../models/houseModel");
const fs = require("fs");
const path = require("path");
const User = require("../models/userModel");

const createHouse = async (req, res) => {
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
    let verifiedLandLord = null;
    try {
      verifiedLandLord = await User.findById(content.landLord);
    } catch (err) {
      return res.status(400).json({ message: "invalid ID" });
    }
    if (!verifiedLandLord) {
      console.log("kuna shida kwa verified landlord");
      return res.status(500).json({ error: "kwa landlord verification" });
    }

    if (!content.image.startsWith("data:image")) {
      return res.status(400).json({ error: "invalid image format" });
    }

    const matches = content.image.match(
      /^data:image\/([a-zA-Z]+);base64,(.+)$/
    );
    if (!matches) {
      return res.status(400).json({ error: "Malformed base64 image" });
    }

    const ext = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");
    const fileName = `house-${Date.now()}.${ext}`;
    const filepath = path.resolve(__dirname, "../uploads", fileName);

    fs.writeFileSync(filepath, buffer);

    const newHouse = await new House({
      ...content,
      image: `uploads/${fileName}`,
      landLord: verifiedLandLord._id,
    });
    await newHouse.save();
    res.status(201).json(newHouse);
  } catch (error) {
    console.log("error creating house", error);
    res.status(400).json(error);
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

const getHouseByArea = async (req, res) => {
  const { area } = req.params;
  if (!area) return res.status(400).json({ error: "No area provided" });
  try {
    const house = await House.find({ area });
    res.status(200).json(house);
  } catch (error) {
    console.log("error getting house", error);
    res.status(400).json(error);
  }
};

const getAllHouses = async (req, res) => {
  try {
    const houses = await House.find();
    res.status(200).json(houses);
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
    const imageUrl = result.image;

    fs.rmSync(imageUrl);

    res.status(200).json({ status: "successfully deleted house" });
  } catch (error) {
    console.log("error deleting house", error);
    res.status(400).json(error);
  }
};

module.exports = {
  createHouse,
  getHouseById,
  getHouseByArea,
  getAllHouses,
  updateHouse,
  deleteHouse,
};
