const express = require('express');

const userController = require('../controllers/users-controllers');
const router = express.Router(); //Export the Router

router.get('/:uid', userController.getUsers)
router.post('/signup', userController.signup)
router.post('/login', userController.login)

module.exports = router;