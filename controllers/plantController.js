const multer = require("multer");
const express = require("express");
const Plant = require("./../Models/plantModal");
const User = require("../Models/userModal");
const baseUrl = "http://localhost:3001/";
const jwt = require("jsonwebtoken");

var ext;
var filename;

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images");
  },
  filename: (req, file, cb) => {
    ext = file.mimetype.split("/")[1];
    filename = `plant-image-${Date.now()}.${ext}`;
    cb(null, filename);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
exports.createPlant = async (req, res) => {
  console.log(req.files);
  const imageObject = req.files;

  Object.keys(imageObject).forEach((key) => {
    const images = imageObject[key];

    images.forEach((image) => {
      if (image.fieldname === "OriginalImage") {
        req.body.OriginalImage = image.filename;
      } else if (image.fieldname === "SegmentedImage") {
        req.body.SegmentedImage = image.filename;
      } else {
        req.body.DetectedImage = image.filename;
      }
    });
  });
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    req.body.email = user.email;
    req.body.user_id = userId;
    const newPlant = await Plant.create(req.body);

    res.status(201).json({
      status: "success",
      newPlant,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAllPlants = async (req, res) => {
  try {
    const plants = await Plant.find();
    if (plants.countDocuments === 0) {
      return res.status(500).send({
        message: "No files found!",
      });
    }

    let leafInfos = [];
    plants.forEach((doc) => {
      leafInfos.push({
        OriginalImage: baseUrl + doc.OriginalImage,
        SegmentedImage: baseUrl + doc.SegmentedImage,
        DetectedImage: baseUrl + doc.DetectedImage,
        email: doc.email,
        disease: doc.disease,
        severity: doc.severity,
        date: doc.date,
        id: doc._id,
      });
    });

    res.status(200).json({
      status: "success",
      results: plants.length,
      data: {
        leafInfos,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err.message,
    });
  }
};
exports.countSeverity = async (req, res) => {
  try {
    const severityCount = Plant.countDocuments({ severity: { $gt: 15 } });
    res.status(200).json({
      severityCount,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err.message,
    });
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadPlantImages = upload.fields([
  { name: "OriginalImage", maxCount: 1 },
  { name: "SegmentedImage", maxCount: 1 },
  { name: "DetectedImage", maxCount: 1 },
]);
