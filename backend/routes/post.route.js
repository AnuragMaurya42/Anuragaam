import express from 'express';

import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';
import { addComment, addPost, bookmarkPost, deletePost, dislikePost, getallpost, getCommentsOfPost, getUserPost, likePost } from '../controllers/post.controller.js';

const router = express.Router();


router.route('/addpost').post(isAuthenticated, upload.single('image'), addPost);
router.route('/all').get(isAuthenticated, getallpost);
router.route('/userpost/all').get(isAuthenticated, getUserPost);
router.route('/:id/like').get(isAuthenticated, likePost);
router.route('/:id/dislike').get(isAuthenticated, dislikePost);
router.route('/:id/comment').get(isAuthenticated, addComment );
router.route('/:id/comment/all').get(isAuthenticated, getCommentsOfPost );
router.route('/delete/:id').get(isAuthenticated, deletePost );
router.route('/:id/bookmark').get(isAuthenticated, bookmarkPost );




export default router;