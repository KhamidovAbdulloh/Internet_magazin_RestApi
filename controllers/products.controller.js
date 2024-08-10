const Product = require('../models/Product.js')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc      Get all products/
// @route     GET /api/v1/
// @access    Public
exports.getAllProducts = asyncHandler(async (req, res, next) => {
	const pageLimit = process.env.DEFAULT_PAGE_LIMIT || 5
    const limit = parseInt(req.query.limit || pageLimit)
    const page = parseInt(req.query.page || 1)
    const total = await Product.countDocuments()

	const products = await Product.find().skip((page * limit) - limit).limit(limit)

	res.status(200).json({
		succes: true,
		title: "All products",
		pageCount: Math.ceil(total/limit),
    	currentPage: page,
    	nextPage: Math.ceil(total/limit) < page + 1 ? null : page + 1,
		data: products
	})
})

// @desc      Get my products
// @route     GET /api/v1/products/
// @access    Public
exports.getMyProducts = asyncHandler(async (req, res, next) => {
	const user = req.user._id || null
	const myProducts = await Product.find({user}).populate('user')

	res.status(200).json({
		success: true,
		title: 'My products',
		data: myProducts,
	})
})

// @desc      Get one product by id
// @route     GET /api/v1/products/:id
// @access    Public
exports.getProductById = asyncHandler(async (req, res, next) => {
	const product = await Product.findById(req.params.id).populate('user')
  
	res.status(200).json({
	  success: true,
	  data: product
	})
  })
  
  // @desc      Create new product
  // @route     POST /api/v1/products/
  // @access    Private
  exports.addProduct = asyncHandler(async (req, res, next) => {
	const newProduct = await Product.create({
		title: req.body.title,
		description: req.body.description,
		price: req.body.price,
		image: 'uploads/' + req.file.filename,
		user: req.user._id})
  
	res.status(201).json({
	  success: true,
	  data: newProduct
	})
  })
  
  // @desc      Update product
  // @route     PUT /api/v1/products/:id
  // @access    Private
  exports.updateProduct = asyncHandler(async (req, res, next) => {
	const product = await Product.findById(req.params.id)
	const editedProduct = {
		title: req.body.title,
		description: req.body.description,
		price: req.body.price,
	}
  
	const updatedProduct = await Product.findByIdAndUpdate(req.params.id, editedProduct, {
	  new: true
	})
  
	res.status(200).json({
	  success: true,
	  data: updatedProduct
	})
  })
  
  // @desc      Delete product
  // @route     DELETE /api/v1/products/:id
  // @access    Private
  exports.deleteProduct = asyncHandler(async (req, res, next) => {
	await Product.findByIdAndDelete(req.params.id)
  
	res.status(200).json({
	  success: true,
	  message: 'Deleted successfully'
	})
  })
