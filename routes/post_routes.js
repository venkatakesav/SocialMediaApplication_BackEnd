const express = require('express');

const postController = require('../controllers/posts-controllers');
const router = express.Router(); //Export the Router

// router.get('/:post_id', postController.getPosts)
router.post('/:uid/:pid', postController.createPost)

module.exports = router;