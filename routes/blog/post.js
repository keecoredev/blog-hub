const router = require('express').Router();
const PostController = require('../../controllers/PostController');

router.get('/', PostController.getPostsController);
router.patch('/:postId/like', PostController.likePostController);
router.patch('/:postId/dislike', PostController.dislikePostController);

module.exports = router;