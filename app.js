// env vars
require("dotenv").config();

// express setup
const express = require("express");
const app = express();

// import Connect to DB
const connectDB = require("./db/connect");

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
      console.log(`Server is running on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
