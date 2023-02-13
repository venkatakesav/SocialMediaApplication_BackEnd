const express = require('express');

const postController = require('../controllers/posts-controllers');
const router = express.Router(); //Export the Router

router.get('/:uid/:pid', postController.getPost)
router.post('/:uid/:pid', postController.createPost)

module.exports = router;