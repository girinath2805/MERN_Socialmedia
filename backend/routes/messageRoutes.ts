import express from 'express'
import protectRoute from '../middlewares/protectRoute'
import { getConversations, getMessages, sendMessage } from '../controllers/messageController'
import { upload } from '../utils/uploadToS3'

const router = express.Router()

router.get('/conversations', protectRoute, getConversations)
router.post('/', protectRoute, upload.single('img'), sendMessage);
router.get('/:otheruserid', protectRoute, getMessages);

export default router