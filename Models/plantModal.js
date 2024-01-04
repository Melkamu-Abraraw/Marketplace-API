const mongoose = require("mongoose");
var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = today.getFullYear();

today = `${mm} / ${dd} / ${yyyy}`;
const plantSchema = new mongoose.Schema({
  user_id: {
    type: String,
  },
  email: {
    type: String,
    required: [true, " Email is  required"],
  },
  disease: {
    type: String,
    required: [true, " disease type is  required"],
  },
  severity: {
    type: Number,
    required: [true, " severity value is  required"],
  },
  OriginalImage: {
    type: String,
    required: [true, "an Image Must required"],
  },
  SegmentedImage: {
    type: String,
    required: [true, "an Image Must required"],
  },
  DetectedImage: {
    type: String,
    required: [true, "an Image Must required"],
  },
  date: {
    type: String,
    default: today,
  },
});

const Plant = mongoose.model("Plant", plantSchema);
module.exports = Plant;
