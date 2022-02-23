// import models
const Product = require("../models/productModel");
const Order = require("../models/orderModel");

// rest of the imports
const { StatusCodes } = require("http-status-codes");
const CustomErrorAPI = require("../errors");

// authentication imports
const { checkPermissions } = require("../utils");

// fake Stripe API Helper function for Payments
const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
};

//-------------------------------------------------------------
// @ desc       Get all orders
// @ route      POST /api/v1/orders
// @ access     Private
const createOrder = async (req, res, next) => {
  // pull out from req.body
  const { items: cartItems, tax, shippingFee } = req.body;

  // Check for items in the body and also if there is atleast one item in the cart
  if (!cartItems || cartItems.length < 1) {
    throw new CustomErrorAPI.BadRequestError("No cart items provided");
  }

  // Check for tax and shippingFee in the body
  if (!tax || !shippingFee) {
    throw new CustomErrorAPI.BadRequestError(
      "Please provide tax and shipping fee"
    );
  }

  // How to find product from the array? -->
  // We use findOne() and pass in the product id.
  // Now, where is the product that is sitting or sitting in this property? Correct. The product one.
  // But it uses "await" and we cannot use forEach on my array or we cannot use "map".
  // So what we will need to do is set up "for-of" loop, and that way we can run async-operation inside of the loop.

  // Step 1) Constructing Empty Array
  let orderItems = [];
  let subTotal = 0;

  // Step 2) for-of Loop
  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new CustomErrorAPI.NotFoundError(
        `No product found with the ID of ${item.product}`
      );
    }
    // If product is found in the DB: pull out these properties
    const { name, price, image, _id } = dbProduct;
    // console.log(name, price, image);
    // Constructing the singlOrderItem
    const singleOrderItem = {
      amount: item.amount, // coming from the frontend
      name,
      price,
      image,
      product: _id, // OR === item.product
    };

    // Add item to order: to our previously defined empty array
    orderItems = [...orderItems, singleOrderItem];
    // calculate subtotal and add to our other array
    // subTotal = subTotal + item.amount * price;
    subTotal += item.amount * price;
  }

  // console.log(orderItems);
  // console.log(subTotal);

  // 3) Calculating the grandTotal
  const grandTotal = tax + shippingFee + subTotal;

  // 4) Communicate with Stripe: get client secret
  const paymentIntent = await fakeStripeAPI({
    amount: grandTotal,
    currency: "usd",
  });
  // 5) Finally create our order
  const myOrder = await Order.create({
    orderItems,
    grandTotal,
    subTotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    // tying user with the order
    user: req.user.userId,
  });

  // Response
  res
    .status(StatusCodes.CREATED)
    .json({ order: myOrder, clientSecret: myOrder.clientSecret });
};

//-------------------------------------------------------------
// @ desc       Get all orders
// @ route      GET /api/v1/orders
// @ access     Private [Admin Only]
const getAllOrders = async (req, res, next) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ count: orders.length, orders });
};

//-------------------------------------------------------------
// @ desc       Get Single order
// @ route      GET /api/v1/orders/:id
// @ access     Private
const getSingleOrder = async (req, res, next) => {
  const { id: orderId } = req.params;

  const order = await Order.findOne({ _id: orderId });

  if (!order) {
    throw new CustomErrorAPI.NotFoundError(
      `No order found with the ID of ${orderId}`
    );
  }

  // Check For Permissions
  checkPermissions(req.user, order.user);

  res.status(StatusCodes.OK).json({ order });
};

//-------------------------------------------------------------
// @ desc       Get Current User orders
// @ route      GET /api/v1/orders/showAllMyOrders
// @ access     Private
const getCurrentUserOrders = async (req, res, next) => {
  const orders = await Order.find({ user: req.user.userId });

  res.status(StatusCodes.OK).json({ count: orders.length, orders });
};

//-------------------------------------------------------------
// @ desc       Update order
// @ route      PATCH /api/v1/orders/:id
// @ access     Private
const updateOrder = async (req, res, next) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;

  const order = await Order.findOne({ _id: orderId });

  if (!order) {
    throw new CustomErrorAPI.NotFoundError(
      `No order found with the ID of ${orderId}`
    );
  }

  // Check For Permissions
  checkPermissions(req.user, order.user);

  // If everything checks out: Go ahead
  order.paymentIntentId = paymentIntentId;
  order.status = "paid";

  // Save to DB
  await order.save();

  // Send Response
  res.status(StatusCodes.OK).json({ order });
};

//--------
// Exports
//--------
module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
