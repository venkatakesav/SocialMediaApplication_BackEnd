const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 6},
    image: {type: String, required: true},
    age: {type: String, required: true},
    contact: {type: String, required: true},
    places: [{type: mongoose.Types.ObjectId, required: true, ref: "Place"}], //An Array of Places Owned
    places_following: [{type: mongoose.Types.ObjectId, required: true, ref: "Place"}], //An Array of Places Followed
    followers: [{type: mongoose.Types.ObjectId, required: true, ref: "User"}], //An Array of Users Following
    following: [{type: mongoose.Types.ObjectId, required: true, ref: "User"}] //An Array of Users Followed
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema)