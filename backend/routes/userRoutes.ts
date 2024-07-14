import express from 'express'
import { signupUser, signinUser, signoutUser, followUnfollowUser, updateUser, checkAvailability, getUserProfile, forgotPassword, resetPassword } from '../controllers/userController'
import protectRoute from '../middlewares/protectRoute'
import { upload } from '../utils/uploadToS3';

const router = express.Router()

router.post('/signup', signupUser)
router.post('/signin', signinUser)
router.post('/signout', signoutUser)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)
router.get('/profile/:userName', getUserProfile)
router.get('/check-availability', checkAvailability)
router.post('/follow/:id', protectRoute, followUnfollowUser)
router.put('/update', protectRoute, upload.single('profilePic'), updateUser)

export default router