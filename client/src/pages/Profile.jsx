import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../store/slices/authSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import { User, Plus, X } from 'lucide-react';

const Profile = () => {
  const dispatch = useDispatch();
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
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        skillsToTeach: user.skillsToTeach || [],
        skillsToLearn: user.skillsToLearn || [],
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError('');
    setSuccessMessage('');
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
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await dispatch(updateProfile(formData));
    
    if (updateProfile.fulfilled.match(result)) {
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Updating profile..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 page-transition">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Edit Profile</h2>
          <p className="mt-2 text-gray-600">Update your profile information</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          {validationError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{validationError}</p>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-600">{successMessage}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <input
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              name="bio"
              rows="4"
              value={formData.bio}
              onChange={handleChange}
              className="input-field resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skills I Can Teach</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTeachSkill}
                onChange={(e) => setNewTeachSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTeachSkill())}
                className="input-field"
                placeholder="Add a skill..."
              />
              <button type="button" onClick={addTeachSkill} className="btn-primary">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skillsToTeach.map((skill, index) => (
                <span key={index} className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  {skill}
                  <button type="button" onClick={() => removeTeachSkill(index)}>
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skills I Want to Learn</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newLearnSkill}
                onChange={(e) => setNewLearnSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLearnSkill())}
                className="input-field"
                placeholder="Add a skill..."
              />
              <button type="button" onClick={addLearnSkill} className="btn-primary">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skillsToLearn.map((skill, index) => (
                <span key={index} className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {skill}
                  <button type="button" onClick={() => removeLearnSkill(index)}>
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
