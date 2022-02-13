const mongoose = require("mongoose");

//-------------------------
// Define Product Schema
//-------------------------
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide product name"],
      maxlength: [100, "Product name cannot be more than 100 characters"],
    },

    price: {
      type: Number,
      required: [true, "Please provide product price"],
      default: 0,
    },

    description: {
      type: String,
      required: [true, "Please provide product description"],
      maxlength: [
        1000,
        "Product description cannot be more than 1000 characters",
      ],
    },

    image: {
      type: String,
      default: "/uploads/example.jpeg",
    },

    category: {
      type: String,
      required: [true, "Please provide product category"],
      enum: ["office", "kitchen", "bedroom"],
    },

    company: {
      type: String,
      required: [true, "Please provide product company"],
      enum: {
        values: ["ikea", "liddy", "marcos"],
        message: `{VALUE} is not supported`,
      },
    },

    colors: {
      type: [String],
      required: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    freeShipping: {
      type: Boolean,
      default: false,
    },

    inventory: {
      type: Number,
      required: true,
      default: 15,
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    // Parent Referencing: NOT written as an Array like Child Ref, but as an Object itself like other fields in Schema
    // User Model is the Parent here: Product Model is the Child
    // Eventually: Creating new products will be restricted to admin only
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  { timestamps: true }
);

//---------------------
// Create Model using the defined Schema and Export the Model
//---------------------
module.exports = mongoose.model("Product", ProductSchema);
