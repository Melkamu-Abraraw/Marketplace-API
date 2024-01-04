const express = require("express");
const authController = require("./../controllers/authController");
const plantController = require("./../controllers/plantController");
const router = express.Router();

router
  .route("/")
  .get(plantController.getAllPlants)
  .post(plantController.uploadPlantImages, plantController.createPlant);

module.exports = router;
