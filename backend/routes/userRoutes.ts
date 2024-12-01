import express from 'express'
import { signupUser, signinUser, signoutUser, followUnfollowUser, updateUser, checkAvailability, getUserProfile, forgotPassword, resetPassword, getSuggestedUsers, freezeAccount } from '../controllers/userController'
import protectRoute from '../middlewares/protectRoute'
import { upload } from '../utils/uploadToS3';

const router = express.Router()

router.post('/signup', signupUser)
router.post('/signin', signinUser)
router.post('/signout', signoutUser)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)
router.get('/profile/:query', getUserProfile)
router.get('/check-availability', checkAvailability)
router.post('/follow/:id', protectRoute, followUnfollowUser)
router.get('/suggested', protectRoute, getSuggestedUsers)
router.put('/update', protectRoute, upload.single('profilePic'), updateUser)
router.put('/freeze', protectRoute, freezeAccount)

export default router