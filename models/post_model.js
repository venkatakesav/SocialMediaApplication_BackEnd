const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema

const postSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    postedBy: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    Upvotes: [{ type: mongoose.Types.ObjectId, required: true, ref: 'User' }],
    Downvotes: [{ type: mongoose.Types.ObjectId, required: true, ref: 'User' }],
    postedIn: { type: mongoose.Types.ObjectId, required: true, ref: 'Place' }
})

module.exports = mongoose.model('Post', postSchema)