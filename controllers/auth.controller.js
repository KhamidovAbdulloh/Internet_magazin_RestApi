const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc      Register new user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body

  const user = await User.create({
    firstName,
    lastName,
    password,
    email,
  })

  const token = user.generateJWTToken()

  res.status(201).json({
    success: true,
    data: user,
    token
  })
}) 

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  //Validate email && password
  if(!email || !password){
    return next(new ErrorResponse('Please provide email and password', 400))
  }

  const user = await User.findOne({ email })

  //Check for the user
  if(!user){
    return next(new ErrorResponse('Invalid Credentials', 401))
  }

  //Check for passwords
  const isMatch = await user.matchPassword(password)

  if(!isMatch){
    return next(new ErrorResponse('Invalid Credentials', 401))
  }

  const token = user.generateJWTToken()


  res.status(200).json({
    success: true,
    data: user,
    token
  })
})

/*// @desc      Logout user
// @route     POST /api/v1/auth/logout
// @access    Private
exports.logout = (req, res) => {
	res.clearCookie('token')
  res.status(200).json({
    success: true,
    msg: "Successfully logged out!"
  })
}*/

// @desc      Get profile user
// @route     GET /api/v1/auth/profile
// @access    Private
exports.getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)

  res.status(200).json({
    success: true,
    data: user
  })
})

// @desc      Update profile
// @route     PUT /api/v1/auth/update
// @access    Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)
  const fieldsToUpdate = {
    firstName: req.body.firstName || user.firstName,
    lastName: req.body.lastName || user.lastName,
    email: req.body.email || user.email
  }

  const updatedUser = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    success: true,
    data: updatedUser
  })
})

// @desc      Update password
// @route     PUT /api/v1/auth/updatepassword
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)
  
  //Check current password
  if(!(await user.matchPassword(req.body.currentPassword))){
    return next(new ErrorResponse('Old password is incorrect', 400))
  }

  user.password = req.body.newPassword;
  await user.save()

  const token = user.generateJWTToken()

  res.status(200).json({
    success: true,
    data: user,
    token
  })
})

// @desc      Payment Balance
// @route     PUT /api/v1/auth/paymentBalance
// @access    Private
exports.paymentBalance = asyncHandler(async (req, res, next) => {

  //Payment API logikasi olib shotga joylashtiriladi
  //shunda hisobni to'ldirsa bo'ladi pasdi logikani billa qo'shib ishlatib
  
  const user = await User.findById(req.user._id)

  const updatedUser = await User.findByIdAndUpdate(req.user._id, 
    { balance: (user.balance + req.body.payment) },
    { new: true }  
  )

  res.status(200).json({
    success: true,
    data: updatedUser
  })
})
