//Implementing the express framework
const express = require('express');
const HttpError = require('./models/http-error')
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false)  //To avoid the deprecation warning

const placesRoutes = require("./routes/places_routes.js"); //You can use this as a middleware
const usersRoutes = require("./routes/user_routes.js"); //You can use this as a middleware

const app = express()

//Middleware

//To be able to parse the body of requests
app.use(bodyParser.json()) //This is a middleware

//To make sure that we only reach the placesRoutes if the request is for /api/places
app.use('/api/places', placesRoutes) //And at the same time -> No need to add /api/places to the routes in places_routes.js
// app.use('/api/users', usersRoutes) //And at the same time -> No need to add /api/places to the routes in places_routes.js

app.use('/api/users', usersRoutes)

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404)
    next(error)
})

//Another Middle Ware for the Basic Error Handling
app.use((error, req, res, next) => {
    if(res.headerSent){
        // console.log("Reached")
        return next(error)
    }
    console.log(error.code)
    res.status(error.code || 500)
    res.json({message: error.message || 'An unknown error occurred!'})
}) //No Filter, so applicable for all

//If you want to use the async await syntax, you can use the following:
mongoose.
connect("mongodb+srv://DASS_Project1:3lJbtT4uSIHlB2Uh@cluster0.an8skqe.mongodb.net/places?retryWrites=true&w=majority").then(() => app.listen(3000, () => console.log('Server started on port 3000')))
.catch((e) => console.log(e)) 


// app.listen(5000, () => console.log('Server started on port 5000'));
