const { uuid } = require('uuidv4');
const HttpError = require('../models/http-error')
const Place = require('../models/place_model')
const User = require('../models/user_model')
const mongoose = require('mongoose')

const getPlaceByPid = async (req, res, next) => {
    const placeId = req.params.pid //Obtain the placeId from the request -> Encoded in the URL
    let place;
    try {
        place = await Place.findById(placeId)
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a place.', 500)
        return next(error)
    }

    if (!place) {
        // console.log("No place found")
        const error = new HttpError('Could not find a place for the provided id.', 404)
        return next(error)
    }

    res.json({ place: place.toObject({ getters: true }) })
    // console.log("GET Request to the homepage -> Places_routes");
}

const getPlaceByUid = async (req, res, next) => {
    const u_id = req.params.uid //Obtain the placeId from the request -> Encoded in the URL

    let places_user;
    try {
        places_user = Place.find({})
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a place.', 500)
        return next(error)
    }

    if (!places_user || places_user.length === 0) {
        // console.log("No place found")
        const error = new HttpError('Could not find a place for the provided id.', 404)
        // return next(error)
        return next(error)
    }

    res.json({ places_user: (await places_user).map(place => place.toObject({ getters: true })) })
}

const createPlace = async (req, res, next) => {
    const { title, description, tags, bannedKeyWords, creator } = req.body //Destructuring the body
    //We basically just assume that we are going to get the request in this format

    console.log(req.body)

    const createdPlace = new Place({
        title: title,
        description: description,
        img: 'https://preview.redd.it/ecrcigi63pha1.jpg?width=960&crop=smart&auto=webp&v=enabled&s=5793224f410d672647877bd64dc440f1282ac638',
        tags: tags,
        bannedKeyWords: bannedKeyWords,
        creator: creator,
        followers: creator,
        posts: []
    });

    let user;

    console.log(creator)

    try {
        user = await User.findById(creator)
    } catch (err) {
        const error = new HttpError('Creating place failed, please try again -> Early Stage', 500)
        return next(error)
    }

    if (!user) {
        const error = new HttpError('Could not find user for provided id', 404)
        return next(error)
    }

    console.log(user)

    try {
        const sess = await mongoose.startSession()
        sess.startTransaction()
        createdPlace.save({ session: sess })
        user.places.push(createdPlace)
        await user.save({ session: sess })
        await sess.commitTransaction()
    }
    catch (err) {
        const error = new HttpError('Creating place failed, please try again -> Here', 500)
        return next(error)
    }

    res.status(201).json(createdPlace)
}

const UpdatePlace = async (req, res, next) => {
    const place_id = req.params.pid //Pid is obtained by the request's params -> and obtain
    //The Pid from the params
    // if (req.body.userId){

    // }
    // else {
    console.log("Updating Place")
    const { title, description, tags, bannedKeyWords } = req.body //Destructuring the body
    let place
    try {
        place = await Place.findById(place_id)
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update place. (Wasn`t able to find it)', 500)
        return next(error)
    }

    //Now that we obtain the Place, we can update it
    place.title = title //Title is part of the request
    place.description = description //Description is part of the body
    place.tags = tags
    place.bannedKeyWords = bannedKeyWords
    // }
    //Now we update the stored place in the database
    try {
        await place.save()
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update place in the database.', 500)
        return next(error)
    }

    res.status(200).json({ place: place.toObject({ getters: true }) }) //Return the updated place
}

const DeletePlace = async (req, res, next) => {
    const placeId = req.params.pid

    let place;
    try {
        place = await Place.findById(placeId).populate('creator')
    }
    catch (err) {
        const error = new HttpError('Something went wrong, could not delete place.', 500)
        return next(error)
    }

    if (!place) {
        const error = new HttpError('Could not find place for this id.', 404)
        return next(error)
    }

    //Now that we obtain the Place, we can remove it
    try {
        // await place.remove()
        const sess = await mongoose.startSession()
        sess.startTransaction()
        await place.remove({ session: sess })
        place.creator.places.pull(place)
        await place.creator.save()
        await sess.commitTransaction()
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete place in the database.', 500)
        return next(error)
    }

    res.status(200).json({ message: "Place Deleted" })
}

exports.UpdatePlace = UpdatePlace //Export the UpdatePlace function
exports.getPlaceByPid = getPlaceByPid; //Basically you export a pointer to that function
exports.getPlaceByUid = getPlaceByUid //Basically you export a pointer to that function -> Express decides when to call it
exports.createPlace = createPlace
exports.DeletePlace = DeletePlace