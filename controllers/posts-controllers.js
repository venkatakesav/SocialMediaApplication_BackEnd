const { uuid } = require('uuidv4');
const HttpError = require('../models/http-error')
const Place = require('../models/place_model')
const User = require('../models/user_model')
const Post = require('../models/post_model')
const mongoose = require('mongoose')

const getPost = async (req, res, next) => {
    const userId = req.params.uid //Obtain the userId from the request -> Encoded in the URL
    const PlaceId = req.params.pid //Obtain the userId from the request -> Encoded in the URL

    let posts;
    try {
        posts = await Post.find()
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a post.', 500)
        return next(error)
    }

    if (!posts) {
        // console.log("No place found")
        const error = new HttpError('Could not find any post.', 404)
        return next(error)
    }

    res.json({ posts: (await posts).map(post => post.toObject({ getters: true })) })
    // console.log("GET Request to the homepage -> Places_routes");
}


const createPost = async (req, res, next) => {
    const u_id = req.params.uid //Obtain the User Id from the request -> Encoded in the URL
    const p_id = req.params.pid //Obtain the Place Id from the request -> Encoded in the URL

    const { title, description } = req.body //Destructuring the body
    /*We Have to obain Posted in, Upvotes, Downvotes seperately*/

    const createdPost = new Post({
        title: title,
        description: description,
        postedBy: u_id,
        postedIn: p_id
    })

    try {
        user = await User.findById(u_id)
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a user.', 500)
    }

    try {
        place = await Place.findById(p_id)
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a place.', 500)
    }

    try {
        const sess = await mongoose.startSession()
        sess.startTransaction()
        await createdPost.save({ session: sess })
        place.posts.push(createdPost)
        await place.save({ session: sess })
        await sess.commitTransaction()
    } catch (err) {
        new HttpError('Something went wrong, could not create a post.', 500)
    }

    res.status(201).json({ post: createdPost })
}

exports.createPost = createPost
exports.getPost = getPost