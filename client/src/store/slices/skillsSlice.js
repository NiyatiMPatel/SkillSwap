import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-hot-toast';

/**
 * Skills Slice - Manages skill board state
 * - Fetch all skills with filtering
 * - Create, update, delete skills
 * - Search and category filtering
 */

const initialState = {
  skills: [],
  mySkills: [],
  selectedSkill: null,
  filters: {
    category: 'all',
    skillType: 'all',
    search: '',
  },
  loading: false,
  error: null,
};

/**
 * Async Thunks
 */

// Fetch All Skills
export const fetchSkills = createAsyncThunk(
  'skills/fetchSkills',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.category && filters.category !== 'all') {
        params.append('category', filters.category);
      }
      if (filters.skillType && filters.skillType !== 'all') {
        params.append('skillType', filters.skillType);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      const response = await axiosClient.get(`/skills?${params.toString()}`);
      return response.data.skills;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch skills');
    }
  }
);

// Fetch Single Skill
export const fetchSkillById = createAsyncThunk(
  'skills/fetchSkillById',
  async (skillId, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/skills/${skillId}`);
      return response.data.skill;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch skill');
    }
  }
);

// Create Skill
export const createSkill = createAsyncThunk(
  'skills/createSkill',
  async (skillData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/skills', skillData);
      toast.success('Skill created successfully!');
      return response.data.skill;
    } catch (error) {
      toast.error(error.message || 'Failed to create skill');
      return rejectWithValue(error.message || 'Failed to create skill');
    }
  }
);

// Update Skill
export const updateSkill = createAsyncThunk(
  'skills/updateSkill',
  async ({ skillId, skillData }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put(`/skills/${skillId}`, skillData);
      toast.success('Skill updated successfully!');
      return response.data.skill;
    } catch (error) {
      toast.error(error.message || 'Failed to update skill');
      return rejectWithValue(error.message || 'Failed to update skill');
    }
  }
);

// Delete Skill
export const deleteSkill = createAsyncThunk(
  'skills/deleteSkill',
  async (skillId, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/skills/${skillId}`);
      toast.success('Skill deleted successfully!');
      return skillId;
    } catch (error) {
      toast.error(error.message || 'Failed to delete skill');
      return rejectWithValue(error.message || 'Failed to delete skill');
    }
  }
);

// Fetch My Skills
export const fetchMySkills = createAsyncThunk(
  'skills/fetchMySkills',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/skills/user/my-skills');
      return response.data.skills;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch your skills');
    }
  }
);

/**
 * Skills Slice
 */
const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: 'all',
        skillType: 'all',
        search: '',
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedSkill: (state) => {
      state.selectedSkill = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Skills
    builder
      .addCase(fetchSkills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.loading = false;
        state.skills = action.payload;
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Skill By ID
    builder
      .addCase(fetchSkillById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSkillById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSkill = action.payload;
      })
      .addCase(fetchSkillById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Skill
    builder
      .addCase(createSkill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSkill.fulfilled, (state, action) => {
        state.loading = false;
        state.skills.unshift(action.payload);
        state.mySkills.unshift(action.payload);
      })
      .addCase(createSkill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Skill
    builder
      .addCase(updateSkill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSkill.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.skills.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.skills[index] = action.payload;
        }
        const myIndex = state.mySkills.findIndex(s => s._id === action.payload._id);
        if (myIndex !== -1) {
          state.mySkills[myIndex] = action.payload;
        }
      })
      .addCase(updateSkill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Skill
    builder
      .addCase(deleteSkill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSkill.fulfilled, (state, action) => {
        state.loading = false;
        state.skills = state.skills.filter(s => s._id !== action.payload);
        state.mySkills = state.mySkills.filter(s => s._id !== action.payload);
      })
      .addCase(deleteSkill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch My Skills
    builder
      .addCase(fetchMySkills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMySkills.fulfilled, (state, action) => {
        state.loading = false;
        state.mySkills = action.payload;
      })
      .addCase(fetchMySkills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearError, clearSelectedSkill } = skillsSlice.actions;
export default skillsSlice.reducer;
