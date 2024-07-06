import express from 'express'
import { signupUser, signinUser, signoutUser, followUnfollowUser } from '../controllers/userController'
import protectRoute from '../middlewares/protectRoute'

const router = express.Router()

router.post('/signup', signupUser)
router.post('/signin', signinUser)
router.post('/signout', signoutUser)
router.post('/follow/:id', protectRoute, followUnfollowUser)

export default router