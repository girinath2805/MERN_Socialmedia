import express from 'express'
import { createPost, deletePost, getFeedPosts, getPost, likeUnlikePost, replyToPost, getUserPosts } from '../controllers/postController'
import protectRoute from '../middlewares/protectRoute'
import { upload } from '../utils/uploadToS3'


const router = express.Router()

router.get('/feed', protectRoute, getFeedPosts)
router.get('/:id', getPost)
router.get('/user/:username', getUserPosts);
router.post('/create',protectRoute, upload.single('post'), createPost)
router.put('/like/:id', protectRoute, likeUnlikePost)
router.put('/reply/:id', protectRoute, replyToPost)
router.delete('/:id', protectRoute, deletePost)

export default router