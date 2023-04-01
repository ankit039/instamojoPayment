const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

/**
 * Create Schema
 * Create a new instance of User model and set the values of the properties(fields)
 */
const UserSchema = new Schema( {
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
        required: true,
        unique: true
	},
	phone: {
		type: String,
        required: true,
        unique: true
	},
	admin: {
		type: String,
        default: false
	},
	date: {
		type: Date,
		default: Date.now
	}
} );

module.exports = User = mongoose.model( 'users', UserSchema );