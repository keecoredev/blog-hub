const Post = require('../models/Post');

const getPostsController = async (req,res) => {
    try{
        res.status(200).json(await Post.find().skip(req.query.skip).limit(5));
    } catch(err){
        res.status(400).json({message:err.message});
    }

}

module.exports = { getPostsController };