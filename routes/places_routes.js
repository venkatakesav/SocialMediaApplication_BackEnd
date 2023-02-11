const express = require('express');

const placesController = require('../controllers/places-controllers')

const router = express.Router(); //Here this is just a way to export our router

router.get('/:pid', placesController.getPlaceByPid)
router.get('/users/:uid', placesController.getPlaceByUid)
router.post('/', placesController.createPlace)
router.patch('/:pid', placesController.UpdatePlace)
router.delete('/:pid', placesController.DeletePlace)
//When you try to enter this -> There is no way to access because all browser requests are GET requests
//Use API's -> Postman

module.exports = router; //Here we export our router