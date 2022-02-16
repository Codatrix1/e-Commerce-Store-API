const Product = require("../models/productModel");
const { StatusCodes } = require("http-status-codes");
const CustomErrorAPI = require("../errors");

// @ desc       Get all products
// @ route      GET /api/v1/products
// @ access     Public
const getAllProducts = async (req, res, next) => {
  const products = await Product.find({});

  res.status(StatusCodes.OK).json({ results: products.length, products });
};

// @desc       Get single product
// @route      GET /api/v1/products/:id
// @ access    Public
const getSingleProduct = async (req, res, next) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new CustomErrorAPI.NotFoundError(
      `No product found with the ID of ${productId}`,
      404
    );
  }

  res.status(StatusCodes.OK).json({ product });
};

// @desc       Create product
// @route      POST /api/v1/products
// @ access    Private
const createProduct = async (req, res, next) => {
  // WE check the "user" role as "admin" in our cookie and then proceed with the below code
  // Manually re-assign the property coming from req.body
  req.body.user = req.user.userId;

  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ success: true, product });
};

// @desc       Update product
// @route      PATCH /api/v1/products/:id
// @ access    Private
const updateProduct = async (req, res, next) => {
  // destructuring and re-assigning req.params manually
  const { id: productId } = req.params;

  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new CustomErrorAPI.NotFoundError(
      `No product found with the ID of ${productId}`,
      404
    );
  }

  res.status(StatusCodes.OK).json({ success: true, product });
};

// @desc       Delete product
// @route      DELETE /api/v1/products/:id
// @ access    Private
const deleteProduct = async (req, res, next) => {
  // destructuring and re-assigning req.params manually
  const { id: productId } = req.params;

  const product = await Product.findOneAndDelete({ _id: productId });

  if (!product) {
    throw new CustomErrorAPI.NotFoundError(
      `No product found with the ID of ${productId}`,
      404
    );
  }

  await product.remove();

  res.status(StatusCodes.OK).json({ msg: "Success! Product removed" });
};

// @desc       Add product image
// @route      POST /api/v1/products/uploadImage
// @ access    Private
const uploadImage = async (req, res, next) => {
  res.send("Upload Product Image");
};

//----------
// Exports
//----------
module.exports = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
