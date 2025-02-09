import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDatauri from "../utils/datauri.js";
import { Post } from "../models/post.model.js";

//  registration  ke liye hai ye function

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "Try different email",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// login ke liye hai ye function




export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res
        .status(400)
        .json({ message: "Incorrect password!", success: false });
    }

    // Token generation for authentication
    const token = await jwt.sign(
      { userId: user._id },
      process.env.SECRET_KEY1,
      { expiresIn: "30d" }
    );

    // Populate each post with user details
    const populatePosts = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post && post.author.equals(user._id)) {
          return post;
        }
        return null;
      })
    );

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatePosts.filter(Boolean), // Removes null values
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Login successful",
        success: true,
        token,
        user,
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const logout = async (_, res) => {
  try {
    return res.clearCookie("token").json({
      message: "Logged out",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Logout failed",
      success: false,
    });
  }
};



// user profile ke liye hai ye function

export const getprofile = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if userId is a valid MongoDB ObjectId

    let user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({ user, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// user profile update ke liye hai ye function
export const updateprofile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;

    let cloudResponse;

    if (profilePicture) {
      const fileUri = getDatauri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;
    await user.save();
    return res.status(200).json({ message: "Profile updated", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const followorunfollow = async (req, res) => {
  try {
    const follwkarnevala = req.id;
    const jiskofollowkiya = req.params.userId;

    if (follwkarnevala === jiskofollowkiya) {
      return res
        .status(400)
        .json({ message: "You cannot follow yourself", success: false });
    }
    const user = await User.findById(follwkarnevala);
    const targetUser = await User.findById(jiskofollowkiya);
    if (!user || !targetUser) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    // follow karna hai ya unfollow karna
    // check karna hai ki user kya follow kar raha hai ya nahi

    const isFollowing = user.following.includes(jiskofollowkiya);
    // if user is following the target user then unfollow karna hai

    if (isFollowing) {
      await Promise.all([
        User.findByIdAndUpdate(follwkarnevala, {
          $pull: { following: jiskofollowkiya },
        }),
        User.findByIdAndUpdate(jiskofollowkiya, {
          $pull: { followers: follwkarnevala },
        }),
      ]);
      return res.status(200).json({
        message: "Unfollowed",
        success: true,
      });
    } else {
      await Promise.all([
        User.findByIdAndUpdate(follwkarnevala, {
          $push: { following: jiskofollowkiya },
        }),
        User.findByIdAndUpdate(jiskofollowkiya, {
          $push: { followers: follwkarnevala },
        }),
      ]);
      return res.status(200).json({
        message: "followed",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
