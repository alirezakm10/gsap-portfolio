import { useGSAP } from "@gsap/react";
import { navLinks } from "../../constants";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMusicStore } from "../stores/musicStore";

const Navbar = () => {
  const { musicEnabled, toggleMusic } = useMusicStore();

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(
      "nav",
      {
        backgroundColor: "rgba(0, 0, 0, 0)",
        backdropFilter: "blur(0px)",
      },
      {
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(10px)",
        duration: 0.5,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: "body",
          start: "100px top",
          end: "200px top",
          scrub: true,
        },
      }
    );
  });

  const handleMusicToggle = () => {
    toggleMusic(!musicEnabled);
  };

  return (
    <nav>
      <div>
        <a href="#home" className="flex items-center gap-2">
          <img src="/images/logo.png" alt="logo" />
          <p>Alireza Karbalaei</p>
        </a>

        <ul>
          {navLinks.map((link) => (
            <li key={link.id}>
              <a href={`#${link.id}`}>{link.title}</a>
            </li>
          ))}
        </ul>

        <button
          onClick={handleMusicToggle}
          className="music-toggle-btn"
          aria-label={musicEnabled ? "Disable music" : "Enable music"}
          title={musicEnabled ? "Disable background music" : "Enable background music"}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={musicEnabled ? "music-icon-active" : "music-icon-inactive"}
          >
            {musicEnabled ? (
              // Music On Icon
              <>
                <path
                  d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
                  fill="currentColor"
                />
                <circle cx="10" cy="17" r="2" fill="currentColor" />
              </>
            ) : (
              // Music Off Icon
              <>
                <path
                  d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
                  fill="currentColor"
                  opacity="0.4"
                />
                <line
                  x1="2"
                  y1="2"
                  x2="22"
                  y2="22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </>
            )}
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
