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

// All routes are protected
router.use(protect);


router.get('/', getAllSkills);
router.get('/categories', getSkillCategories);
router.get('/overview', getSkillsOverview);
router.get('/:id', getSkillById);

router.post('/', createSkill);
router.put('/:id', updateSkill);
router.delete('/:id', deleteSkill);
router.get('/user/my-skills', getMySkills);

export default router;
