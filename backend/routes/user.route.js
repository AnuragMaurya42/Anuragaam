import express from 'express';
import { login, logout, register } from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';
import { followorunfollow, getprofile, updateprofile } from '../controllers/user.controller.js';

const router = express.Router();

router.route('/register').post(register) ;
router.route('/login').post(login); 
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthenticated, getprofile);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePicture'), updateprofile);
router.route('/followorunfollow/:id').post(isAuthenticated, followorunfollow);

export default router;
