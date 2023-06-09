const Post = require('../models/Post');
const PostLike = require('../models/PostLike');
const PostDTO = require('../DTO/PostDTO.js');

const getPostsController = async (req,res) => {
    try{
        const posts = await Post.find().populate('owner').skip(req.query.skip).limit(5);
        let postIds = [];
        posts.forEach((post) => {
            postIds.push(post._id);
        });

        let manipulatedPosts = new Set();
        let storedPostIds = new Set();

        if (req.user){

            const likedPostsByUser = await PostLike.find({'post': { $in: postIds }, 'owner': req.user.user._id})
                .distinct('post');

            if (likedPostsByUser.length > 0){
                posts.map((post) => {
                    likedPostsByUser.forEach((id) => {
                        if (post._id.toString() == id){
                            post.liked = true;
                            manipulatedPosts.add(new PostDTO(post));
                            storedPostIds.add(post.id);
                        }
                    })
                });

                posts.map((post) => {
                    likedPostsByUser.forEach((id) => {
                        if (post._id.toString() != id && !storedPostIds.has(post.id)){
                            manipulatedPosts.add(new PostDTO(post));
                            storedPostIds.add(post.id);
                        }
                    })
                });

                return res.status(200).json(Array.from(manipulatedPosts));
            }

            else {

                posts.map((post) => {
                    manipulatedPosts.add(new PostDTO(post));
                });

                return res.status(200).json(Array.from(manipulatedPosts));
            }

        }
        else {

            posts.map((post) => {
                manipulatedPosts.add(new PostDTO(post));
            });

            return res.status(200).json(Array.from(manipulatedPosts));
        }

    } catch(err){
        res.status(400).json({message:err.message});
    }
}

const likePostController = async (req, res) => {
    try{

        if (req.user){
            const post = await Post.findById(req.params.postID).populate('owner');
            const postLikeDb = await PostLike.find({'post': req.params.postID, 'owner': req.user.user._id});

            if (req.query.liked == 'true' && postLikeDb.length < 1){

                const newPostLike = await new PostLike({
                    post: req.params.postID,
                    owner: req.user.user._id
                });

                newPostLike.save();

                post.likes_count += 1;
                await post.save();

                post.liked = true;

                return res.status(201).json(new PostDTO(post));
            }

            if (postLikeDb.length >= 1 && req.query.liked == 'false'){
                const deletedDoc = await PostLike.deleteOne({ id: postLikeDb.id});

                post.likes_count -= 1;
                await post.save();

                post.liked = false;

                return res.status(200).json(new PostDTO(post));
            }

            if (req.query.liked == 'false' && postLikeDb.length < 1){

                return res.status(400).json({message:'Bad Request'});
            }

            if (postLikeDb.length >= 1 && req.query.liked == 'true'){
                return res.status(400).json({message:'You can like only once!'});
            }

        }
        else {
            return res.status(403).json('You must log in');
        }
    } catch(err){
        res.status(400).json({message:err.message});
    }
}

const createPostController = async (req, res) => {
    try{

        if (req.user){
            const newPost = await new Post({
                owner: req.user.user._id,
                title: req.body.title,
                description: req.body.description,
                content: req.body.content
            });

            await newPost.save();

            return res.status(200).json({message: 'Post has been created successfully', newPost: newPost});
        }
        else {
            return res.status(403).json({message: 'You are not logged in, therefore you cant send a post'});
        }

    } catch(err){
        res.status(500).json({message:err.message});
    }
}

const getMyPostsController = async (req, res) => {
    try{
        if (req.user){
            let myPosts;
            if (req.query.skip) {
                myPosts = await Post.find({owner: req.user.user._id}).populate('owner').skip(req.query.skip).limit(5);
            } else {
                myPosts = await Post.find({owner: req.user.user._id}).populate('owner');
            }

            let transformedObject = [];
            myPosts.forEach((post) => {
                transformedObject.push(new PostDTO(post));
            })
            res.status(200).json(transformedObject);
        } else {
            return res.status(403).json({message: 'You are not allowed to do this'});
        }

    } catch(err){
        return res.status(200).json({message:err.message});
    }
}

module.exports = { getPostsController, likePostController, createPostController, getMyPostsController };