const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const placeSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    img: {type: String, required: true},
    tags: {type: String, required: true},
    bannedKeyWords : {type: String, required: true},
    creator: {type: mongoose.Types.ObjectId, required: true, ref: "User"},
    followers: [{type: mongoose.Types.ObjectId, required: true, ref: "User"}],
    requests: [{type: mongoose.Types.ObjectId, required: true, ref: "User"}],
    creation_date: {type: Date, required: true, default: Date.now},
    rejected: [{type: mongoose.Types.ObjectId, required: true, ref: "User"}],
    posts: [{type: mongoose.Types.ObjectId, required: true, ref: "Post"}]
});

module.exports = mongoose.model('Place', placeSchema)