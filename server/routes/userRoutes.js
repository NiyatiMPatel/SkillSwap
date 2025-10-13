import express from 'express';
import { updateProfile, getProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/profile').get(getProfile).put(updateProfile);

export default router;
