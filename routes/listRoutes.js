const express = require("express");
const authController = require("./../controllers/authController");
const listController = require("./../controllers/listController");
const router = express.Router();

router
  .route("/")
  .get(listController.getAllListings)
  .post(listController.uploadListingImages, listController.createListing);
router.route("/expoPushTokens").post(listController.pushToken);
router.route("/sendNotification").post(listController.sendNotification);
router.route("/getToken/:id").get(listController.getToken);

router
  .route("/:id")
  .delete(listController.deleteListing)
  .get(listController.getList)
  .put(listController.uploadListingImages, listController.updateProduct);
router.route("/new").get(authController.protect, listController.getNewListing);
module.exports = router;
