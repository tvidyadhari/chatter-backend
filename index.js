const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const createError = require("http-errors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(morgan("dev"));
app.use(cookieParser({ httpOnly: true, secure: true }));
console.log(process.env.FRONTEND_URL);
// routes middleware
app.use("/api", require("./routes"));

// no match
app.use(async (req, res, next) => next(createError.NotFound()));

// error handler
app.use((error, req, res, next) => {
  console.error("catchall error: ", error.message);
  console.log(error);

  // Joi error handling
  if (error.isJoi) {
    error.status = 422;
    error.message = error.details[0].message;
  }
  // send error response
  const errorStatus = error.status || 500;
  res.status(errorStatus).json({
    error: {
      status: errorStatus,
      message: error.message,
    },
  });
});

// start app
async function startApp() {
  try {
    const db = await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    if (db) {
      console.log("db connected");
      app.listen(PORT, async () => {
        console.log(`server is running at http://localhost:${PORT}`);
      });
    }
  } catch (err) {
    console.log(`db connection failed :< ${err.message}`);
  }
}
startApp();
