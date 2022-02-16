// env vars and async error
require("dotenv").config();
require("express-async-errors");

// express setup
const express = require("express");
const app = express();

// Rest of the packages
const morgan = require("morgan");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");

// import routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");

// import Connect to Database
const connectDB = require("./db/connect");

// Error handling middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(morgan("tiny")); // logging middleware : for Debugging
app.use(express.json()); // to access json data from req.body
app.use(cookieParser(process.env.JWT_SECRET)); // to access cookie data from req.cookies and sign it
app.use(cors()); // CORS Permission granted

// Static Assets middleware and invoke
app.use(express.static("./public"));
app.use(fileUpload());

// Testing Route
app.get("/", (req, res) => {
  res.send("e-Commerce API");
});

// Testing Route: Cookie
app.get("/api/v1", (req, res) => {
  // console.log(req.cookies);
  console.log(req.signedCookies); // Signed Cookies
  res.send("e-Commerce API");
});

//---------------------
// Mounting the Routers
//----------------------
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);

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
        `MongoDB Connected: Server is listening on port ${port}...`.cyan
          .underline
      );
    });
  } catch (error) {
    console.log(`${error.name}, ${error.message}`.red.bold);
  }
};
start();
