import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Music Store
 * 
 * Manages music state and preferences using Zustand with persist middleware.
 * - musicEnabled: Persisted to localStorage
 * - showModal: Shows on every page load (no storage, always ask)
 */
export const useMusicStore = create(
  persist(
    (set) => ({
      musicEnabled: false,
      showModal: true, // Always show modal on mount (no localStorage/sessionStorage)

      /**
       * Toggle music on/off
       * @param {boolean} enabled - Whether music should be enabled
       */
      toggleMusic: (enabled) => {
        set({ musicEnabled: enabled });
      },

      /**
       * Handle modal allow action
       */
      handleAllowMusic: () => {
        set({ musicEnabled: true, showModal: false });
      },

      /**
       * Handle modal deny action
       */
      handleDenyMusic: () => {
        set({ musicEnabled: false, showModal: false });
      },
    }),
    {
      name: "portfolio-music-preference", // localStorage key
      partialize: (state) => ({ musicEnabled: state.musicEnabled }), // Only persist musicEnabled, not showModal
    }
  )
);

