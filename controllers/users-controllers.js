const { uuid } = require('uuidv4');
const { validationResult } = require('express-validator')
const {map} = require('lodash')
const HttpError = require('../models/http-error')
const User = require('../models/user_model')

let DUMMY_USERS = [
    {
        id: "u1",
        name: "Kesav",
        email: "Kesavistheboss@gmail.com",
        password: "kesav"
    },
    {
        id: "u2",
        name: "Kesav_Clone",
        email: "Kesavistheboss@gmail1.com",
        password: "kesavC"
    }
]

const getUsers = async (req, res, next) => {
    let users
    try { users = await User.find({}, "-password") }
    catch (err) {   
        const error = new HttpError('Fetching users failed, please try again later.', 500)
        return next(error)
    }
    // console.log(users)
    res.json({users: users.map(user => user.toObject({getters: true}))})
}

const signup = async (req, res, next) => {
    let error = validationResult(req)
    if (!error.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        )
    }

    const { name, email, password} = req.body; //Destructuring the request

    const existingUser = await User.findOne({ email: email })
    if (existingUser == 0) {
        console.log(existingUser)
        const error = new HttpError('User exists already, please login instead.', 422)
        return next(error)
    }

    const createdUser = new User({
        name,
        email,
        image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80",
        password,
        places: []
    });

    try {
        await createdUser.save()
    } catch (err) {
        error = new HttpError('Signing up failed, please try again later. Here', 500)
        return next(error)
    }

    res.status(201).json({
        user: createdUser.toObject({ getters: true })
    })
}

const login = async (req, res, next) => {
    //Destructure the request -> Email and password
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email: email })
    if (!existingUser) {
        const error = new HttpError('User does not exist, please signup instead.', 422)
        return next(error)
    }

    console.log(password)
    console.log(existingUser.password)

    if (existingUser.password !== password) {
        const error = new HttpError('Invalid credentials, could not log you in.', 401)
        return next(error)
    }

    res.json({ message: "Logged in!" })
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;