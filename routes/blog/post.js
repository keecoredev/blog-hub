const router = require('express').Router();
const PostController = require('../../controllers/PostController');

router.get('/', PostController.getPostsController);

module.exports = router;