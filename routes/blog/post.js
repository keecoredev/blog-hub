const router = require('express').Router();
const PostController = require('../../controllers/PostController');

router.post('/create', PostController.createPostController);
router.get('/myposts', PostController.getMyPostsController);
router.post('/:postID', PostController.likePostController);
router.get('/', PostController.getPostsController);

module.exports = router;