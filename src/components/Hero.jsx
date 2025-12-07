import { SplitText } from "gsap/all";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useMediaQuery } from "react-responsive";
import { useMusicStore } from "../stores/musicStore";
import MusicPermissionModal from "./MusicPermissionModal";

const Hero = () => {
  const videoRef = useRef();
  const audioRef = useRef(null);
  const { musicEnabled, showModal, handleAllowMusic, handleDenyMusic } =
    useMusicStore();

  const isMobile = useMediaQuery({ maxWidth: 767 });

  // Main GSAP animations - run once on mount
  useGSAP(() => {
    const heroSplit = new SplitText(".title", {
      type: "chars words",
    });
    const paragraphSplit = new SplitText(".subtitle", {
      type: "lines",
    });

    heroSplit.chars.forEach((char) => char.classList.add("text-gradient"));

    gsap.from(heroSplit.chars, {
      yPercent: 100,
      duration: 1.8,
      ease: "expo.out",
      stagger: 0.06,
    });

    gsap.from(paragraphSplit.lines, {
      opacity: 0,
      yPercent: 100,
      duration: 1.8,
      ease: "expo.out",
      stagger: 0.06,
      delay: 1,
    });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })
      .to(
        ".right-leaf",
        {
          y: 200,
        },
        0
      )
      .to("left-leaf", { y: -200 }, 0);

    const startValue = isMobile ? "top 50%" : "center 60%";
    const endValue = "max";

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "video",
        start: startValue,
        end: endValue,
        scrub: true,
        pin: true,
      },
    });

    videoRef.current.onloadedmetadata = () => {
      tl.to(videoRef.current, {
        currentTime: videoRef.current.duration,
      });
    };
  }, [isMobile]);

  // Audio scroll trigger setup - separate hook that runs when musicEnabled changes
  useGSAP(() => {
    if (!musicEnabled || !audioRef.current) {
      // Pause and reset audio if disabled
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      return;
    }

    const audio = audioRef.current;
    let heroScrollTrigger = null;
    let videoScrollTrigger = null;

    // Set initial volume
    audio.volume = 0.3;

    // Wait for audio to be ready
    const setupAudioTriggers = () => {
      if (!audioRef.current || !musicEnabled) return;

      // Kill existing triggers if any
      if (heroScrollTrigger) heroScrollTrigger.scrollTrigger?.kill();
      if (videoScrollTrigger) videoScrollTrigger.scrollTrigger?.kill();

      // Create scroll trigger for audio in hero section
      heroScrollTrigger = gsap.to(audio, {
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
          id: "audio-hero",
          onUpdate: (self) => {
            if (musicEnabled && audio.readyState >= 2) {
              // Calculate volume based on scroll progress
              const progress = self.progress;
              audio.volume = Math.max(0, Math.min(0.5, progress * 0.5));

              // Play/pause based on scroll position
              if (progress > 0.1 && audio.paused) {
                audio.play().catch((err) => {
                  console.warn("Audio play failed:", err);
                });
              } else if (progress <= 0.05 && !audio.paused) {
                audio.pause();
              }
            }
          },
        },
      });

      // Also sync with video scroll section (use hero as trigger since video is fixed)
      videoScrollTrigger = gsap.to(audio, {
        scrollTrigger: {
          trigger: "#hero",
          start: isMobile ? "top 50%" : "center 60%",
          end: "max",
          scrub: true,
          id: "audio-video",
          onUpdate: (self) => {
            if (musicEnabled && audio.readyState >= 2) {
              const progress = self.progress;
              // Maintain volume during video section
              audio.volume = 0.4;

              if (progress > 0 && audio.paused) {
                audio.play().catch((err) => {
                  console.warn("Audio play failed:", err);
                });
              }
            }
          },
        },
      });
    };

    // Check if audio is already loaded
    if (audio.readyState >= 2) {
      setupAudioTriggers();
    } else {
      // Wait for audio to load
      const onCanPlay = () => {
        if (musicEnabled && audioRef.current) {
          setupAudioTriggers();
        }
      };
      audio.addEventListener("canplay", onCanPlay, { once: true });
      audio.load();
    }

    // Cleanup function
    return () => {
      heroScrollTrigger?.scrollTrigger?.kill();
      videoScrollTrigger?.scrollTrigger?.kill();
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [musicEnabled, isMobile]);

  return (
    <>
      <MusicPermissionModal
        isOpen={showModal}
        onAllow={handleAllowMusic}
        onDeny={handleDenyMusic}
      />
      <audio
        ref={audioRef}
        src="/sounds/intro-beat.mp3"
        preload="none"
        loop
        crossOrigin="anonymous"
        style={{ display: "none" }}
      />
      <section id="hero">
        <div className="noisy" />
        <h1 className="title">FreeStyle</h1>
        <img
          src="/images/rubber-ducky.png"
          alt="left-leaf"
          className="left-leaf w-[100px] md:w-[200px] "
        />
        <img
          src="/images/friends.png"
          alt="right-leaf"
          className="right-leaf w-[200px] "
        />
        <div className="body">
          <div className="content">
            <div className="space-y-5 hidden md:block">
              <p>Responsive. Reliable. Refined.</p>
              <p className="subtitle">
                Senior <br /> Mern Stack
              </p>
            </div>
            <div className="view-experiences">
              <p className="subtitle">
                Emotion-driven development focuses on designing software that
                anticipates and responds to users feelings, creating experiences
                that feel intuitive, engaging, and human-centered. It
                prioritizes emotional impact alongside functionality to boost
                satisfaction and connection.
              </p>
              <a href="#experiences">View Experiences</a>
            </div>
          </div>
        </div>
      </section>
      <div className="video absolute inset-0">
        <video
          ref={videoRef}
          src="/videos/output.mp4"
          playsInline
          preload="auto"
        />
      </div>
    </>
  );
};

export default Hero;
