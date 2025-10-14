import Skill from '../models/Skill.js';
import User from '../models/User.js';

/**
 * @route   GET /api/skills
 * @desc    Get all skills with optional filtering
 * @access  Public
 */
export const getAllSkills = async (req, res) => {
  try {
    const { category, skillType, search } = req.query;

    // Build query
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (skillType && skillType !== 'all') {
      query.skillType = skillType;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const skills = await Skill.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: skills.length,
      skills,
    });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({
      message: error.message || 'Error fetching skills',
    });
  }
};

/**
 * @route   GET /api/skills/:id
 * @desc    Get single skill by ID
 * @access  Public
 */
export const getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id).populate(
      'createdBy',
      'name email bio'
    );

    if (!skill) {
      return res.status(404).json({
        message: 'Skill not found',
      });
    }

    res.status(200).json({
      skill,
    });
  } catch (error) {
    console.error('Get skill error:', error);
    res.status(500).json({
      message: error.message || 'Error fetching skill',
    });
  }
};

/**
 * @route   POST /api/skills
 * @desc    Create a new skill
 * @access  Private
 */
export const createSkill = async (req, res) => {
  try {
    const { title, description, category, skillType } = req.body;

    if (!title || !description || !skillType) {
      return res.status(400).json({
        message: 'Please provide title, description, and skill type',
      });
    }

    const skill = await Skill.create({
      title,
      description,
      category: category || 'General',
      skillType,
      createdBy: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
    });

    res.status(201).json({
      message: 'Skill created successfully',
      skill,
    });
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({
      message: error.message || 'Error creating skill',
    });
  }
};

/**
 * @route   PUT /api/skills/:id
 * @desc    Update a skill
 * @access  Private
 */
export const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        message: 'Skill not found',
      });
    }

    // Check if user owns the skill
    if (skill.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized to update this skill',
      });
    }

    const { title, description, category } = req.body;

    if (title) skill.title = title;
    if (description) skill.description = description;
    if (category) skill.category = category;

    await skill.save();

    res.status(200).json({
      message: 'Skill updated successfully',
      skill,
    });
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({
      message: error.message || 'Error updating skill',
    });
  }
};

/**
 * @route   DELETE /api/skills/:id
 * @desc    Delete a skill
 * @access  Private
 */
export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        message: 'Skill not found',
      });
    }

    // Check if user owns the skill
    if (skill.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized to delete this skill',
      });
    }

    await skill.deleteOne();

    res.status(200).json({
      message: 'Skill deleted successfully',
    });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({
      message: error.message || 'Error deleting skill',
    });
  }
};

/**
 * @route   GET /api/skills/user/my-skills
 * @desc    Get current user's skills
 * @access  Private
 */
export const getMySkills = async (req, res) => {
  try {
    const skills = await Skill.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      count: skills.length,
      skills,
    });
  } catch (error) {
    console.error('Get my skills error:', error);
    res.status(500).json({
      message: error.message || 'Error fetching skills',
    });
  }
};

/**
 * @route   GET /api/skills/categories
 * @desc    Get all unique skill categories from user profiles
 * @access  Public
 */
export const getSkillCategories = async (req, res) => {
  try {
    // Get all users with their skills
    const users = await User.find(
      {
        $or: [
          { skillsToTeach: { $exists: true, $ne: [] } },
          { skillsToLearn: { $exists: true, $ne: [] } }
        ]
      },
      { skillsToTeach: 1, skillsToLearn: 1 }
    );

    // Combine all skills into one array and get unique values
    const allSkills = new Set();
    
    users.forEach(user => {
      if (user.skillsToTeach) {
        user.skillsToTeach.forEach(skill => allSkills.add(skill));
      }
      if (user.skillsToLearn) {
        user.skillsToLearn.forEach(skill => allSkills.add(skill));
      }
    });

    // Convert Set to sorted array
    const categories = ['all', ...Array.from(allSkills).sort()];

    res.status(200).json({
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      message: error.message || 'Error fetching categories',
    });
  }
};

/**
 * @route   GET /api/skills/overview
 * @desc    Get detailed overview of all skills with teacher/learner counts
 * @access  Public
 */
export const getSkillsOverview = async (req, res) => {
  try {
    // Get all users with their skills and names
    const users = await User.find(
      {
        $or: [
          { skillsToTeach: { $exists: true, $ne: [] } },
          { skillsToLearn: { $exists: true, $ne: [] } }
        ]
      },
      { name: 1, email: 1, skillsToTeach: 1, skillsToLearn: 1 }
    );

    // Build skill overview map
    const skillsMap = new Map();

    users.forEach(user => {
      // Process skills to teach
      if (user.skillsToTeach) {
        user.skillsToTeach.forEach(skill => {
          if (!skillsMap.has(skill)) {
            skillsMap.set(skill, {
              name: skill,
              teachers: [],
              learners: [],
              teachersCount: 0,
              learnersCount: 0,
            });
          }
          const skillData = skillsMap.get(skill);
          skillData.teachers.push({
            id: user._id,
            name: user.name,
            email: user.email,
          });
          skillData.teachersCount++;
        });
      }

      // Process skills to learn
      if (user.skillsToLearn) {
        user.skillsToLearn.forEach(skill => {
          if (!skillsMap.has(skill)) {
            skillsMap.set(skill, {
              name: skill,
              teachers: [],
              learners: [],
              teachersCount: 0,
              learnersCount: 0,
            });
          }
          const skillData = skillsMap.get(skill);
          skillData.learners.push({
            id: user._id,
            name: user.name,
            email: user.email,
          });
          skillData.learnersCount++;
        });
      }
    });

    // Convert map to array and sort by total interest (teachers + learners)
    const skillsOverview = Array.from(skillsMap.values())
      .sort((a, b) => {
        const totalA = a.teachersCount + a.learnersCount;
        const totalB = b.teachersCount + b.learnersCount;
        return totalB - totalA; // Descending order
      });

    res.status(200).json({
      count: skillsOverview.length,
      skills: skillsOverview,
    });
  } catch (error) {
    console.error('Get skills overview error:', error);
    res.status(500).json({
      message: error.message || 'Error fetching skills overview',
    });
  }
};
