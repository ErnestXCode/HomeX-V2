const Area = require("../models/areaModel");

const createArea = async (req, res) => {
  const content = req.body;
  try {
    const newArea = await new Area(content);
    await newArea.save();
    res.status(201).json(newArea);
  } catch (error) {
    console.log("error creating area", error);
    res.status(400).json(error);
  }
};

const getArea = async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ error: "invalid request, provide an id" });

  try {
    const area = await Area.findById(id);
    res.status(200).json(area);
  } catch (error) {
    console.log("error getting area", error);
    res.status(400).json(error);
  }
};
const getAllAreas = async (req, res) => {
  try {
    const areas = await Area.find();
    res.status(200).json(areas);
  } catch (error) {
    console.log("error getting all areas", error);
    res.status(400).json(error);
  }
};
const updateArea = async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ error: "invalid request, provide an id" });

  const content = req.body;
  if (!content.area)
    return res.status(400).json({ error: "invalid request, provide an area" });

  try {
    const updatedArea = await Area.findByIdAndUpdate(id, content, {
      new: true,
    });
    res.status(200).json(updatedArea);
  } catch (error) {
    console.log("error updating area", error);
    res.status(400).json(error);
  }
};
const deleteArea = async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ error: "invalid request, provide an id" });

  try {
    await Area.findByIdAndDelete(id, { new: true });
    res.status(200).json({ status: "successfully deleted area" });
  } catch (error) {
    console.log("error deleting area", error);
    res.status(400).json(error);
  }
};

module.exports = {
  createArea,
  getAllAreas,
  getArea,
  deleteArea,
  updateArea,
};
