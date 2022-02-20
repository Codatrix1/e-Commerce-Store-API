const mongoose = require("mongoose");

//----------------------
// Defining the Schema
//----------------------

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide a rating from 1 to 5"],
    },

    title: {
      type: String,
      trim: true,
      required: [true, "Please provide a review title"],
      maxlength: 150,
    },

    comment: {
      type: String,
      required: [true, "Please provide a review text"],
    },

    // Parent ref: each review will contain the "id" of the user that posted it
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },

    // Parent ref: each review will contain the "id" of the product that the review has been posted on
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product"],
    },
  },

  { timestamps: true }
);

//-----------------------------
// Solving Real World Business Problem: Preventing Duplicate Reviews : Using Compound Indexing
//-----------------------------
// One User is Allowed to write/post only One Review per product:
// Solution: Each combination of Product and User is set to Unique
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

//-----------------------------
// Aggregation Pipeline || :
//-----------------------------

// Static Method called on the Schema/Model itself
ReviewSchema.statics.calculateAverageRating = async function (productId) {
  console.log(productId);
};

ReviewSchema.post("save", async function () {
  // console.log("Post save hook called");
  await this.constructor.calculateAverageRating(this.product);
});

ReviewSchema.post("remove", async function () {
  // console.log("Post remove hook called");
  await this.constructor.calculateAverageRating(this.product);
});

//---------------------
// Create Model using the defined Schema and Export the Model
//---------------------
module.exports = mongoose.model("Review", ReviewSchema);
