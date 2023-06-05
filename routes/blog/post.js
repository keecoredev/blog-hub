const router = require('express').Router();
const PostController = require('../../controllers/PostController');

router.get('/', PostController.getPostsController);
router.post('/:postID', PostController.likePostController);
router.post('/create', PostController.createPostController);
router.get('/myposts', PostController.getMyPostsController);

module.exports = router;