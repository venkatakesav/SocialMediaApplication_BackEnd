const { uuid } = require('uuidv4');
const HttpError = require('../models/http-error')
const Place = require('../models/place_model')
const User = require('../models/user_model')
const mongoose = require('mongoose')

let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        location: {
            lat: 40.7484474,
            lng: -73.9871516
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Empire State Building -> 2',
        description: 'One of the most famous sky scrapers in the world!',
        location: {
            lat: 40.7484474,
            lng: -73.9871516
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: 'u2'
    },
    {
        id: 'p3',
        title: 'Empire State Building -> 3',
        description: 'One of the most famous sky scrapers in the world!',
        location: {
            lat: 40.7484474,
            lng: -73.9871516
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: 'u1'
    }
]

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
        places_user = Place.find({ creator: u_id })
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
    const { title, description, coordinates, address, creator } = req.body //Destructuring the body
    //We basically just assume that we are going to get the request in this format

    const createdPlace = new Place({
        title: title,
        description: description,
        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/FullMoon2010.jpg/1200px-FullMoon2010.jpg',
        address: address,
        creator: creator
    });

    let user;

    console.log(creator)

    try {
        user = await User.findById(creator)
    } catch (err) {
        const error = new HttpError('Creating place failed, please try again -> Early Stage', 500)
        return next(error)
    }

    if(!user) {
        const error = new HttpError('Could not find user for provided id', 404)
        return next(error)
    }

    console.log(user)

    try {
        const sess = await mongoose.startSession()
        sess.startTransaction()
        createdPlace.save({ session: sess })
        user.places.push(createdPlace)
        await user.save({session: sess})
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
    const { title, description } = req.body //Destructuring the body
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
    DUMMY_PLACES = DUMMY_PLACES.filter(p => { p.id != placeId })

    let place;
    try {
        place = await Place.findById(placeId)
    }
    catch (err) {
        const error = new HttpError('Something went wrong, could not delete place.', 500)
        return next(error)
    }

    //Now that we obtain the Place, we can remove it
    try {
        await place.remove()
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