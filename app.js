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
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");

// import routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const orderRouter = require("./routes/orderRoutes");

// import Connect to Database
const connectDB = require("./db/connect");

// Error handling middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//------------------------
// 1) GLOBAL MIDDLEWARES
//------------------------
// Set Security HTTP Headers
app.use(helmet());

// CORS Permission granted
app.use(cors());

// Trust proxy to use in other applications
app.set("trust proxy", 1);

// Limit requests from the same IP Address:
// a) against DDoS and Brute Force Attacks
app.use(
  rateLimiter({
    max: 100,
    windowMs: 15 * 60 * 1000,
    message:
      "Too many requests from this IP, please try again after 15 minutes!",
  })
);

// app.use(morgan("tiny")); // logging middleware : for Debugging in dev mode

// Body parser: limiting data reading from body into req.body
app.use(express.json({ limit: "10kb" }));

// Data Sanitization: Cleaning all the data that is coming from some Malacious code
// a) against NoSQL query Injection: MongoDB Operators that return "true" in all queries
app.use(mongoSanitize());
// b) against Server-Side XSS: Cross-Site Scripting Attacks: Injecting Malacious HTML + JavaScript Code
app.use(xss());

app.use(cookieParser(process.env.JWT_SECRET)); // to access cookie data from req.cookies and sign it

// Static Assets middleware and invoke
app.use(express.static("./public"));
app.use(fileUpload());

// For Development Testing

// // Testing Route
// app.get("/", (req, res) => {
//   res.send("e-Commerce API");
// });

// // Testing Route: Cookie
// app.get("/api/v1", (req, res) => {
//   // console.log(req.cookies);
//   console.log(req.signedCookies); // Signed Cookies
//   res.send("e-Commerce API");
// });

//---------------------
// Mounting the Routers
//----------------------
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

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
