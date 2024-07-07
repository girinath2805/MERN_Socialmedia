import express from 'express'
import { signupUser, signinUser, signoutUser, followUnfollowUser, updateUser, checkAvailability, getUserProfile } from '../controllers/userController'
import protectRoute from '../middlewares/protectRoute'

const router = express.Router()

router.post('/signup', signupUser)
router.post('/signin', signinUser)
router.post('/signout', signoutUser)
router.get('/profile/:userName', getUserProfile)
router.get('/check-availability', checkAvailability)
router.post('/follow/:id', protectRoute, followUnfollowUser)
router.post('/update/:id', protectRoute, updateUser)

export default router