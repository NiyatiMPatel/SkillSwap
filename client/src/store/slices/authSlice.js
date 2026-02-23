import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';
import { supabase } from '../../lib/supabaseClient';

// Helper to sync saved skills to skillsSlice
const syncSavedSkills = (user) => {
  if (user?.savedSkills) {
    try {
      localStorage.setItem('savedSkills', JSON.stringify(user.savedSkills));
    } catch (error) {
      console.error('Error syncing saved skills:', error);
    }
  }
};

/**
 * Auth Slice - Manages authentication state
 * - Sign up, sign in, sign out
 * - User profile data
 * - Token persistence to localStorage
 */

// Load initial user from localStorage (Supabase manages session separately)
const loadAuthFromStorage = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return { user };
  } catch (error) {
    return { user: null };
  }
};

const initialState = {
  user: loadAuthFromStorage().user,
  token: null,
  isAuthenticated: !!loadAuthFromStorage().user,
  loading: false,
  error: null,
};

/**
 * Async Thunks
 */

// Helper to shape profile row into the user object used across the app
const mapProfileToUser = (profile) => {
  if (!profile) return null;
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    mobile: profile.mobile,
    bio: profile.bio,
    skillsToTeach: profile.skills_to_teach || [],
    skillsToLearn: profile.skills_to_learn || [],
    savedSkills: profile.saved_skills || [],
    isProfileComplete: profile.is_profile_complete,
  };
};

// Sign Up with Supabase Auth
export const signUp = createAsyncThunk(
  'auth/signUp',
  async (userData, { rejectWithValue }) => {
    try {
      const { email, password, name, mobile } = userData;

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            mobile,
          },
        },
      });

      if (signUpError) {
        const message = signUpError.message || 'Sign up failed';
        // Special-case existing user to allow redirect to login
        if (signUpError.message === 'User already registered') {
          toast.error('User already exists with this email. Please sign in.');
          return rejectWithValue('User already exists with this email. Please sign in.');
        }
        toast.error(message);
        return rejectWithValue(message);
      }

      // Fetch profile created by trigger
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        return rejectWithValue(authError?.message || 'Unable to fetch signed up user');
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError) {
        return rejectWithValue(profileError.message || 'Failed to load profile after sign up');
      }

      const user = mapProfileToUser(profile);

      // Persist to localStorage
      localStorage.setItem('user', JSON.stringify(user));
      syncSavedSkills(user);

      toast.success('Account created successfully!');
      return { user };
    } catch (error) {
      const message = error.message || 'Sign up failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Sign In with Supabase Auth
export const signIn = createAsyncThunk(
  'auth/signIn',
  async (credentials, { rejectWithValue }) => {
    try {
      const { email, password } = credentials;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const message = error.message || 'Sign in failed';
        toast.error(message);
        return rejectWithValue(message);
      }

      const authUser = data.user;

      if (!authUser) {
        const message = 'Sign in failed';
        toast.error(message);
        return rejectWithValue(message);
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError) {
        const message = profileError.message || 'Failed to load profile';
        toast.error(message);
        return rejectWithValue(message);
      }

      const user = mapProfileToUser(profile);

      // Persist to localStorage
      localStorage.setItem('user', JSON.stringify(user));
      syncSavedSkills(user);

      toast.success('Signed in successfully!');
      return { user };
    } catch (error) {
      const message = error.message || 'Sign in failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Get Current User
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
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
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError) {
        return rejectWithValue(profileError.message || 'Failed to fetch profile');
      }

      const user = mapProfileToUser(profile);

      // Update user in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      syncSavedSkills(user);

      return user;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user');
    }
  }
);

// Update Profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        return rejectWithValue(authError?.message || 'Not authenticated');
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          bio: profileData.bio,
          skills_to_teach: profileData.skillsToTeach || [],
          skills_to_learn: profileData.skillsToLearn || [],
          is_profile_complete: true,
        })
        .eq('id', authUser.id);

      if (updateError) {
        throw updateError;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      const user = mapProfileToUser(profile);

      // Update user in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      syncSavedSkills(user);

      toast.success('Profile updated successfully!');
      return user;
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

/**
 * Auth Slice
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;

      localStorage.clear()
      toast.success('Signed out successfully');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Sign Up
    builder
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = null;
        state.user = action.payload.user;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Sign In
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = null;
        state.user = action.payload.user;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Current User
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { signOut, clearError } = authSlice.actions;
export default authSlice.reducer;
