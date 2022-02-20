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
        "Product description cannot be more than 2000 characters",
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
      default: ["#222"],
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
    // Mind the property name here: "user": same must be used while creating a new product while we manually assign "user" equal to the user coming from req.body
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },

  {
    timestamps: true,
    // Virtuals are document properties that you can get and set but that do not get persisted to MongoDB.
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    // get me the docs where rating === 5
    // match: { rating: 5 },
  }
);

// Cascade delete reviews when a product is deleted:
// i.e. when a product is deleted, all the reviews associated with that specific product also gets deleted
ProductSchema.pre("remove", async function (next) {
  console.log(`Reviews being removed from the product: ${this._id}`);
  await this.model("Review").deleteMany({ product: this._id });
  next();
});

//---------------------------------------------------------------------------------------------
// REVERSE Populate with virtuals: Displaying all the reviews as an Array in a each product
//--------------------------------------------------------------------------------------------
ProductSchema.virtual("reviews", {
  foreignField: "product",
  localField: "_id",
  ref: "Review",
  // This ensures that I am getting a list
  justOne: false,
});

//---------------------
// Create Model using the defined Schema and Export the Model
//---------------------
module.exports = mongoose.model("Product", ProductSchema);
