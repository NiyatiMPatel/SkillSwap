import User from '../models/User.js';

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, skillsToTeach, skillsToLearn } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    // Update fields
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (skillsToTeach) user.skillsToTeach = skillsToTeach;
    if (skillsToLearn) user.skillsToLearn = skillsToLearn;

    // Mark profile as complete if key fields are filled
    if (name && (skillsToTeach?.length > 0 || skillsToLearn?.length > 0)) {
      user.isProfileComplete = true;
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        bio: user.bio,
        skillsToTeach: user.skillsToTeach,
        skillsToLearn: user.skillsToLearn,
        isProfileComplete: user.isProfileComplete,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      message: error.message || 'Error updating profile',
    });
  }
};

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        bio: user.bio,
        skillsToTeach: user.skillsToTeach,
        skillsToLearn: user.skillsToLearn,
        savedSkills: user.savedSkills,
        isProfileComplete: user.isProfileComplete,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      message: error.message || 'Error fetching profile',
    });
  }
};

/**
 * @route   POST /api/users/saved-skills
 * @desc    Toggle save skill (add or remove)
 * @access  Private
 */
export const toggleSavedSkill = async (req, res) => {
  try {
    const { skillName } = req.body;

    if (!skillName) {
      return res.status(400).json({
        message: 'Skill name is required',
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    // Check if skill is already saved
    const index = user.savedSkills.indexOf(skillName);

    if (index > -1) {
      // Remove skill
      user.savedSkills.splice(index, 1);
    } else {
      // Add skill
      user.savedSkills.push(skillName);
    }

    await user.save();

    res.status(200).json({
      message: index > -1 ? 'Skill removed from saved' : 'Skill saved successfully',
      savedSkills: user.savedSkills,
    });
  } catch (error) {
    console.error('Toggle saved skill error:', error);
    res.status(500).json({
      message: error.message || 'Error toggling saved skill',
    });
  }
};

/**
 * @route   GET /api/users/saved-skills
 * @desc    Get user's saved skills
 * @access  Private
 */
export const getSavedSkills = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('savedSkills');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.status(200).json({
      savedSkills: user.savedSkills,
    });
  } catch (error) {
    console.error('Get saved skills error:', error);
    res.status(500).json({
      message: error.message || 'Error fetching saved skills',
    });
  }
};
