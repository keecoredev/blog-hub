const Post = require('../models/Post');

const getPostsController = async (req,res) => {
    try{
        const posts = await Post.find().skip(req.query.skip).limit(5);

        if (req.user){

            let manipulatedPosts = [];
            posts.forEach((post) => {
                if (!post.likedBy.includes(req.user.user._id)){
                    post.isLikable = true;
                }
                if (!post.dislikedBy.includes(req.user.user._id)){
                    post.isDisLikable = true;
                }

                manipulatedPosts.push(post);
            });

            return res.status(200).json(manipulatedPosts);
        }
        else {
            return res.status(200).json(posts);
        }
    } catch(err){
        res.status(400).json({message:err.message});
    }
}

const likePostController = async (req, res) => {
    try{
        const post = await Post.findById(req.params.postId);
        let previousLikes = post.likes;

        if (req.user){

            if(!post.likedBy.includes(req.user.user._id)){
                post.likes += 1;
                post.likedBy.push(req.user.user._id);

                if(post.dislikedBy.includes(req.user.user._id)){
                    const updatedDislikedBy = post.dislikedBy.filter((userId) => {
                        return userId != req.user.user._id;
                    })
                    post.dislikedBy = updatedDislikedBy;
                }

                post.save();
            }
            res.status(200).json({message:`Previous likes : ${previousLikes} ### Updated Likes: ${post.likes}`});
        }
        else {
            return res.status(403).json('You must log in');
        }
    } catch(err){
        res.status(400).json({message:err.message});
    }
}

const dislikePostController = async (req, res) => {
    try{
        const post = await Post.findById(req.params.postId);
        let previousLikes = post.likes;

        if (req.user){

            if (!post.dislikedBy.includes(req.user.user._id)){
                post.likes -= 1;
                post.dislikedBy.push(req.user.user._id);

                if(post.likedBy.includes(req.user.user._id)){
                    const updatedLikedBy = post.likedBy.filter((userId) => {
                        return userId != req.user.user._id;
                    })
                    post.likedBy = updatedLikedBy;
                }

                post.save();
            }
            res.status(200).json({message:`Previous likes : ${previousLikes} ### Updated Likes: ${post.likes}`});
        }
        else {
            return res.status(403).json('You must log in');
        }
    } catch(err){
        res.status(400).json({message:err.message});
    }
}

module.exports = { getPostsController, likePostController, dislikePostController };