const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const userRouter = require("./routes/userRoutes");
const listRouter = require("./routes/listRoutes");
const adminRouter = require("./routes/adminRoutes");
const AppError = require("./utils/appError");
const app = express();
// 1) MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.static("Images"));
app.use(express.static("Lists"));
app.use(express.json());

app.use(cors());
// 3) ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/lists", listRouter);
app.use("/api/v1", listRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
