import express from 'express'
import { createPost } from '../controllers/postController'
import protectRoute from '../middlewares/protectRoute'


const router = express.Router()

router.post('/create',protectRoute, createPost)

export default router