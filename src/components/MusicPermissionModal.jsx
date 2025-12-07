import React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * MusicPermissionModal Component
 * 
 * Displays a modal asking user permission to play background music.
 * Uses localStorage to remember user preference.
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {Function} onAllow - Callback when user allows music
 * @param {Function} onDeny - Callback when user denies music
 */
const MusicPermissionModal = ({ isOpen, onAllow, onDeny }) => {
  const modalRef = React.useRef(null);
  const overlayRef = React.useRef(null);
  const contentRef = React.useRef(null);

  useGSAP(
    () => {
      if (!isOpen) return;

      const modal = modalRef.current;
      const overlay = overlayRef.current;
      const content = contentRef.current;

      if (!modal || !overlay || !content) return;

      // Set initial state
      gsap.set([overlay, content], {
        opacity: 0,
      });
      gsap.set(content, {
        scale: 0.8,
        y: 20,
      });

      // Animate in
      const tl = gsap.timeline();
      tl.to(overlay, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      })
        .to(
          content,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.4,
            ease: "back.out(1.2)",
          },
          "-=0.2"
        );
    },
    { scope: modalRef, dependencies: [isOpen] }
  );

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[9999] flex-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="music-permission-title"
    >
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-none"
        onClick={onDeny}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        ref={contentRef}
        className="relative z-10 bg-black/20 backdrop-blur-sm border border-white/20 rounded-lg p-8 max-w-md mx-4 shadow-2xl"
      >
        <h2
          id="music-permission-title"
          className="text-2xl font-bold mb-4 text-white"
        >
          Background Music
        </h2>
        <p className="text-white/80 mb-6 leading-relaxed">
          Would you like to enable background music that plays as you scroll
          through the portfolio? You can change this preference later.
        </p>

        <div className="flex gap-4 justify-end">
          <button
            onClick={onDeny}
            className="px-6 py-2 border border-white/30 rounded hover:bg-white/10 transition-colors text-white"
            aria-label="Decline background music"
          >
            No Thanks
          </button>
          <button
            onClick={onAllow}
            className="px-6 py-2 bg-white text-black rounded hover:bg-white/90 transition-colors font-medium"
            aria-label="Allow background music"
          >
            Enable Music
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPermissionModal;

