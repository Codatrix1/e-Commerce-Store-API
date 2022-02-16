const Product = require("../models/productModel");
const { StatusCodes } = require("http-status-codes");
const CustomErrorAPI = require("../errors");
const path = require("path");

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
      `No product found with the ID of ${productId}`
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
      `No product found with the ID of ${productId}`
    );
  }

  await product.remove();

  res.status(StatusCodes.OK).json({ msg: "Success! Product removed" });
};

// @desc       Add product image
// @route      POST /api/v1/products/uploadImage
// @ access    Private
const uploadImage = async (req, res, next) => {
  // console.log(req.files);

  // 1) Check for req.files: Coming from "express-fileUpload":
  if (!req.files) {
    throw new CustomErrorAPI.BadRequestError("No image file uploaded");
  }

  // 2) get the image property from the object and assign to a variable to be used
  const productImage = req.files.image;

  // 3) Check for mimetype
  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomErrorAPI.BadRequestError("Please upload an image file");
  }

  // 4) Check for allowed file size
  const maxSize = 1024 * 1024;
  if (!productImage.size > maxSize) {
    throw new CustomErrorAPI.BadRequestError(
      "Please upload image smaller than 1MB"
    );
  }

  // 5) Image Path and re-naming the productImage name
  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );

  // 6) saving/Moving the image to our public/uploads folder using: "express-fileUpload" req.files
  await productImage.mv(imagePath);

  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
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
