const mongoose = require("mongoose");

//-------------------------
// Define Single Order Schema
//-------------------------
const SingleOrderItemSchema = mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  // Parent Referencing: NOT written as an Array like Child Ref, but as an Object itself like other fields in Schema
  // Product Model is the Parent here: SingleOrderItemSchema Model is the Child
  // Mind the property name here: "product": same must be used while creating a new SingleOrderItem while we manually assign "product" equal to the product
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
});

//-------------------------
// Define Order Schema
//-------------------------
const OrderSchema = mongoose.Schema(
  {
    // Parent Referencing: NOT written as an Array like Child Ref, but as an Object itself like other fields in Schema
    // User Model is the Parent here: Order Model is the Child
    // Mind the property name here: "user": same must be used while creating a new order while we manually assign "user" equal to the user coming from req.body
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },

    // Child Referencing: Refers to all the products ordered by a specific "User" as an Array
    orderItems: [SingleOrderItemSchema],

    tax: {
      type: Number,
      required: true,
    },

    shippingFee: {
      type: Number,
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "failed", "paid", "delivered", "cancelled"],
      default: "pending",
    },

    clientSecret: {
      type: String,
      required: true,
    },

    paymentIntentId: {
      type: String,
    },
  },

  { timestamps: true }
);

//---------------------
// Create Model using the defined Schema and Export the Model
//---------------------
module.exports = mongoose.model("Order", OrderSchema);
