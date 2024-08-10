const {Schema, model} = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new Schema({
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	email: {type: String, required: true, unique: true, match: [
      /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
      'Plese enter valid email address'
    ]},
	password: {type: String, required: true, minLength: 6},
	balance: {type: Number, default: 0}
}, { timestamps: true })

//hashing password with bcrypt
UserSchema.pre('save', async function(next) {
	if(!this.isModified('password')){
	  next()
	}
	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
})


//Generate jwt token
UserSchema.methods.generateJWTToken = function() {
	return jwt.sign({ id: this._id, email: this.email }, process.env.JWT_SECRET, {
	  expiresIn: process.env.JWT_EXPIRE
	})
}

//Check user entered password with hashed password
UserSchema.methods.matchPassword = async function(enteredPassword){
	return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = model('User', UserSchema)
