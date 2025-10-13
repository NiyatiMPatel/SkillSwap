import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../store/slices/authSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import { UserCircle, Plus, X } from 'lucide-react';

/**
 * Create Profile Page
 * - Form to complete user profile after signup
 * - Add skills to teach and learn
 * - Redirects to Skill Board on completion
 */
const CreateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    skillsToTeach: user?.skillsToTeach || [],
    skillsToLearn: user?.skillsToLearn || [],
  });

  const [newTeachSkill, setNewTeachSkill] = useState('');
  const [newLearnSkill, setNewLearnSkill] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    // If profile is already complete, redirect
    if (user?.isProfileComplete) {
      navigate('/board');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError('');
  };

  const addTeachSkill = () => {
    if (newTeachSkill.trim()) {
      setFormData({
        ...formData,
        skillsToTeach: [...formData.skillsToTeach, newTeachSkill.trim()],
      });
      setNewTeachSkill('');
    }
  };

  const removeTeachSkill = (index) => {
    setFormData({
      ...formData,
      skillsToTeach: formData.skillsToTeach.filter((_, i) => i !== index),
    });
  };

  const addLearnSkill = () => {
    if (newLearnSkill.trim()) {
      setFormData({
        ...formData,
        skillsToLearn: [...formData.skillsToLearn, newLearnSkill.trim()],
      });
      setNewLearnSkill('');
    }
  };

  const removeLearnSkill = (index) => {
    setFormData({
      ...formData,
      skillsToLearn: formData.skillsToLearn.filter((_, i) => i !== index),
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setValidationError('Please enter your name');
      return false;
    }

    if (formData.skillsToTeach.length === 0 && formData.skillsToLearn.length === 0) {
      setValidationError('Please add at least one skill to teach or learn');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await dispatch(updateProfile(formData));
    
    if (updateProfile.fulfilled.match(result)) {
      navigate('/board');
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Saving your profile..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 page-transition">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Complete Your Profile</h2>
          <p className="mt-2 text-gray-600">
            Tell us about yourself and what skills you want to exchange
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          {/* Error message */}
          {validationError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{validationError}</p>
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="John Doe"
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows="4"
              value={formData.bio}
              onChange={handleChange}
              className="input-field resize-none"
              placeholder="Tell us about yourself, your interests, and what you're passionate about..."
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.bio.length}/500 characters
            </p>
          </div>

          {/* Skills to Teach */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills I Can Teach
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTeachSkill}
                onChange={(e) => setNewTeachSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTeachSkill())}
                className="input-field"
                placeholder="e.g., React.js, Guitar, Photography"
              />
              <button
                type="button"
                onClick={addTeachSkill}
                className="btn-primary flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skillsToTeach.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeTeachSkill(index)}
                    className="hover:text-green-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Skills to Learn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills I Want to Learn
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newLearnSkill}
                onChange={(e) => setNewLearnSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLearnSkill())}
                className="input-field"
                placeholder="e.g., Python, Cooking, Spanish"
              />
              <button
                type="button"
                onClick={addLearnSkill}
                className="btn-primary flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skillsToLearn.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeLearnSkill(index)}
                    className="hover:text-blue-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit button */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/board')}
              className="btn-ghost flex-1"
            >
              Skip for Now
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'Saving...' : 'Complete Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;
