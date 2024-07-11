import express from 'express'
import { createPost, deletePost, getFeedPosts, getPost, likeUnlikePost, replyToPost } from '../controllers/postController'
import protectRoute from '../middlewares/protectRoute'


const router = express.Router()


router.get('/:id', getPost)
router.get('/feed', protectRoute, getFeedPosts)
router.post('/create',protectRoute, createPost)
router.post('/like/:id', protectRoute, likeUnlikePost)
router.post('/reply/:id', protectRoute, replyToPost)
router.delete('/:id', protectRoute, deletePost)

export default router