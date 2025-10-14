import express from 'express';
import {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
  getMySkills,
  getSkillCategories,
  getSkillsOverview,
} from '../controllers/skillController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllSkills);
router.get('/categories', getSkillCategories);
router.get('/overview', getSkillsOverview);
router.get('/:id', getSkillById);

// Protected routes
router.post('/', protect, createSkill);
router.put('/:id', protect, updateSkill);
router.delete('/:id', protect, deleteSkill);
router.get('/user/my-skills', protect, getMySkills);

export default router;
