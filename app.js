// env vars and async error
require("dotenv").config();
require("express-async-errors");

// express setup
const express = require("express");
const app = express();

// Rest of the packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// import routers
const authRouter = require("./routes/authRoutes");

// import Connect to Database
const connectDB = require("./db/connect");

// Error handling middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(morgan("tiny")); // logging middleware : for Debugging
app.use(express.json()); // to access json data from req.body
app.use(cookieParser(process.env.JWT_SECRET)); // to access cookie data from req.cookies

// Testing Route
app.get("/", (req, res) => {
  res.send("e-Commerce API");
});

// Testing Route: Cookie
app.get("/api/v1", (req, res) => {
  // console.log(req.cookies);
  console.log(req.signedCookies);
  res.send("e-Commerce API");
});

//---------------------
// Mounting the Routers
//----------------------
app.use("/api/v1/auth", authRouter);

// invoking error handling middlewares:
// Very Important: Mind the ORDER of middleware placement
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

//--------------------------
// Setting up the Server
//--------------------------
const port = process.env.PORT || 5000;
const start = async () => {
  try {
    // invoke connectDB
    await connectDB(process.env.MONGO_URI);
    // listen to the server
    app.listen(port, (req, res) => {
      console.log(
        `Connected to the Database: Server is listening on port ${port}...`
      );
    });
  } catch (error) {
    console.log(error);
  }
};
start();
