import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';
import { supabase } from '../../lib/supabaseClient';
import { signIn, signUp, getCurrentUser } from './authSlice';

/**
 * Skills Slice - Manages skill board state
 * - Fetch all skills with filtering
 * - Create, update, delete skills
 * - Search and category filtering
 */

// Helper function to load saved skills from localStorage (fallback/cache)
const loadSavedSkills = () => {
  try {
    const saved = localStorage.getItem('savedSkills');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading saved skills:', error);
    return [];
  }
};

// Helper function to sync with localStorage
const syncToLocalStorage = (savedSkills) => {
  try {
    localStorage.setItem('savedSkills', JSON.stringify(savedSkills));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const initialState = {
  skills: [],
  mySkills: [],
  skillsOverview: [], // Overview of all skills with teacher/learner info
  skills: ['all'], // Dynamic skills from user profiles
  selectedSkill: null,
  savedSkills: loadSavedSkills(), // Load from localStorage on init
  searchQuery: '', // Search query for smart search
  filters: {
    category: 'all',
    skillType: 'all',
    search: '',
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  loading: false,
  categoriesLoading: false,
  overviewLoading: false,
  error: null,
};

/**
 * Async Thunks
 */

// Map a skills row from Supabase to the shape used in UI
const mapSkillRow = (row) => {
  if (!row) return null;
  return {
    _id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    skillType: row.skill_type,
    createdBy: row.created_by,
    userName: row.creator_name,
    userEmail: row.creator_email,
    createdAt: row.created_at,
  };
};

// Fetch All Skills
export const fetchSkills = createAsyncThunk(
  'skills/fetchSkills',
  async (filters = {}, { rejectWithValue }) => {
    try {
      let query = supabase.from('skills').select('*').order('created_at', { ascending: false });

      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      if (filters.skillType && filters.skillType !== 'all') {
        query = query.eq('skill_type', filters.skillType);
      }
      if (filters.search) {
        query = query.textSearch('search_vector', filters.search);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return (data || []).map(mapSkillRow);
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
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('id', skillId)
        .single();

      if (error) {
        throw error;
      }

      return mapSkillRow(data);
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
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        return rejectWithValue(authError?.message || 'Not authenticated');
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('name, email')
        .eq('id', authUser.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      const { title, description, category, skillType } = skillData;

      const { data, error } = await supabase
        .from('skills')
        .insert([
          {
            title,
            description,
            category: category || 'General',
            skill_type: skillType,
            created_by: authUser.id,
            creator_name: profile.name,
            creator_email: profile.email,
          },
        ])
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      toast.success('Skill created successfully!');
      return mapSkillRow(data);
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
      const { data, error } = await supabase
        .from('skills')
        .update({
          title: skillData.title,
          description: skillData.description,
          category: skillData.category,
        })
        .eq('id', skillId)
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      toast.success('Skill updated successfully!');
      return mapSkillRow(data);
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
      const { error } = await supabase.from('skills').delete().eq('id', skillId);

      if (error) {
        throw error;
      }

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
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        return rejectWithValue(authError?.message || 'Not authenticated');
      }

      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('created_by', authUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return (data || []).map(mapSkillRow);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch your skills');
    }
  }
);

// Fetch Skill Categories
export const fetchCategories = createAsyncThunk(
  'skills/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.rpc('get_skill_categories');

      if (error) {
        throw error;
      }

      // data is an array of rows with { category }
      return (data || []).map((row) => row.category);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch skills');
    }
  }
);

// Fetch Skills Overview
export const fetchSkillsOverview = createAsyncThunk(
  'skills/fetchSkillsOverview',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.rpc('get_skills_overview', {
        page,
        page_size: limit,
      });

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        return {
          skills: [],
          pagination: {
            currentPage: page,
            totalPages: 1,
            pageSize: limit,
            totalItems: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        };
      }

      const example = data[0];
      const pagination = {
        currentPage: example.current_page,
        totalPages: example.total_pages,
        pageSize: example.page_size_out,
        totalItems: example.total_items,
        hasNextPage: example.has_next_page,
        hasPrevPage: example.has_prev_page,
      };

      const skills = data.map((row) => ({
        name: row.name,
        teachers: row.teachers || [],
        learners: row.learners || [],
        teachersCount: row.teachers_count,
        learnersCount: row.learners_count,
      }));

      return { skills, pagination };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch skills overview');
    }
  }
);

// Fetch Saved Skills from Backend
export const fetchSavedSkills = createAsyncThunk(
  'skills/fetchSavedSkills',
  async (_, { rejectWithValue }) => {
    try {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        return rejectWithValue(authError?.message || 'Not authenticated');
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('saved_skills')
        .eq('id', authUser.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      return profile.saved_skills || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch saved skills');
    }
  }
);

// Toggle Saved Skill (Backend + localStorage sync)
export const toggleSavedSkillAsync = createAsyncThunk(
  'skills/toggleSavedSkillAsync',
  async (skillName, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.rpc('toggle_saved_skill', {
        skill_name: skillName,
      });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to save skill');
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
    // New reducers for enhanced features
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    // Local-only toggle (for offline/fallback)
    toggleSaveSkill: (state, action) => {
      const skillName = action.payload;
      const index = state.savedSkills.indexOf(skillName);
      if (index > -1) {
        state.savedSkills.splice(index, 1);
      } else {
        state.savedSkills.push(skillName);
      }
      syncToLocalStorage(state.savedSkills);
    },
    // Placeholder for future session request feature
    requestSession: (state, action) => {
      // TODO: Implement session request logic in Phase 2
      toast.info('Session request feature coming soon!');
    },
    // Placeholder for future connect feature
    connectWithUser: (state, action) => {
      // TODO: Implement connect/messaging logic in Phase 2
      toast.info('Messaging feature coming soon!');
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

    // Fetch Categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.skills = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.error = action.payload;
      });

    // Fetch Skills Overview
    builder
      .addCase(fetchSkillsOverview.pending, (state) => {
        state.overviewLoading = true;
      })
      .addCase(fetchSkillsOverview.fulfilled, (state, action) => {
        state.overviewLoading = false;
        state.skillsOverview = action.payload.skills;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchSkillsOverview.rejected, (state, action) => {
        state.overviewLoading = false;
        state.error = action.payload;
      });

    // Fetch Saved Skills
    builder
      .addCase(fetchSavedSkills.fulfilled, (state, action) => {
        state.savedSkills = action.payload;
        syncToLocalStorage(action.payload);
      })
      .addCase(fetchSavedSkills.rejected, (state, action) => {
        console.error('Failed to fetch saved skills:', action.payload);
      });

    // Toggle Saved Skill (Async)
    builder
      .addCase(toggleSavedSkillAsync.fulfilled, (state, action) => {
        state.savedSkills = action.payload;
        syncToLocalStorage(action.payload);
        const wasRemoved = state.savedSkills.length < action.payload.length;
        toast.success(wasRemoved ? 'Skill removed from saved' : 'Skill saved!');
      })
      .addCase(toggleSavedSkillAsync.rejected, (state, action) => {
        toast.error('Failed to save skill. Please try again.');
        console.error('Toggle saved skill error:', action.payload);
      });

    // Listen to Auth Actions - Update savedSkills when user logs in/loads
    builder
      .addCase(signIn.fulfilled, (state, action) => {
        if (action.payload.user?.savedSkills) {
          state.savedSkills = action.payload.user.savedSkills;
          syncToLocalStorage(action.payload.user.savedSkills);
        }
      })
      .addCase(signUp.fulfilled, (state, action) => {
        if (action.payload.user?.savedSkills) {
          state.savedSkills = action.payload.user.savedSkills;
          syncToLocalStorage(action.payload.user.savedSkills);
        }
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        if (action.payload?.savedSkills) {
          state.savedSkills = action.payload.savedSkills;
          syncToLocalStorage(action.payload.savedSkills);
        }
      });
  },
});

export const {
  setFilters,
  clearFilters,
  clearError,
  clearSelectedSkill,
  setSearchQuery,
  setCurrentPage,
  toggleSaveSkill,
  requestSession,
  connectWithUser,
} = skillsSlice.actions;
export default skillsSlice.reducer;
