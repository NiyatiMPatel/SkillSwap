import { createSlice } from '@reduxjs/toolkit';

/**
 * UI Slice - Manages UI state
 * - Sidebar open/closed
 * - Modal states
 * - Loading overlays
 * - Theme (for future dark mode support)
 */

const initialState = {
  isSidebarOpen: true,
  isModalOpen: false,
  modalContent: null,
  theme: 'light', // Future: support dark mode
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    openSidebar: (state) => {
      state.isSidebarOpen = true;
    },
    closeSidebar: (state) => {
      state.isSidebarOpen = false;
    },
    openModal: (state, action) => {
      state.isModalOpen = true;
      state.modalContent = action.payload;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.modalContent = null;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  openSidebar,
  closeSidebar,
  openModal,
  closeModal,
  setTheme,
} = uiSlice.actions;

export default uiSlice.reducer;
