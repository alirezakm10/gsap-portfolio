import { create } from "zustand";
import { persist } from "zustand/middleware";

const MUSIC_MODAL_SHOWN_KEY = "portfolio_music_modal_shown";

/**
 * Helper to check if modal should be shown
 */
const shouldShowModal = () => {
  if (typeof window === "undefined") return false;
  const modalShown = sessionStorage.getItem(MUSIC_MODAL_SHOWN_KEY);
  return modalShown !== "true";
};

/**
 * Music Store
 * 
 * Manages music state and preferences using Zustand with persist middleware.
 * - musicEnabled: Persisted to localStorage
 * - showModal: Uses sessionStorage to show on every hard refresh
 */
export const useMusicStore = create(
  persist(
    (set) => ({
      musicEnabled: false,
      showModal: shouldShowModal(),

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
        if (typeof window !== "undefined") {
          sessionStorage.setItem(MUSIC_MODAL_SHOWN_KEY, "true");
        }
        set({ musicEnabled: true, showModal: false });
      },

      /**
       * Handle modal deny action
       */
      handleDenyMusic: () => {
        if (typeof window !== "undefined") {
          sessionStorage.setItem(MUSIC_MODAL_SHOWN_KEY, "true");
        }
        set({ musicEnabled: false, showModal: false });
      },
    }),
    {
      name: "portfolio-music-preference", // localStorage key
      partialize: (state) => ({ musicEnabled: state.musicEnabled }), // Only persist musicEnabled
    }
  )
);

// Initialize showModal on store creation (for SSR safety)
if (typeof window !== "undefined") {
  const initialState = useMusicStore.getState();
  if (initialState.showModal !== shouldShowModal()) {
    useMusicStore.setState({ showModal: shouldShowModal() });
  }
}

