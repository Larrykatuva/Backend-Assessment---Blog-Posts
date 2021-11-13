import express from 'express';
import {PostController} from '../controllers/postController'
const router = express.Router();


router.get('/ping', PostController.ping);
router.get('/posts', PostController.getPosts);

export default router;