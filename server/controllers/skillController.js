import Skill from '../models/Skill.js';

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
