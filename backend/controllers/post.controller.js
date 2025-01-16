import sharp from "sharp";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import comment from "../models/comment.model.js";

export const addPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;

    const authorId = req.id;
    if (!image) {
      return res.status(400).json({
        message: "Image is required",
        success: false,
      });
    }

    // we have to optimise the image before uploading it to cloudinary

    const optimizeimage = await sharp(image.buffer)
      .resize({ width: 500, height: 500 })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizeimage.toString(
      "base64"
    )}`;

    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = new Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populat({ path: "author", select: "-password" });
    return res.status(201).json({
      message: "Post created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//write code to get all posts

export const getallpost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username , profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture" },
      });

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUserPost = async (req, res) => {
  try {
    const autherId = req.id;
    const postsofuser = await Post.find({ author: autherId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture" },
      });

    return res.status(200).json({
      postsofuser,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// write a code to like or unlike the any  post

export const likePost = async (req, res) => {
  try {
    // get the post id from the request

    const likesPersonId = req.params.id;
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    // like logic started

    await post.updateOne({ $addToSet: { likes: likesPersonId } });
    await post.save();

    return res.status(200).json({
      message: "Post liked successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// write a code to unlike the post

export const dislikePost = async (req, res) => {
  try {
    // get the post id from the request

    const dislikesPersonId = req.params.id;
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    // dislike logic started

    await post.updateOne({ $pull: { likes: dislikesPersonId } });
    await post.save();

    return res.status(200).json({
      message: "Post disliked successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const addComment = async (req, res) => {
  try {
    const commentkarnewalaId = req.params.id;
    const postId = req.params.postId;
    const { commentHua } = req.body;

    const post = await Post.findById(postId);

    if (!commentHua) {
      return res.status(400).json({
        message: "Text is required",
        success: false,
      });
    }

    const comment = await Comment.create({
      text: commentHua,
      post: postId,
      user: commentkarnewalaId,
    }).populate({ path: "author", select: "username profilePicture" });

    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      message: "Comment added successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// get comments of a post

export const getCommentsOfPost = async (req,res) => {
    try {
        const postId = req.params.id;

        const comments = await Comment.find({post:postId}).populate('author', 'username profilePicture');

        if(!comments) return res.status(404).json({message:'No comments found for this post', success:false});

        return res.status(200).json({success:true,comments});

    } catch (error) {
        console.log(error);
    }
};

export const deletePost = async(req , res)=>{

try {

  const postId = req.params.id;
  const autherId = req.id;

  const post = await  Post.findById(postId);

   if(!post) return res.status(404).json({message:'Post not found', success:false});


// check karemge ki login user hi apna post delete kar raha hai ya nahi

if(post.author.toString() !== autherId){
  return res.status(401).json({
    message:'You are not authorized to delete this post', 
    success:false});
}


await Post.findByIdAndDelete(postId);

// remove the post id from the user post array

 
// await User.findByIdAndUpdate(autherId, {$pull:{posts:postId}});

const user = await User.findById(autherId);
user.posts = user.posts.filter((post)=> post.toString() !== postId);

// comments delete karna hai jo is post ke hai

await Comment.deleteMany({
  post:postId
});

return res.status(200).json({message:'Post deleted successfully', success:true});


  
} catch (error) {
  console.log(error);
}

}

// bookmark the post ke liye code likhna hai 

export const bookmarkPost = async(req,res) => {

try {
  const postId = req.params.id;
  const userId = req.id;

  const post = await Post.findById(postId);

if(!post){
  return res.status(404).json({
    message:'Post not found',
    success:false
  })
}
const user = await User.findById(userId);

if(post.bookmarks.includes(post._id)){
  // bookmaek hai ab usko nikalo bookmarks se
  await user.updateOne({$pull:{bookmarks:postId}});
  await user.save();
  
  return res.status(200).json({ type:'unsaved', message:'Post removed from bookmarks', success:true});

}
else{
  // bookmark nahi hai ab usko bookmarks me daalo
  await user.updateOne({$addToSet:{bookmarks:postId}});
  await user.save();
  return res.status(200).json({ type:'saved', message:'Post add in bookmarks', success:true});

}
 

  
} catch (error) {
  console.log(error);
   
}

}
