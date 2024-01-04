const multer = require("multer");
const User = require("./../Models/userModal");
const Plant = require("./../Models/plantModal");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.updateList = async (req, res) => {
  try {
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    const Users = users.filter((user) => user.role === "User");
    res.status(200).json({
      status: "success",
      results: Users.length,
      data: {
        users: Users,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err.message,
    });
  }
};
exports.getUser = async (req, res) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);

  try {
    res.status(200).json({
      status: "success",
      data: {
        currentUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userEmail = req.params.email;
    const userCheck = await User.findOne({ email: userEmail });
    if (!userCheck) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    await User.deleteOne({ email: userEmail });
    const users = await User.find();

    res.status(200).json({
      status: "success",
      message: "User successfully deleted",
      users: users,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
