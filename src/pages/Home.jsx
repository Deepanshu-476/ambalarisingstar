import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../pages/components/header";
import Footer from "../pages/components/footer";
import popupVideo from "../assets/popupview.mp4";
import qrcodeImg from "../assets/qrcode.jpeg";

function Home() {
  const navigate = useNavigate();

  // 1. Hero slideshow - using ONLY local project stadium images
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const heroSlideIntervalRef = useRef(null);

  const heroImages = [
    {
      img: "/image/stadium4.jpeg",
      title: "Yamunanagar International Arena"
    },
    {
      img: "/image/stadium5.jpeg",
      title: "50,000 LUX Night Floodlights"
    },
    {
      img: "/image/stadium7.jpeg",
      title: "Championship Ground Turf"
    },
    {
      img: "/image/stadium3.jpeg",
      title: "Prime Day & Night Match Turf"
    },
    {
      img: "/image/stadium6.jpeg",
      title: "Full Stadium Ground Perspective"
    }
  ];

  // 2. Stadium carousel - using all 5 original stadium views
  const [currentStadiumIdx, setCurrentStadiumIdx] = useState(0);

  const stadiumViews = [
    {
      title: "View 01 • Main International Turf Wicket",
      tab: "Main Pitch",
      img: "/image/stadium7.jpeg"
    },
    {
      title: "View 02 • High-Lux Halogen Night Towers",
      tab: "Floodlights",
      img: "/image/stadium1.jpeg"
    },
    {
      title: "View 03 • Air-Conditioned Pavilion & Dugouts",
      tab: "Pavilion",
      img: "/image/stadium2.jpeg"
    },
    {
      title: "View 04 • High-Tech Practice Nets & Bowling Machine",
      tab: "Practice Nets",
      img: "/image/stadium8.jpeg"
    },
    {
      title: "View 05 • Sprawling 4-Acre Arena Ground View",
      tab: "Full Arena",
      img: "/image/stadium6.jpeg"
    }
  ];

  // 3. Match Gallery - 4 categories featuring ALL original project photos with auto-scrolling marquee
  const galleryCategories = [
    {
      category: "Batting Action",
      tag: "Action",
      tagBg: "rgba(245, 158, 11, 0.95)",
      title: "Match Action Shot",
      subtitle: "Exciting match moments & cover drives",
      images: [
        "/image/batting1.jpeg",
        "/image/batting2.jpeg",
        "/image/batting3.jpeg",
        "/image/batting4.jpeg",
        "/image/batting1.jpeg",
        "/image/batting2.jpeg",
        "/image/batting3.jpeg"
      ]
    },
    {
      category: "Team Celebration",
      tag: "Squad",
      tagBg: "rgba(52, 211, 153, 0.95)",
      title: "Team Celebration",
      subtitle: "Winning moments & squad camaraderie",
      images: [
        "/image/team1.jpeg",
        "/image/team2.jpeg",
        "/image/team3.jpeg",
        "/image/team4.jpeg",
        "/image/team5.jpeg",
        "/image/team1.jpeg",
        "/image/team2.jpeg"
      ]
    },
    {
      category: "Stadium Panorama",
      tag: "Arena",
      tagBg: "rgba(245, 158, 11, 0.95)",
      title: "Stadium Overview",
      subtitle: "Yamunanagar Ground full spectator view",
      images: [
        "/image/stadium4.jpeg",
        "/image/stadium2.jpeg",
        "/image/stadium3.jpeg",
        "/image/stadium1.jpeg",
        "/image/stadium7.jpeg",
        "/image/stadium4.jpeg",
        "/image/stadium5.jpeg"
      ]
    },
    {
      category: "Trophy Ceremony",
      tag: "Podium",
      tagBg: "rgba(52, 211, 153, 0.95)",
      title: "Award Ceremony",
      subtitle: "Trophy distribution & championship honors",
      images: [
        "/image/award1.jpeg",
        "/image/award2.jpeg",
        "/image/award3.jpeg",
        "/image/award4.jpeg",
        "/image/award5.jpeg",
        "/image/award6.jpeg",
        "/image/award1.jpeg"
      ]
    }
  ];

  // 4. Video Highlights - ALL 4 original videos from the project!
  const videoClips = [
    {
      videoSrc: "/videos/highlight1.mp4",
      poster: "/image/stadium3.jpeg",
      category: "SUPER OVER FINISH",
      title: "Final Over Thriller: CDS Stars vs Tigers",
      desc: "Watch the breathtaking final over where 18 runs were defended on the last delivery at Yamunanagar Ground.",
      duration: "08:42"
    },
    {
      videoSrc: "/videos/highlight2.mp4",
      poster: "/image/batting2.jpeg",
      category: "WICKETS COMPILATION",
      title: "Best Bowling Spells & Hat-Tricks",
      desc: "The fiercest fast-bowling spells including an express unplayable hat-trick delivered under 50,000-lux halogen floodlights.",
      duration: "11:15"
    },
    {
      videoSrc: "/videos/highlight3.mp4",
      poster: "/image/stadium6.jpeg",
      category: "ARENA EXPERIENCE",
      title: "Stadium Night Match Atmosphere",
      desc: "Step inside the dugouts, feel the tunnel walk-out adrenaline, and tour the ground under illuminated championship lights.",
      duration: "06:50"
    },
    {
      videoSrc: "/videos/highlight4.mp4",
      poster: "/image/award1.jpeg",
      category: "CHAMPIONSHIP FINALS",
      title: "Grand Finals & Trophy Presentation",
      desc: "Historic moments from the tournament finale, medal ceremony, Man of the Match awards, and winning team celebrations.",
      duration: "14:20"
    }
  ];

  // 5. Daily Match Time Slots - all 4 sessions from original
  const timeSlots = [
    {
      session: "SESSION 01",
      badge: "SLOTS OPEN",
      badgeColor: "#34d399",
      icon: "wb_twilight",
      title: "MORNING MATCH SESSION",
      time: "6:30 AM – 9:30 AM",
      desc: "Crisp morning air, fresh dew on the outfield, prime seam movement conditions with maximum seam bowler assistance and swing.",
      pitch: "Lively Grass / Seam Movement",
      format: "20 Overs / White Ball",
      btnText: "RESERVE MORNING SLOT",
      slotKey: "Morning Slot (6:30 AM - 9:30 AM)"
    },
    {
      session: "SESSION 02",
      badge: "POPULAR",
      badgeColor: "#f59e0b",
      icon: "wb_sunny",
      title: "DAY MATCH SESSION",
      time: "10:00 AM – 1:00 PM",
      desc: "Optimal hard turf pitch conditions with true bounce and lightning-fast outfield. Ideal for power hitters and spin specialists.",
      pitch: "Hard Turf / True Bounce",
      format: "20 Overs / White Ball",
      btnText: "RESERVE DAY SLOT",
      slotKey: "Day Slot (10:00 AM - 1:00 PM)"
    },
    {
      session: "SESSION 03",
      badge: "SLOTS OPEN",
      badgeColor: "#34d399",
      icon: "cloud_sun",
      title: "EVENING MATCH SESSION",
      time: "5:00 PM – 8:00 PM",
      desc: "Golden-hour match conditions transitioning under the initial stadium floodlights. Electrifying crowd energy, music, and super overs.",
      pitch: "Twilight / Early Floodlights",
      format: "20 Overs / White Ball",
      btnText: "RESERVE EVENING SLOT",
      slotKey: "Evening Slot (5:00 PM - 8:00 PM)"
    },
    {
      session: "SESSION 04",
      badge: "PRIME TIME",
      badgeColor: "#f59e0b",
      icon: "bedtime",
      title: "NIGHT MATCH SESSION",
      time: "8:30 PM – 11:30 PM",
      desc: "Championship stadium cricket under 50,000-lux high-mast floodlights. High voltage broadcast environment with live scoreboards.",
      pitch: "Floodlit Turf / Fast Outfield",
      format: "20 Overs / White Ball",
      btnText: "RESERVE NIGHT SLOT",
      slotKey: "Night Slot (8:30 PM - 11:30 PM)"
    }
  ];

  // Welcome Video Tutorial Popup State (loaded on first visit or via Watch Promo button)
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  useEffect(() => {
    const popupShown = sessionStorage.getItem("cds_welcome_popup_seen");
    if (!popupShown) {
      const timer = setTimeout(() => {
        setShowWelcomePopup(true);
        sessionStorage.setItem("cds_welcome_popup_seen", "true");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Modal States
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [modalHeading, setModalHeading] = useState("CDS PLAYER REGISTRATION");
  const [selectedSlot, setSelectedSlot] = useState("Morning Slot (6:30 AM - 9:30 AM)");
  const [regSuccess, setRegSuccess] = useState(false);

  // Video Lightbox Modal State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeVideoTitle, setActiveVideoTitle] = useState("MATCH HIGHLIGHTS PLAYER");
  const [activeVideoSrc, setActiveVideoSrc] = useState(popupVideo);

  // Image Lightbox State
  const [activeImagePreview, setActiveImagePreview] = useState(null);

  // Registration Form State
  const [playerName, setPlayerName] = useState("");
  const [playerPhone, setPlayerPhone] = useState("");
  const [playerAgeCategory, setPlayerAgeCategory] = useState("Age 19–25 (Senior Franchise)");
  const [playerRole, setPlayerRole] = useState("Top-Order Batsman");
  const [bankUtr, setBankUtr] = useState("");

  // Auto-play for Hero Slideshow
  useEffect(() => {
    heroSlideIntervalRef.current = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroImages.length);
    }, 5500);

    return () => {
      if (heroSlideIntervalRef.current) clearInterval(heroSlideIntervalRef.current);
    };
  }, [heroImages.length]);

  const goToSlide = (idx) => {
    setCurrentHeroSlide(idx);
    if (heroSlideIntervalRef.current) clearInterval(heroSlideIntervalRef.current);
    heroSlideIntervalRef.current = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroImages.length);
    }, 5500);
  };

  const nextHeroSlide = () => {
    goToSlide((currentHeroSlide + 1) % heroImages.length);
  };

  const prevHeroSlide = () => {
    goToSlide((currentHeroSlide - 1 + heroImages.length) % heroImages.length);
  };

  // Scroll Reveal Observer
  useEffect(() => {
    const revealEls = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealEls.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Listen for custom registration event from Header
  useEffect(() => {
    const handleOpenEvent = (e) => {
      openRegistrationModal(e.detail || "CDS Player Registration");
    };
    window.addEventListener("open-cds-registration", handleOpenEvent);
    return () => window.removeEventListener("open-cds-registration", handleOpenEvent);
  }, []);

  const openRegistrationModal = (title = "CDS Player Registration", slotPreference = null) => {
    setModalHeading(title.toUpperCase());
    if (slotPreference) {
      setSelectedSlot(slotPreference);
    }
    setRegSuccess(false);
    setIsRegModalOpen(true);
  };

  const closeRegistrationModal = () => {
    setIsRegModalOpen(false);
  };

  const playVideoModal = (title, src = popupVideo) => {
    setActiveVideoTitle(title.toUpperCase());
    setActiveVideoSrc(src);
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
  };

  const handleRegistrationSubmit = (e) => {
    e.preventDefault();
    setRegSuccess(true);
    setTimeout(() => {
      setIsRegModalOpen(false);
      setRegSuccess(false);
      setPlayerName("");
      setPlayerPhone("");
      setBankUtr("");
    }, 3500);
  };

  return (
    <div className="cds-landing-root">
      {/* Complete Hand-Crafted Pure Scoped CSS Stylesheet */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

        /* Root styling */
        .cds-landing-root {
          background-color: #001805;
          color: #ecfdf5;
          min-height: 100vh;
          font-family: 'Outfit', sans-serif;
          overflow-x: hidden;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .cds-landing-root * {
          box-sizing: border-box;
        }

        .cds-section-container {
          max-width: 1280px;
          margin-left: auto;
          margin-right: auto;
          padding-left: 24px;
          padding-right: 24px;
          box-sizing: border-box;
        }

        /* Stadium Bloom Background */
        .stadium-bloom {
          background: radial-gradient(circle at 50% -10%, rgba(245, 158, 11, 0.22) 0%, rgba(13, 56, 22, 0.5) 45%, rgba(0, 24, 5, 0.95) 80%);
        }

        /* Glass Panel Styling */
        .glass-panel {
          background: rgba(7, 47, 16, 0.45);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(163, 210, 162, 0.15);
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .glass-panel-gold {
          background: rgba(22, 38, 18, 0.65);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(245, 158, 11, 0.35);
        }

        .gold-glow {
          box-shadow: 0 0 35px -5px rgba(245, 158, 11, 0.45);
        }

        /* Golden Gradient Button */
        .gold-gradient-btn {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
          color: #001805;
          font-weight: 800;
          letter-spacing: 0.05em;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: 'Space Grotesk', sans-serif;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          text-decoration: none;
        }
        .gold-gradient-btn:hover {
          background: linear-gradient(135deg, #fde68a 0%, #fbbf24 50%, #d97706 100%);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.6);
        }

        /* Breathing Pill Glow */
        .pill-breath {
          animation: pillBreath 2.2s ease-in-out infinite;
        }
        @keyframes pillBreath {
          0%, 100% {
            box-shadow: 0 0 20px rgba(245, 158, 11, 0.35), 0 0 40px rgba(245, 158, 11, 0.15);
          }
          50% {
            box-shadow: 0 0 35px rgba(245, 158, 11, 0.7), 0 0 60px rgba(245, 158, 11, 0.4);
          }
        }

        /* Live dot pulse */
        @keyframes pulseLive {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
            box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.7);
          }
          50% {
            transform: scale(1.3);
            opacity: 0.75;
            box-shadow: 0 0 10px 4px rgba(52, 211, 153, 0.8);
          }
        }
        .live-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #34d399;
          animation: pulseLive 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          display: inline-block;
          flex-shrink: 0;
        }

        /* Separator Line */
        .section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.45), rgba(16, 185, 129, 0.45), transparent);
          margin: 0;
        }

        /* Neon Card Hover Effect */
        .neon-card {
          position: relative;
          overflow: hidden;
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .neon-card:hover {
          transform: translateY(-6px);
          border-color: rgba(245, 158, 11, 0.65) !important;
          box-shadow: 0 20px 35px -5px rgba(245, 158, 11, 0.3), 0 0 20px rgba(16, 185, 129, 0.2);
        }
        .neon-card:after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #f59e0b, transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .neon-card:hover:after {
          opacity: 1;
        }

        /* Scroll Reveal */
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .reveal.active {
          opacity: 1;
          transform: translateY(0);
        }

        /* =========================================================================
           HERO SECTION: SEAMLESS LEFT-TO-RIGHT SCROLLING STADIUM IMAGES
           MATCHING PURE HOME PAGE EMERALD & GOLD COLOR CODING
           ========================================================================= */
        .cds-hero {
          position: relative;
          width: 100%;
          min-height: auto;
          display: flex;
          align-items: flex-start;
          overflow: hidden;
          padding-top: 110px;
          padding-bottom: 36px;
          background-color: #001805;
        }

        @media (max-width: 768px) {
          .cds-hero {
            padding-top: 96px;
            padding-bottom: 28px;
          }
        }

        /* Infinite Left-to-Right Scrolling Stadium Panoramic Track */
        .cds-hero-scroll-viewport {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1;
          user-select: none;
          pointer-events: none;
        }

        .cds-hero-scroll-track {
          display: flex;
          height: 100%;
          width: max-content;
          /* Continuous left-to-right smooth horizontal scrolling */
          animation: heroScrollLeftToRight 55s linear infinite;
          will-change: transform;
        }

        @keyframes heroScrollLeftToRight {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }

        .cds-hero-scroll-item {
          position: relative;
          width: 60vw;
          min-width: 540px;
          height: 100%;
          flex-shrink: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        @media (max-width: 768px) {
          .cds-hero-scroll-item {
            width: 88vw;
            min-width: 300px;
          }
        }

        /* Left-focused gradient mask to ensure high contrast readability for left-aligned content */
        .cds-hero-overlay-mask {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: 
            linear-gradient(to right, rgba(0, 24, 5, 0.94) 0%, rgba(0, 24, 5, 0.8) 45%, rgba(0, 24, 5, 0.25) 80%, rgba(0, 24, 5, 0.08) 100%),
            linear-gradient(to bottom, rgba(0, 24, 5, 0.85) 0%, transparent 25%, transparent 65%, #001805 100%),
            radial-gradient(ellipse at 25% 26%, rgba(245, 158, 11, 0.16) 0%, transparent 60%);
          pointer-events: none;
        }

        /* Floating Cricket Balls in Hero */
        .cds-cricket-ball {
          position: absolute;
          width: 54px;
          height: 54px;
          background: radial-gradient(circle at 35% 35%, #ef4444 0%, #b91c1c 65%, #7f1d1d 100%);
          border-radius: 50%;
          z-index: 3;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.7), inset -4px -4px 10px rgba(0, 0, 0, 0.5);
          animation: cdsBallFloat 7s ease-in-out infinite;
          pointer-events: none;
        }

        .cds-cricket-ball::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1.5px dashed rgba(254, 240, 138, 0.85);
          transform: rotate(45deg);
        }

        .cds-ball-1 {
          top: 18%;
          right: 12%;
          animation-delay: 0s;
        }

        .cds-ball-2 {
          bottom: 15%;
          right: 7%;
          width: 44px;
          height: 44px;
          animation-delay: 3.5s;
        }

        @keyframes cdsBallFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-24px) rotate(180deg);
          }
        }

        /* Hero Container: Left Aligned Content */
        .cds-hero-container {
          position: relative;
          z-index: 10;
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
          padding: 0 48px;
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
        }

        @media (max-width: 1024px) {
          .cds-hero-container {
            padding: 0 24px;
          }
        }

        /* Main Hero Content: Snug Wrap Without Extra Gaps */
        .cds-hero-content {
          position: relative;
          z-index: 10;
          max-width: 960px;
          text-align: left;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin-top: 0;
          margin-bottom: 0;
          animation: cdsFadeInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @media (max-width: 900px) {
          .cds-hero-content {
            margin-top: 0;
            margin-bottom: 0;
          }
        }

        @keyframes cdsFadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .cds-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 20px;
          border-radius: 9999px;
          background: rgba(13, 56, 22, 0.88);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(245, 158, 11, 0.45);
          margin-bottom: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6), 0 0 15px rgba(245, 158, 11, 0.2);
          align-self: flex-start;
        }

        .cds-hero-title {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 900;
          font-size: clamp(2.4rem, 5vw, 4.4rem);
          text-transform: uppercase;
          letter-spacing: -0.02em;
          color: #ffffff;
          line-height: 1.05;
          text-shadow: 0 4px 24px rgba(0, 0, 0, 0.95);
          margin: 0;
          text-align: left;
        }

        .cds-hero-gradient-text {
          background: linear-gradient(135deg, #fef08a 0%, #f59e0b 50%, #d97706 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 30px rgba(245, 158, 11, 0.6));
          display: inline-block;
        }

        .cds-hero-desc {
          margin-top: 18px;
          font-size: clamp(1rem, 1.3vw, 1.18rem);
          color: #d1fae5;
          max-width: 720px;
          line-height: 1.65;
          font-weight: 400;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
          text-align: left;
          margin-left: 0;
          margin-right: 0;
        }

        /* Hero CTA Buttons in Single Line */
        .cds-hero-cta-group {
          margin-top: 28px;
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: flex-start;
          gap: 14px;
          width: 100%;
        }

        .cds-hero-cta-btn-item {
          white-space: nowrap !important;
          flex-shrink: 0;
        }

        @media (max-width: 900px) {
          .cds-hero-cta-group {
            flex-wrap: wrap;
          }
        }

        .cds-hero-stats-grid {
          margin-top: 40px;
          width: 100%;
          max-width: 680px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        @media (max-width: 820px) {
          .cds-hero-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .cds-stat-card {
          padding: 18px 16px;
          border-radius: 16px;
          background: rgba(7, 47, 16, 0.65);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(245, 158, 11, 0.25);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          transition: all 0.28s ease;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        }
        .cds-stat-card:hover {
          border-color: rgba(245, 158, 11, 0.65);
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(245, 158, 11, 0.25);
        }

        .cds-stat-number {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 900;
          font-size: clamp(1.4rem, 2vw, 1.85rem);
          color: #ffffff;
          letter-spacing: -0.01em;
        }

        /* SECTION GRIDS */
        .cds-tour-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .cds-tour-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .cds-tour-grid {
            grid-template-columns: 1fr;
          }
        }

        .cds-stadium-layout {
          display: grid;
          grid-template-columns: 7fr 5fr;
          gap: 40px;
          align-items: center;
        }
        @media (max-width: 1024px) {
          .cds-stadium-layout {
            grid-template-columns: 1fr;
          }
        }

        .cds-slots-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
        }
        @media (max-width: 1200px) {
          .cds-slots-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .cds-slots-grid {
            grid-template-columns: 1fr;
          }
        }

        .cds-gallery-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .cds-gallery-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .cds-gallery-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Auto-Scrolling Marquee Gallery Cards */
        .auto-gallery-card {
          position: relative;
          height: 320px;
          border-radius: 18px;
          overflow: hidden;
          background: #000000;
          border: 1px solid rgba(16, 185, 129, 0.25);
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
          transition: all 0.35s ease;
        }
        .auto-gallery-card:hover {
          transform: translateY(-6px);
          border-color: rgba(245, 158, 11, 0.7);
          box-shadow: 0 18px 35px rgba(245, 158, 11, 0.3);
        }

        .auto-track-wrap {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
        }

        .auto-scroll-row {
          display: flex;
          height: 100%;
          width: max-content;
          animation: marqueeRun 24s linear infinite;
        }
        .auto-gallery-card:hover .auto-scroll-row {
          animation-play-state: paused;
        }

        .auto-scroll-row img {
          width: 280px;
          height: 100%;
          object-fit: cover;
          flex-shrink: 0;
          display: block;
        }

        @keyframes marqueeRun {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .gallery-card-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.5) 60%, transparent 100%);
          color: white;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          z-index: 5;
        }

        .gallery-card-overlay b {
          color: #f59e0b;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        /* Video Highlights Grid (4 Columns) */
        .cds-videos-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
        }
        @media (max-width: 1200px) {
          .cds-videos-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .cds-videos-grid {
            grid-template-columns: 1fr;
          }
        }

        .video-card-inner {
          border-radius: 20px;
          overflow: hidden;
          background: rgba(7, 47, 16, 0.55);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(16, 185, 129, 0.25);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.35s ease;
          box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        }
        .video-card-inner:hover {
          transform: translateY(-6px);
          border-color: rgba(245, 158, 11, 0.6);
          box-shadow: 0 20px 35px rgba(245, 158, 11, 0.25);
        }

        .video-player-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: #000000;
          overflow: hidden;
        }
        .video-player-wrap video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .cds-cta-grid {
          display: grid;
          grid-template-columns: 7fr 5fr;
          gap: 40px;
          align-items: center;
        }
        @media (max-width: 1024px) {
          .cds-cta-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Welcome Tutorial Video Popup */
        .welcome-popup-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.88);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .welcome-popup-box {
          position: relative;
          background: linear-gradient(135deg, #021a08 0%, #063814 100%);
          width: 100%;
          max-width: 980px;
          border-radius: 24px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9);
          border: 2px solid #f59e0b;
          animation: popScale 0.35s ease-out;
        }
        @keyframes popScale {
          from { transform: translateY(30px) scale(0.96); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }

        .welcome-popup-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: #f59e0b;
          border: none;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          color: #001805;
          font-size: 20px;
          cursor: pointer;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          transition: transform 0.25s ease;
        }
        .welcome-popup-close-btn:hover {
          transform: rotate(90deg) scale(1.1);
        }

        .welcome-popup-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 0;
        }
        @media (max-width: 860px) {
          .welcome-popup-grid {
            grid-template-columns: 1fr;
          }
        }

        /* MODALS */
        .cds-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(0, 0, 0, 0.88);
          backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: fadeIn 0.25s ease;
        }

        .cds-modal-box {
          position: relative;
          width: 100%;
          max-width: 680px;
          max-height: 90vh;
          overflow-y: auto;
          border-radius: 24px;
          background: #011a07;
          border: 1px solid rgba(245, 158, 11, 0.5);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.95);
          animation: popScale 0.3s ease-out;
          color: #ecfdf5;
        }
      `}</style>

      {/* Floating Capsule Navbar Header */}
      <Header onOpenRegistration={openRegistrationModal} />

      {/* =========================================================================
             WELCOME POPUP WITH PLAYER REGISTRATION TUTORIAL VIDEO (Original Feature)
             ========================================================================= */}
      {showWelcomePopup && (
        <div
          className="welcome-popup-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowWelcomePopup(false);
          }}
        >
          <div className="welcome-popup-box">
            <button
              className="welcome-popup-close-btn"
              onClick={() => setShowWelcomePopup(false)}
              aria-label="Close Popup"
            >
              &times;
            </button>

            <div className="welcome-popup-grid">
              {/* Left Info & Steps */}
              <div style={{ padding: "32px 28px", color: "#ffffff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#f59e0b", fontFamily: "'Space Grotesk', sans-serif", fontSize: "22px", fontWeight: 800, marginBottom: "4px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "26px", fontVariationSettings: "'FILL' 1" }}>sports_cricket</span>
                  <span>CDS Champions Trophy</span>
                </div>
                <div style={{ color: "#34d399", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  WELCOME TO CDS CRICKET LEAGUE
                </div>
                <p style={{ color: "#a7f3d0", fontSize: "14px", marginTop: "4px", marginBottom: "22px" }}>
                  Official player registration process &amp; tutorial video
                </p>

                {/* 5 Features Steps */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "26px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "10px 14px", borderRadius: "10px", background: "rgba(245, 158, 11, 0.1)", borderLeft: "3px solid #f59e0b" }}>
                    <span className="material-symbols-outlined" style={{ color: "#f59e0b", fontSize: "20px", marginTop: "2px" }}>badge</span>
                    <div>
                      <h4 style={{ margin: "0 0 2px 0", color: "#f59e0b", fontSize: "13px", fontWeight: 700 }}>1. Fill Personal Details</h4>
                      <p style={{ margin: 0, color: "#d1fae5", fontSize: "12px" }}>Enter player name, age category, contact number, and playing role.</p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "10px 14px", borderRadius: "10px", background: "rgba(245, 158, 11, 0.1)", borderLeft: "3px solid #f59e0b" }}>
                    <span className="material-symbols-outlined" style={{ color: "#f59e0b", fontSize: "20px", marginTop: "2px" }}>schedule</span>
                    <div>
                      <h4 style={{ margin: "0 0 2px 0", color: "#f59e0b", fontSize: "13px", fontWeight: 700 }}>2. Select Preferred Match Slot</h4>
                      <p style={{ margin: 0, color: "#d1fae5", fontSize: "12px" }}>Choose Morning, Day, Evening, or Night session at Yamunanagar Ground.</p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "10px 14px", borderRadius: "10px", background: "rgba(245, 158, 11, 0.1)", borderLeft: "3px solid #f59e0b" }}>
                    <span className="material-symbols-outlined" style={{ color: "#f59e0b", fontSize: "20px", marginTop: "2px" }}>qr_code_2</span>
                    <div>
                      <h4 style={{ margin: "0 0 2px 0", color: "#f59e0b", fontSize: "13px", fontWeight: 700 }}>3. Pay Registration Fee via UPI</h4>
                      <p style={{ margin: 0, color: "#d1fae5", fontSize: "12px" }}>Scan the official QR code or transfer directly to league@cdscricket.</p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "10px 14px", borderRadius: "10px", background: "rgba(245, 158, 11, 0.1)", borderLeft: "3px solid #f59e0b" }}>
                    <span className="material-symbols-outlined" style={{ color: "#f59e0b", fontSize: "20px", marginTop: "2px" }}>receipt_long</span>
                    <div>
                      <h4 style={{ margin: "0 0 2px 0", color: "#f59e0b", fontSize: "13px", fontWeight: 700 }}>4. Enter 12-Digit UTR Number</h4>
                      <p style={{ margin: 0, color: "#d1fae5", fontSize: "12px" }}>Submit your transaction UTR number for automated payment reconciliation.</p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "10px 14px", borderRadius: "10px", background: "rgba(245, 158, 11, 0.1)", borderLeft: "3px solid #f59e0b" }}>
                    <span className="material-symbols-outlined" style={{ color: "#34d399", fontSize: "20px", marginTop: "2px" }}>check_circle</span>
                    <div>
                      <h4 style={{ margin: "0 0 2px 0", color: "#34d399", fontSize: "13px", fontWeight: 700 }}>5. Submit &amp; Receive Confirmation</h4>
                      <p style={{ margin: 0, color: "#d1fae5", fontSize: "12px" }}>Get instant league registration confirmation and official kit distribution details.</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <button
                    className="gold-gradient-btn"
                    style={{ flex: 1, padding: "12px 20px", fontSize: "13px", borderRadius: "50px" }}
                    onClick={() => {
                      setShowWelcomePopup(false);
                      openRegistrationModal("Player Registration");
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>how_to_reg</span>
                    <span>REGISTER NOW</span>
                  </button>

                  <button
                    style={{
                      flex: 1,
                      padding: "12px 20px",
                      borderRadius: "50px",
                      background: "transparent",
                      color: "#f59e0b",
                      border: "2px solid #f59e0b",
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: "13px",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                    onClick={() => {
                      setShowWelcomePopup(false);
                      navigate("/gallery");
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>collections</span>
                    <span>EXPLORE GALLERY</span>
                  </button>
                </div>
              </div>

              {/* Right: Embedded Video Player playing popupview.mp4 with poster stadium1.jpeg */}
              <div style={{ background: "#000000", display: "flex", flexDirection: "column", justifyContent: "center", borderLeft: "1px solid rgba(245, 158, 11, 0.3)" }}>
                <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "320px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <video
                    autoPlay
                    muted
                    loop
                    controls
                    playsInline
                    poster="/image/stadium1.jpeg"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    src={popupVideo}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>

            {/* Popup Bottom Banner */}
            <div style={{ padding: "12px 24px", background: "rgba(2, 26, 8, 0.95)", borderTop: "1px solid rgba(245, 158, 11, 0.2)", textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "rgba(167, 243, 208, 0.85)" }}>
              Limited slots available! Register today to secure your spot in CDS Cricket Premier League 2025&ndash;26.
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="w-full">
        {/* =========================================================================
               2. HERO SECTION (Original Stadium Photos Scrolling Left-to-Right)
               Matching Pure Home Page Emerald & Gold Theme
               ========================================================================= */}
        <section className="cds-hero stadium-bloom" id="home">
          {/* Continuous Left-to-Right Scrolling Stadium Images Background */}
          <div className="cds-hero-scroll-viewport">
            <div className="cds-hero-scroll-track">
              {/* First pass of original stadium images */}
              {heroImages.map((slide, idx) => (
                <div
                  key={`hero-img-1-${idx}`}
                  className="cds-hero-scroll-item"
                  style={{ backgroundImage: `url('${slide.img}')` }}
                />
              ))}
              {/* Second pass for seamless infinite loop */}
              {heroImages.map((slide, idx) => (
                <div
                  key={`hero-img-2-${idx}`}
                  className="cds-hero-scroll-item"
                  style={{ backgroundImage: `url('${slide.img}')` }}
                />
              ))}
            </div>
          </div>

          {/* Color-matching emerald and gold stadium overlay mask */}
          <div className="cds-hero-overlay-mask" />

          {/* Floating Cricket Balls Animation */}
          <div className="cds-cricket-ball cds-ball-1" />
          <div className="cds-cricket-ball cds-ball-2" />

          {/* Main Hero Content: Left-Aligned Container */}
          <div className="cds-hero-container">
            <div className="cds-hero-content">
              {/* Live Status Pill */}
              <div className="cds-status-pill">
                <span className="live-dot" />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "12px",
                    letterSpacing: "0.15em",
                    color: "#fde68a",
                    fontWeight: 700,
                    textTransform: "uppercase"
                  }}
                >
                  SEASON 2025–26 &bull; REGISTRATIONS ACTIVE
                </span>
                <span style={{ color: "rgba(245, 158, 11, 0.6)" }}>&bull;</span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "12px",
                    letterSpacing: "0.1em",
                    color: "#34d399",
                    textTransform: "uppercase"
                  }}
                >
                  YAMUNANAGAR GROUND
                </span>
              </div>

              {/* Hero Mega Typography in Gold & White */}
              <h1 className="cds-hero-title">
                JOIN THE CRICKET <br />
                <span className="cds-hero-gradient-text">REVOLUTION</span> AT YAMUNANAGAR
              </h1>

              <p className="cds-hero-desc">
                Experience high-octane franchise cricket at our state-of-the-art stadium. Daily competitive fixtures with
                BCCI-certified umpires, international turf pitches, electronic telemetry, and premier scouting exposure.
              </p>

              {/* 3 Prominent Action Buttons in a Single Line */}
              <div className="cds-hero-cta-group">
                <button
                  className="gold-gradient-btn pill-breath cds-hero-cta-btn-item"
                  style={{ padding: "14px 26px", fontSize: "13.5px", whiteSpace: "nowrap" }}
                  onClick={() => openRegistrationModal("Player Registration")}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "19px", fontVariationSettings: "'FILL' 1" }}>
                    sports_cricket
                  </span>
                  <span>REGISTER AS PLAYER</span>
                </button>

                <a
                  className="glass-panel cds-hero-cta-btn-item"
                  style={{
                    padding: "14px 22px",
                    fontSize: "13.5px",
                    borderRadius: "12px",
                    color: "#ffffff",
                    textDecoration: "none",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "9px",
                    whiteSpace: "nowrap"
                  }}
                  href="#stadium"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "19px", color: "#f59e0b" }}>
                    stadium
                  </span>
                  <span>EXPLORE STADIUM &amp; SLOTS</span>
                </a>

                <button
                  className="cds-hero-cta-btn-item"
                  style={{
                    padding: "14px 22px",
                    fontSize: "13.5px",
                    borderRadius: "12px",
                    background: "rgba(6, 46, 17, 0.75)",
                    border: "1px solid rgba(245, 158, 11, 0.4)",
                    color: "#fde68a",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.25s ease",
                    whiteSpace: "nowrap"
                  }}
                  onClick={() => setShowWelcomePopup(true)}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "19px", color: "#f59e0b", fontVariationSettings: "'FILL' 1" }}>
                    play_circle
                  </span>
                  <span>WATCH PROMO</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider" />

        {/* =========================================================================
               3. TOURNAMENT DETAILS & FEATURES (4 Cards)
               ========================================================================= */}
        <section
          style={{ width: "100%", padding: "96px 0", backgroundColor: "#011405", borderTop: "1px solid rgba(13, 56, 22, 0.5)", borderBottom: "1px solid rgba(13, 56, 22, 0.5)" }}
          id="tournament"
        >
          <div className="cds-section-container">
            {/* Header */}
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px", marginBottom: "60px" }} className="reveal">
              <div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#f59e0b",
                    fontSize: "12px",
                    fontFamily: "'JetBrains Mono', monospace",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    fontWeight: 700,
                    marginBottom: "8px"
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>emoji_events</span>
                  <span>LEAGUE BLUEPRINT &amp; ARCHITECTURE</span>
                </div>
                <h2
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 900,
                    fontSize: "clamp(2rem, 3.8vw, 3rem)",
                    textTransform: "uppercase",
                    color: "#ffffff",
                    letterSpacing: "-0.01em",
                    margin: 0
                  }}
                >
                  TOURNAMENT DETAILS &amp; FEATURES
                </h2>
              </div>
              <p style={{ fontSize: "14px", color: "rgba(167, 243, 208, 0.8)", maxWidth: "440px", lineHeight: 1.6, margin: 0 }}>
                Professional cricket championship organized by CDS at Yamunanagar Ground Stadium under full
                BCCI and international match protocols.
              </p>
            </div>

            {/* 4 Cards Grid */}
            <div className="cds-tour-grid">
              {/* Card 01: Professional League */}
              <div
                className="neon-card glass-panel reveal"
                style={{
                  padding: "28px",
                  borderRadius: "20px",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "340px"
                }}
                onClick={() => openRegistrationModal("Professional League Details")}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "14px",
                        background: "linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(13, 56, 22, 0.5))",
                        border: "1px solid rgba(245, 158, 11, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#f59e0b"
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "30px", fontVariationSettings: "'FILL' 1" }}>
                        sports_cricket
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#f59e0b",
                        backgroundColor: "rgba(245, 158, 11, 0.1)",
                        padding: "4px 10px",
                        borderRadius: "9999px",
                        border: "1px solid rgba(245, 158, 11, 0.2)"
                      }}
                    >
                      01
                    </span>
                  </div>

                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: "0.15em", color: "#f59e0b", fontWeight: 700, display: "block", marginBottom: "4px", textTransform: "uppercase" }}>
                    STANDARDS
                  </span>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "20px", color: "#ffffff", textTransform: "uppercase", margin: "0 0 12px 0" }}>
                    PROFESSIONAL LEAGUE
                  </h3>
                  <p style={{ fontSize: "13px", color: "rgba(167, 243, 208, 0.7)", lineHeight: 1.6, margin: 0 }}>
                    Certified Umpires &amp; Professional Equipment. Automated electronic scoring tablets, official white leather match balls, and strict international playing protocols.
                  </p>
                </div>

                <div style={{ marginTop: "30px", paddingTop: "16px", borderTop: "1px solid rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#a7f3d0", fontWeight: 600 }}>
                  <span>CERTIFIED UMPIRES</span>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#f59e0b" }}>arrow_forward</span>
                </div>
              </div>

              {/* Card 02: Talent Squad */}
              <div
                className="neon-card glass-panel reveal"
                style={{
                  padding: "28px",
                  borderRadius: "20px",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "340px",
                  transitionDelay: "100ms"
                }}
                onClick={() => openRegistrationModal("Youth Talent Squad")}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "14px",
                        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(13, 56, 22, 0.5))",
                        border: "1px solid rgba(16, 185, 129, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#34d399"
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "30px", fontVariationSettings: "'FILL' 1" }}>
                        groups_2
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#34d399",
                        backgroundColor: "rgba(52, 211, 153, 0.1)",
                        padding: "4px 10px",
                        borderRadius: "9999px",
                        border: "1px solid rgba(52, 211, 153, 0.2)"
                      }}
                    >
                      02
                    </span>
                  </div>

                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: "0.15em", color: "#34d399", fontWeight: 700, display: "block", marginBottom: "4px", textTransform: "uppercase" }}>
                    TALENT SQUAD
                  </span>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "20px", color: "#ffffff", textTransform: "uppercase", margin: "0 0 12px 0" }}>
                    YOUTH FOCUSED
                  </h3>
                  <p style={{ fontSize: "13px", color: "rgba(167, 243, 208, 0.7)", lineHeight: 1.6, margin: 0 }}>
                    Open for players aged 10&ndash;25 years. Tailored categories for U-14 sub-juniors, U-19 youth stars, and under-25 challengers to showcase skills for district &amp; state scouts.
                  </p>
                </div>

                <div style={{ marginTop: "30px", paddingTop: "16px", borderTop: "1px solid rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#a7f3d0", fontWeight: 600 }}>
                  <span>AGE 10&ndash;25 YEARS</span>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#34d399" }}>arrow_forward</span>
                </div>
              </div>

              {/* Card 03: Daily Schedule */}
              <div
                className="neon-card glass-panel reveal"
                style={{
                  padding: "28px",
                  borderRadius: "20px",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "340px",
                  transitionDelay: "150ms"
                }}
                onClick={() => openRegistrationModal("Daily Schedule Overview")}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "14px",
                        background: "linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(13, 56, 22, 0.5))",
                        border: "1px solid rgba(245, 158, 11, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#f59e0b"
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "30px", fontVariationSettings: "'FILL' 1" }}>
                        calendar_month
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#f59e0b",
                        backgroundColor: "rgba(245, 158, 11, 0.1)",
                        padding: "4px 10px",
                        borderRadius: "9999px",
                        border: "1px solid rgba(245, 158, 11, 0.2)"
                      }}
                    >
                      03
                    </span>
                  </div>

                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: "0.15em", color: "#f59e0b", fontWeight: 700, display: "block", marginBottom: "4px", textTransform: "uppercase" }}>
                    SCHEDULE
                  </span>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "20px", color: "#ffffff", textTransform: "uppercase", margin: "0 0 12px 0" }}>
                    DAILY MATCHES
                  </h3>
                  <p style={{ fontSize: "13px", color: "rgba(167, 243, 208, 0.7)", lineHeight: 1.6, margin: 0 }}>
                    Four time slots available every single day. Consistent scheduling allows players and clubs to book exact convenient slots without academic or professional clashes.
                  </p>
                </div>

                <div style={{ marginTop: "30px", paddingTop: "16px", borderTop: "1px solid rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#a7f3d0", fontWeight: 600 }}>
                  <span>4 DAILY SESSIONS</span>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#f59e0b" }}>arrow_forward</span>
                </div>
              </div>

              {/* Card 04: Accolades & Trophies */}
              <div
                className="neon-card glass-panel reveal"
                style={{
                  padding: "28px",
                  borderRadius: "20px",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "340px",
                  transitionDelay: "200ms"
                }}
                onClick={() => openRegistrationModal("Prizes & Accolades")}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "14px",
                        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(13, 56, 22, 0.5))",
                        border: "1px solid rgba(16, 185, 129, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#34d399"
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "30px", fontVariationSettings: "'FILL' 1" }}>
                        military_tech
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#34d399",
                        backgroundColor: "rgba(52, 211, 153, 0.1)",
                        padding: "4px 10px",
                        borderRadius: "9999px",
                        border: "1px solid rgba(52, 211, 153, 0.2)"
                      }}
                    >
                      04
                    </span>
                  </div>

                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: "0.15em", color: "#34d399", fontWeight: 700, display: "block", marginBottom: "4px", textTransform: "uppercase" }}>
                    ACCOLADES
                  </span>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "20px", color: "#ffffff", textTransform: "uppercase", margin: "0 0 12px 0" }}>
                    PRIZES &amp; AWARDS
                  </h3>
                  <p style={{ fontSize: "13px", color: "rgba(167, 243, 208, 0.7)", lineHeight: 1.6, margin: 0 }}>
                    Trophies, Medals &amp; Certificates. Prestigious championship shields, Man of the Match awards, best bowler &amp; batsman prizes, and certified player credentials.
                  </p>
                </div>

                <div style={{ marginTop: "30px", paddingTop: "16px", borderTop: "1px solid rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#a7f3d0", fontWeight: 600 }}>
                  <span>TROPHIES &amp; MEDALS</span>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#34d399" }}>arrow_forward</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider" />

        {/* =========================================================================
               4. YAMUNANAGAR GROUND CRICKET STADIUM SHOWCASE (All 5 Views)
               ========================================================================= */}
        <section style={{ width: "100%", padding: "96px 0", backgroundColor: "#001404" }} id="stadium">
          <div className="cds-section-container">
            <div className="cds-stadium-layout">
              {/* Left Carousel Showcase */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }} className="reveal">
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16 / 10",
                    borderRadius: "20px",
                    overflow: "hidden",
                    backgroundColor: "#000000",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.85)"
                  }}
                >
                  {stadiumViews.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: "absolute",
                        inset: 0,
                        opacity: idx === currentStadiumIdx ? 1 : 0,
                        transition: "opacity 0.7s ease-in-out"
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundImage: `url('${item.img}')`,
                          transition: "transform 8s ease"
                        }}
                      />
                      <div
                        className="glass-panel-gold"
                        style={{
                          position: "absolute",
                          bottom: "16px",
                          left: "16px",
                          padding: "8px 16px",
                          borderRadius: "10px",
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "12px",
                          color: "#fde68a",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          boxShadow: "0 4px 15px rgba(0,0,0,0.5)"
                        }}
                      >
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#f59e0b", display: "inline-block" }} />
                        <span>{item.title}</span>
                      </div>
                    </div>
                  ))}

                  {/* Left / Right Carousel Controls */}
                  <button
                    aria-label="Previous Stadium View"
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      background: "rgba(4, 37, 12, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      zIndex: 10
                    }}
                    onClick={() =>
                      setCurrentStadiumIdx((prev) => (prev - 1 + stadiumViews.length) % stadiumViews.length)
                    }
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_back</span>
                  </button>

                  <button
                    aria-label="Next Stadium View"
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      background: "rgba(4, 37, 12, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      zIndex: 10
                    }}
                    onClick={() => setCurrentStadiumIdx((prev) => (prev + 1) % stadiumViews.length)}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
                  </button>
                </div>

                {/* 5 Selector Tabs */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
                  {stadiumViews.map((item, idx) => (
                    <button
                      key={idx}
                      className="glass-panel"
                      style={{
                        padding: "10px 6px",
                        borderRadius: "12px",
                        textAlign: "center",
                        cursor: "pointer",
                        border: idx === currentStadiumIdx ? "1.5px solid #f59e0b" : "1px solid rgba(16, 185, 129, 0.2)",
                        boxShadow: idx === currentStadiumIdx ? "0 0 15px rgba(245, 158, 11, 0.3)" : "none"
                      }}
                      onClick={() => setCurrentStadiumIdx(idx)}
                    >
                      <span
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontWeight: 700,
                          fontSize: "11px",
                          textTransform: "uppercase",
                          color: idx === currentStadiumIdx ? "#fde68a" : "rgba(167, 243, 208, 0.75)",
                          display: "block",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}
                      >
                        {item.tab}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Specifications Card */}
              <div className="reveal" style={{ transitionDelay: "150ms" }}>
                <div
                  className="glass-panel"
                  style={{
                    padding: "36px 32px",
                    borderRadius: "24px",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    boxShadow: "0 20px 45px rgba(0, 0, 0, 0.7)"
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#34d399",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      fontWeight: 700,
                      marginBottom: "10px"
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#f59e0b" }}>stadium</span>
                    <span>HOME GROUND OF CDS LEAGUE</span>
                  </div>

                  <h2
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 900,
                      fontSize: "clamp(1.7rem, 2.5vw, 2.3rem)",
                      textTransform: "uppercase",
                      color: "#ffffff",
                      margin: "0 0 14px 0",
                      letterSpacing: "-0.01em"
                    }}
                  >
                    YAMUNANAGAR GROUND CRICKET STADIUM
                  </h2>

                  <p style={{ fontSize: "14px", color: "rgba(167, 243, 208, 0.8)", lineHeight: 1.6, margin: "0 0 24px 0" }}>
                    Our professional cricket stadium in Yamunanagar provides world-class facilities for both day and night matches.
                    With a perfect curated pitch, advanced floodlights, and spectator seating for 500+ people, we create the ideal
                    environment for cricket enthusiasts.
                  </p>

                  {/* 6 Checklist Items (from original) */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", borderRadius: "12px", background: "rgba(4, 37, 12, 0.5)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                      <span className="material-symbols-outlined" style={{ color: "#34d399", fontSize: "18px", fontWeight: "bold" }}>verified</span>
                      <span style={{ fontSize: "13px", color: "#ecfdf5", fontWeight: 500 }}>Professional Grade Cricket Pitch with True Bounce</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", borderRadius: "12px", background: "rgba(4, 37, 12, 0.5)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                      <span className="material-symbols-outlined" style={{ color: "#f59e0b", fontSize: "18px", fontWeight: "bold" }}>verified</span>
                      <span style={{ fontSize: "13px", color: "#ecfdf5", fontWeight: 500 }}>Advanced Floodlights for Night Matches (50,000 LUX)</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", borderRadius: "12px", background: "rgba(4, 37, 12, 0.5)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                      <span className="material-symbols-outlined" style={{ color: "#34d399", fontSize: "18px", fontWeight: "bold" }}>verified</span>
                      <span style={{ fontSize: "13px", color: "#ecfdf5", fontWeight: 500 }}>Sprawling 4-Acre Enclosure with Digital Scoreboards</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", borderRadius: "12px", background: "rgba(4, 37, 12, 0.5)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                      <span className="material-symbols-outlined" style={{ color: "#f59e0b", fontSize: "18px", fontWeight: "bold" }}>verified</span>
                      <span style={{ fontSize: "13px", color: "#ecfdf5", fontWeight: 500 }}>Modern Pavilion &amp; Changing Rooms with Team Dugouts</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", borderRadius: "12px", background: "rgba(4, 37, 12, 0.5)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                      <span className="material-symbols-outlined" style={{ color: "#34d399", fontSize: "18px", fontWeight: "bold" }}>verified</span>
                      <span style={{ fontSize: "13px", color: "#ecfdf5", fontWeight: 500 }}>Practice Nets Available Daily with Bowling Machines</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", borderRadius: "12px", background: "rgba(4, 37, 12, 0.5)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                      <span className="material-symbols-outlined" style={{ color: "#f59e0b", fontSize: "18px", fontWeight: "bold" }}>verified</span>
                      <span style={{ fontSize: "13px", color: "#ecfdf5", fontWeight: 500 }}>First Aid &amp; Professional Medical Facilities On-Site</span>
                    </div>
                  </div>

                  {/* Actions & Location */}
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                    <button
                      className="gold-gradient-btn"
                      style={{ padding: "12px 24px", fontSize: "13px" }}
                      onClick={() => openRegistrationModal("Stadium Pitch Reservation")}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>calendar_add_on</span>
                      <span>BOOK PITCH SLOT</span>
                    </button>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", color: "#a7f3d0" }}>
                      <span className="material-symbols-outlined" style={{ color: "#f59e0b", fontSize: "18px" }}>location_on</span>
                      <span>Sector 14, Sports Enclave, Yamunanagar</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider" />

        {/* =========================================================================
               5. DAILY MATCH TIME SLOTS (All 4 Sessions from Original)
               ========================================================================= */}
        <section
          style={{ width: "100%", padding: "96px 0", backgroundColor: "#011606", borderTop: "1px solid rgba(13, 56, 22, 0.5)", borderBottom: "1px solid rgba(13, 56, 22, 0.5)" }}
          id="time-slots"
        >
          <div className="cds-section-container">
            {/* Header */}
            <div style={{ textAlign: "center", maxWidth: "780px", margin: "0 auto 60px auto" }} className="reveal">
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#f59e0b",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  fontWeight: 700,
                  marginBottom: "8px"
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>schedule</span>
                <span>GUARANTEED DAILY MATCH FIXTURES</span>
              </div>
              <h2
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(2rem, 3.8vw, 3rem)",
                  textTransform: "uppercase",
                  color: "#ffffff",
                  letterSpacing: "-0.01em",
                  margin: 0
                }}
              >
                DAILY MATCH TIME SLOTS
              </h2>
              <p style={{ marginTop: "14px", fontSize: "15px", color: "rgba(167, 243, 208, 0.8)", lineHeight: 1.6 }}>
                Same time slots available every day at Yamunanagar Ground Stadium. Choose your preferred match timing and secure your spot.
              </p>
            </div>

            {/* 4 Fixture Cards Grid */}
            <div className="cds-slots-grid">
              {timeSlots.map((slot, idx) => (
                <div
                  key={idx}
                  className="neon-card glass-panel reveal"
                  style={{
                    padding: "30px 24px",
                    borderRadius: "22px",
                    border: slot.badge === "POPULAR" ? "1.5px solid rgba(245, 158, 11, 0.55)" : "1px solid rgba(16, 185, 129, 0.2)",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: "410px",
                    position: "relative",
                    overflow: "hidden",
                    transitionDelay: `${idx * 80}ms`
                  }}
                  onClick={() => openRegistrationModal(`Register: ${slot.title}`, slot.slotKey)}
                >
                  {/* Popular Banner */}
                  {slot.badge === "POPULAR" && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        backgroundColor: "#f59e0b",
                        color: "#000000",
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 900,
                        fontSize: "10px",
                        letterSpacing: "0.1em",
                        padding: "4px 16px",
                        borderBottomLeftRadius: "12px",
                        textTransform: "uppercase"
                      }}
                    >
                      POPULAR
                    </div>
                  )}

                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "#f59e0b",
                          backgroundColor: "rgba(245, 158, 11, 0.12)",
                          padding: "4px 10px",
                          borderRadius: "9999px",
                          border: "1px solid rgba(245, 158, 11, 0.25)",
                          letterSpacing: "0.1em"
                        }}
                      >
                        {slot.session}
                      </span>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "11px",
                          fontWeight: 700,
                          color: slot.badgeColor,
                          backgroundColor: slot.badgeColor === "#f59e0b" ? "rgba(245, 158, 11, 0.15)" : "rgba(52, 211, 153, 0.15)",
                          padding: "4px 10px",
                          borderRadius: "9999px",
                          border: `1px solid ${slot.badgeColor === "#f59e0b" ? "rgba(245, 158, 11, 0.35)" : "rgba(52, 211, 153, 0.3)"}`,
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: slot.badgeColor, display: "inline-block" }} />
                        {slot.badge}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#a7f3d0", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", textTransform: "uppercase", marginBottom: "8px" }}>
                      <span className="material-symbols-outlined" style={{ color: "#f59e0b", fontSize: "18px" }}>{slot.icon}</span>
                      <span>{slot.title}</span>
                    </div>

                    <h3
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 900,
                        fontSize: "24px",
                        color: "#ffffff",
                        margin: "0 0 12px 0"
                      }}
                    >
                      {slot.time}
                    </h3>

                    <p style={{ fontSize: "12px", color: "rgba(167, 243, 208, 0.75)", lineHeight: 1.55, margin: "0 0 20px 0" }}>
                      {slot.desc}
                    </p>

                    <div
                      style={{
                        padding: "12px 14px",
                        borderRadius: "12px",
                        backgroundColor: "rgba(4, 37, 12, 0.7)",
                        border: "1px solid rgba(16, 185, 129, 0.2)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "11px",
                        color: "#a7f3d0"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "rgba(167, 243, 208, 0.65)" }}>Pitch:</span>
                        <span style={{ color: "#ffffff", fontWeight: 700 }}>{slot.pitch}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "rgba(167, 243, 208, 0.65)" }}>Format:</span>
                        <span style={{ color: "#ffffff", fontWeight: 700 }}>{slot.format}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    style={{
                      marginTop: "24px",
                      width: "100%",
                      padding: "13px",
                      borderRadius: "12px",
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 800,
                      fontSize: "11px",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      backgroundColor: slot.badge === "POPULAR" ? "#f59e0b" : "rgba(7, 47, 16, 0.8)",
                      color: slot.badge === "POPULAR" ? "#000000" : "#a7f3d0",
                      border: slot.badge === "POPULAR" ? "none" : "1px solid rgba(16, 185, 129, 0.35)",
                      cursor: "pointer",
                      boxShadow: slot.badge === "POPULAR" ? "0 6px 18px rgba(245, 158, 11, 0.4)" : "none",
                      transition: "all 0.25s ease"
                    }}
                  >
                    {slot.btnText}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider" />

        {/* =========================================================================
               6. MATCH GALLERY & HIGHLIGHTS (All Original Batting, Team, Stadium, Award Photos with Auto-Marquee)
               ========================================================================= */}
        <section style={{ width: "100%", padding: "96px 0", backgroundColor: "#001004" }} id="gallery">
          <div className="cds-section-container">
            {/* Header */}
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px", marginBottom: "60px" }} className="reveal">
              <div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#f59e0b",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    fontWeight: 700,
                    marginBottom: "8px"
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>photo_camera</span>
                  <span>GROUND MEMORIES &amp; TROPHY MOMENTS</span>
                </div>
                <h2
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 900,
                    fontSize: "clamp(2rem, 3.8vw, 3rem)",
                    textTransform: "uppercase",
                    color: "#ffffff",
                    letterSpacing: "-0.01em",
                    margin: 0
                  }}
                >
                  MATCH GALLERY &amp; HIGHLIGHTS
                </h2>
              </div>
              <p style={{ fontSize: "14px", color: "rgba(167, 243, 208, 0.8)", maxWidth: "440px", lineHeight: 1.6, margin: 0 }}>
                Experience the excitement through photos from our previous matches and tournaments at Yamunanagar Ground Stadium.
              </p>
            </div>

            {/* 4 Auto-Scrolling Marquee Gallery Cards */}
            <div className="cds-gallery-grid">
              {galleryCategories.map((cat, idx) => (
                <div
                  key={idx}
                  className="auto-gallery-card reveal"
                  style={{ transitionDelay: `${idx * 90}ms` }}
                  onClick={() => navigate("/gallery")}
                >
                  <div className="auto-track-wrap">
                    <div className="auto-scroll-row">
                      {cat.images.map((imgSrc, imgIdx) => (
                        <img
                          key={imgIdx}
                          src={imgSrc}
                          alt={`${cat.title} ${imgIdx + 1}`}
                          loading="lazy"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Category Pill Tag */}
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "10px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      backgroundColor: cat.tagBg,
                      color: "#000000",
                      zIndex: 6,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.4)"
                    }}
                  >
                    {cat.tag}
                  </div>

                  {/* Gradient Info Overlay */}
                  <div className="gallery-card-overlay">
                    <b>{cat.title}</b>
                    <span style={{ fontSize: "11px", color: "rgba(167, 243, 208, 0.85)" }}>{cat.subtitle}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Button to explore full gallery */}
            <div style={{ marginTop: "48px", display: "flex", justifyContent: "center" }} className="reveal">
              <button
                className="glass-panel"
                style={{
                  padding: "14px 32px",
                  borderRadius: "50px",
                  color: "#ffffff",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "13px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  border: "2px solid #f59e0b"
                }}
                onClick={() => navigate("/gallery")}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#f59e0b" }}>collections</span>
                <span>EXPLORE FULL MATCH GALLERY</span>
              </button>
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider" />

        {/* =========================================================================
               7. MATCH HIGHLIGHTS VIDEOS (ALL 4 Local Videos: highlight1, 2, 3, 4)
               ========================================================================= */}
        <section
          style={{ width: "100%", padding: "96px 0", backgroundColor: "#011606", borderTop: "1px solid rgba(13, 56, 22, 0.5)" }}
          id="highlights"
        >
          <div className="cds-section-container">
            {/* Header */}
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px", marginBottom: "60px" }} className="reveal">
              <div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#f59e0b",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    fontWeight: 700,
                    marginBottom: "8px"
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>play_circle</span>
                  <span>BROADCAST MATCH CLIPS</span>
                </div>
                <h2
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 900,
                    fontSize: "clamp(2rem, 3.8vw, 3rem)",
                    textTransform: "uppercase",
                    color: "#ffffff",
                    letterSpacing: "-0.01em",
                    margin: 0
                  }}
                >
                  MATCH HIGHLIGHTS VIDEOS
                </h2>
              </div>
              <p style={{ fontSize: "14px", color: "rgba(167, 243, 208, 0.8)", maxWidth: "440px", lineHeight: 1.6, margin: 0 }}>
                Watch exciting highlights and previous fixtures from Yamunanagar Ground Stadium recorded in high definition.
              </p>
            </div>

            {/* 4 Video Cards Grid (Direct In-Card HTML5 Player + Expand Button) */}
            <div className="cds-videos-grid">
              {videoClips.map((clip, idx) => (
                <div
                  key={idx}
                  className="video-card-inner reveal"
                  style={{ transitionDelay: `${idx * 80}ms` }}
                >
                  <div>
                    {/* Direct HTML5 Video Player */}
                    <div className="video-player-wrap">
                      <video
                        controls
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        poster={clip.poster}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        src={clip.videoSrc}
                      >
                        Your browser does not support the video tag.
                      </video>

                      {/* Duration Tag */}
                      <span
                        style={{
                          position: "absolute",
                          bottom: "8px",
                          right: "8px",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "10px",
                          fontWeight: 700,
                          backgroundColor: "rgba(0,0,0,0.85)",
                          color: "#ffffff",
                          pointerEvents: "none"
                        }}
                      >
                        {clip.duration}
                      </span>
                    </div>

                    <div style={{ padding: "20px 18px" }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#f59e0b", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                        {clip.category}
                      </span>
                      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "16px", color: "#ffffff", margin: "0 0 6px 0", lineHeight: 1.3 }}>
                        {clip.title}
                      </h3>
                      <p style={{ fontSize: "12px", color: "rgba(167, 243, 208, 0.7)", lineHeight: 1.5, margin: 0 }}>
                        {clip.desc}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Bar: HD Badge + Cinema Lightbox trigger */}
                  <div
                    style={{
                      padding: "0 18px 18px 18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "11px",
                      color: "#34d399",
                      borderTop: "1px solid rgba(16, 185, 129, 0.15)",
                      paddingTop: "12px"
                    }}
                  >
                    <span>HD BROADCAST</span>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        color: "#f59e0b",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: 0
                      }}
                      onClick={() => playVideoModal(clip.title, clip.videoSrc)}
                    >
                      <span>Cinema View</span>
                      <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>fullscreen</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider" />

        {/* =========================================================================
               8. DUAL REGISTRATION CTA BANNER (2 Distinct League Buttons)
               ========================================================================= */}
        <section style={{ width: "100%", padding: "96px 0", backgroundColor: "#001404" }} id="register-banner">
          <div className="cds-section-container">
            <div
              className="glass-panel reveal"
              style={{
                position: "relative",
                borderRadius: "28px",
                padding: "clamp(32px, 5vw, 64px)",
                border: "1.5px solid rgba(245, 158, 11, 0.45)",
                boxShadow: "0 25px 60px rgba(0, 0, 0, 0.95)",
                overflow: "hidden"
              }}
            >
              <div className="cds-cta-grid">
                <div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#f59e0b",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      fontWeight: 700,
                      marginBottom: "12px"
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>stars</span>
                    <span>DIRECT FAST-TRACK ENROLMENT</span>
                  </div>

                  <h2
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 900,
                      fontSize: "clamp(2rem, 3.8vw, 3.5rem)",
                      textTransform: "uppercase",
                      color: "#ffffff",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.1,
                      margin: 0
                    }}
                  >
                    READY TO PLAY <span style={{ color: "#f59e0b" }}>PROFESSIONAL</span> CRICKET?
                  </h2>

                  <p style={{ marginTop: "16px", fontSize: "15px", color: "rgba(209, 250, 229, 0.9)", lineHeight: 1.6, maxWidth: "600px" }}>
                    Don't miss your chance to be part of the most exciting cricket tournament in Yamunanagar. Register now and
                    secure your spot in the CDS Cricket Premier League 2025-26. Limited slots available for each time session!
                  </p>

                  {/* Helpline Badges */}
                  <div style={{ marginTop: "28px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "20px", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#a7f3d0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className="material-symbols-outlined" style={{ color: "#f59e0b", fontSize: "18px" }}>call</span>
                      <span style={{ color: "#ffffff", fontWeight: 700 }}>+91 98765 43210</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className="material-symbols-outlined" style={{ color: "#f59e0b", fontSize: "18px" }}>mail</span>
                      <span style={{ color: "#ffffff" }}>register@cdscricketleague.com</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className="material-symbols-outlined" style={{ color: "#f59e0b", fontSize: "18px" }}>schedule</span>
                      <span>Office: 9:00 AM &ndash; 6:00 PM</span>
                    </div>
                  </div>
                </div>

                {/* Dual Action Buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", justifyContent: "center" }}>
                  {/* Button 1: CDS Cricket Premier League Registration */}
                  <button
                    className="gold-gradient-btn pill-breath"
                    style={{
                      width: "100%",
                      padding: "20px 24px",
                      borderRadius: "16px",
                      fontSize: "14px",
                      fontWeight: 900,
                      letterSpacing: "0.08em"
                    }}
                    onClick={() => openRegistrationModal("CDS Cricket Premier League Registration")}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "24px", fontVariationSettings: "'FILL' 1" }}>
                      sports_cricket
                    </span>
                    <span>REGISTER FOR CDS CRICKET LEAGUE</span>
                  </button>

                  {/* Button 2: Ambala Rising Star Partner League CTA */}
                  <button
                    style={{
                      width: "100%",
                      padding: "20px 24px",
                      borderRadius: "16px",
                      fontSize: "14px",
                      fontWeight: 900,
                      letterSpacing: "0.08em",
                      background: "linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)",
                      color: "#000000",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'Space Grotesk', sans-serif",
                      textTransform: "uppercase",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      boxShadow: "0 10px 25px rgba(217, 119, 6, 0.45)",
                      transition: "all 0.25s ease"
                    }}
                    onClick={() => navigate("/Ambala-Rising-Star")}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "24px", fontVariationSettings: "'FILL' 1" }}>
                      groups
                    </span>
                    <span>REGISTER FOR AMBALA RISING STAR CRICKET LEAGUE</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Comprehensive Footer */}
      <Footer />

      {/* =========================================================================
             MODAL 1: INTERACTIVE 5-STEP PLAYER REGISTRATION MODAL
             ========================================================================= */}
      {isRegModalOpen && (
        <div
          className="cds-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeRegistrationModal();
          }}
        >
          <div className="cds-modal-box">
            {/* Modal Header */}
            <div
              style={{
                padding: "20px 24px",
                backgroundColor: "rgba(4, 37, 12, 0.9)",
                borderBottom: "1px solid rgba(245, 158, 11, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    backgroundColor: "rgba(245, 158, 11, 0.2)",
                    color: "#f59e0b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(245, 158, 11, 0.4)"
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>app_registration</span>
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 900,
                      fontSize: "17px",
                      color: "#ffffff",
                      textTransform: "uppercase",
                      margin: 0
                    }}
                  >
                    {modalHeading}
                  </h3>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "11px",
                      color: "#f59e0b",
                      textTransform: "uppercase",
                      fontWeight: 600
                    }}
                  >
                    Yamunanagar Ground Stadium &bull; 5-Step Process
                  </span>
                </div>
              </div>

              <button
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(13, 56, 22, 0.8)",
                  border: "none",
                  color: "#ffffff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                onClick={closeRegistrationModal}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* 5-Step Progress Stepper */}
              <div
                style={{
                  padding: "16px",
                  borderRadius: "16px",
                  backgroundColor: "rgba(4, 37, 12, 0.6)",
                  border: "1px solid rgba(16, 185, 129, 0.2)"
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "11px",
                    color: "#f59e0b",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    marginBottom: "12px",
                    textAlign: "center"
                  }}
                >
                  OFFICIAL 5-STEP REGISTRATION WORKFLOW
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: "8px",
                    textAlign: "center",
                    fontFamily: "'JetBrains Mono', monospace"
                  }}
                >
                  <div>
                    <div style={{ width: "32px", height: "32px", margin: "0 auto", borderRadius: "50%", backgroundColor: "#f59e0b", color: "#000", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>
                      1
                    </div>
                    <span style={{ fontSize: "10px", color: "#ffffff", marginTop: "4px", display: "block" }}>Info</span>
                  </div>
                  <div>
                    <div style={{ width: "32px", height: "32px", margin: "0 auto", borderRadius: "50%", backgroundColor: "#f59e0b", color: "#000", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>
                      2
                    </div>
                    <span style={{ fontSize: "10px", color: "#ffffff", marginTop: "4px", display: "block" }}>Slot</span>
                  </div>
                  <div>
                    <div style={{ width: "32px", height: "32px", margin: "0 auto", borderRadius: "50%", backgroundColor: "#f59e0b", color: "#000", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>
                      3
                    </div>
                    <span style={{ fontSize: "10px", color: "#ffffff", marginTop: "4px", display: "block" }}>UPI QR</span>
                  </div>
                  <div>
                    <div style={{ width: "32px", height: "32px", margin: "0 auto", borderRadius: "50%", backgroundColor: "#f59e0b", color: "#000", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>
                      4
                    </div>
                    <span style={{ fontSize: "10px", color: "#ffffff", marginTop: "4px", display: "block" }}>UTR #</span>
                  </div>
                  <div>
                    <div style={{ width: "32px", height: "32px", margin: "0 auto", borderRadius: "50%", backgroundColor: "#063814", color: "#34d399", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", border: "1px solid rgba(16, 185, 129, 0.4)" }}>
                      5
                    </div>
                    <span style={{ fontSize: "10px", color: "rgba(167, 243, 208, 0.7)", marginTop: "4px", display: "block" }}>Verify</span>
                  </div>
                </div>
              </div>

              {/* Registration Form Inputs */}
              <form style={{ display: "flex", flexDirection: "column", gap: "16px" }} onSubmit={handleRegistrationSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", textTransform: "uppercase", color: "#a7f3d0", marginBottom: "6px" }}>
                      Full Player Name
                    </label>
                    <input
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "12px",
                        backgroundColor: "rgba(4, 37, 12, 0.8)",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        color: "#ffffff",
                        fontSize: "14px",
                        outline: "none"
                      }}
                      placeholder="e.g. Virat Sharma"
                      required
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", textTransform: "uppercase", color: "#a7f3d0", marginBottom: "6px" }}>
                      WhatsApp / Phone Number
                    </label>
                    <input
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "12px",
                        backgroundColor: "rgba(4, 37, 12, 0.8)",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        color: "#ffffff",
                        fontSize: "14px",
                        outline: "none"
                      }}
                      placeholder="+91 98000 00000"
                      required
                      type="tel"
                      value={playerPhone}
                      onChange={(e) => setPlayerPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", textTransform: "uppercase", color: "#a7f3d0", marginBottom: "6px" }}>
                      Player Age &amp; Category
                    </label>
                    <select
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "12px",
                        backgroundColor: "rgba(4, 37, 12, 0.8)",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        color: "#ffffff",
                        fontSize: "14px",
                        outline: "none",
                        cursor: "pointer"
                      }}
                      value={playerAgeCategory}
                      onChange={(e) => setPlayerAgeCategory(e.target.value)}
                    >
                      <option value="Under 14 (Junior Category)">Under 14 (Junior Category)</option>
                      <option value="Under 19 (Youth Division)">Under 19 (Youth Division)</option>
                      <option value="Age 19–25 (Senior Franchise)">Age 19–25 (Senior Franchise)</option>
                      <option value="Club Team Captain Entry">Club Team Captain Entry</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", textTransform: "uppercase", color: "#a7f3d0", marginBottom: "6px" }}>
                      Primary Cricket Role
                    </label>
                    <select
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "12px",
                        backgroundColor: "rgba(4, 37, 12, 0.8)",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        color: "#ffffff",
                        fontSize: "14px",
                        outline: "none",
                        cursor: "pointer"
                      }}
                      value={playerRole}
                      onChange={(e) => setPlayerRole(e.target.value)}
                    >
                      <option value="Top-Order Batsman">Top-Order Batsman</option>
                      <option value="Wicketkeeper Batsman">Wicketkeeper Batsman</option>
                      <option value="All-Rounder (Pace/Spin)">All-Rounder (Pace/Spin)</option>
                      <option value="Fast Bowler (Express Pace)">Fast Bowler (Express Pace)</option>
                      <option value="Spin Bowler">Spin Bowler</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", textTransform: "uppercase", color: "#a7f3d0", marginBottom: "6px" }}>
                    Select Preferred Time Slot
                  </label>
                  <select
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      backgroundColor: "rgba(4, 37, 12, 0.8)",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      color: "#ffffff",
                      fontSize: "14px",
                      outline: "none",
                      cursor: "pointer"
                    }}
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                  >
                    <option value="Morning Slot (6:30 AM - 9:30 AM)">Morning Slot: 6:30 AM &ndash; 9:30 AM</option>
                    <option value="Day Slot (10:00 AM - 1:00 PM)">Day Slot: 10:00 AM &ndash; 1:00 PM</option>
                    <option value="Evening Slot (5:00 PM - 8:00 PM)">Evening Slot: 5:00 PM &ndash; 8:00 PM</option>
                    <option value="Night Slot (8:30 PM - 11:30 PM)">Night Slot: 8:30 PM &ndash; 11:30 PM</option>
                  </select>
                </div>

                {/* Step 3 & 4: UPI Payment & UTR Section with local QR Code */}
                <div
                  style={{
                    padding: "16px",
                    borderRadius: "16px",
                    backgroundColor: "rgba(4, 37, 12, 0.8)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px"
                  }}
                >
                  <div
                    style={{
                      width: "72px",
                      height: "72px",
                      minWidth: "72px",
                      borderRadius: "12px",
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid rgba(245, 158, 11, 0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "4px",
                      overflow: "hidden"
                    }}
                  >
                    <img
                      src={qrcodeImg}
                      alt="UPI QR Code"
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>

                  <div style={{ flex: 1, width: "100%" }}>
                    <label style={{ display: "block", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#fde68a", textTransform: "uppercase", fontWeight: 700, marginBottom: "4px" }}>
                      Step 4: Enter Bank UTR / Transaction ID
                    </label>
                    <input
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        border: "1px solid rgba(16, 185, 129, 0.4)",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "12px",
                        color: "#ffffff",
                        outline: "none"
                      }}
                      placeholder="12-digit UTR Number (e.g. 402918239012)"
                      required
                      type="text"
                      value={bankUtr}
                      onChange={(e) => setBankUtr(e.target.value)}
                    />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "rgba(167, 243, 208, 0.7)", marginTop: "4px", display: "block" }}>
                      UPI ID: league@cdscricket (Pay registration deposit to secure official match kit &amp; cap).
                    </span>
                  </div>
                </div>

                <button
                  className="gold-gradient-btn"
                  style={{ width: "100%", padding: "16px", borderRadius: "12px", fontSize: "13px" }}
                  type="submit"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>how_to_reg</span>
                  <span>SUBMIT REGISTRATION &amp; CONFIRM SLOT</span>
                </button>
              </form>

              {/* Success Notification Toast */}
              {regSuccess && (
                <div
                  style={{
                    padding: "16px",
                    borderRadius: "16px",
                    backgroundColor: "rgba(6, 78, 59, 0.95)",
                    border: "1px solid #34d399",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px"
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "#f59e0b" }}>check_circle</span>
                  <div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "14px", textTransform: "uppercase" }}>
                      Registration Successfully Received!
                    </div>
                    <div style={{ fontSize: "12px", color: "#d1fae5" }}>
                      Our league coordinator will confirm your kit size &amp; Yamunanagar match slot via WhatsApp shortly.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Note */}
            <div
              style={{
                padding: "14px 24px",
                backgroundColor: "rgba(4, 37, 12, 0.9)",
                borderTop: "1px solid rgba(13, 56, 22, 0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "12px",
                color: "rgba(167, 243, 208, 0.8)"
              }}
            >
              <span>Helpline: +91 98765 43210</span>
              <button
                style={{ background: "none", border: "none", color: "#a7f3d0", cursor: "pointer", textDecoration: "underline" }}
                onClick={closeRegistrationModal}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
             MODAL 2: VIDEO LIGHTBOX MODAL (Plays actual local MP4 video!)
             ========================================================================= */}
      {isVideoModalOpen && (
        <div
          className="cds-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeVideoModal();
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "920px",
              borderRadius: "24px",
              backgroundColor: "#000000",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              overflow: "hidden",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.95)",
              display: "flex",
              flexDirection: "column",
              animation: "popScale 0.25s ease-out"
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                backgroundColor: "#011a07",
                borderBottom: "1px solid rgba(13, 56, 22, 0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 800,
                  fontSize: "14px",
                  color: "#ffffff",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em"
                }}
              >
                {activeVideoTitle}
              </span>
              <button
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "#063814",
                  color: "#ffffff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                onClick={closeVideoModal}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>close</span>
              </button>
            </div>

            <div
              style={{
                position: "relative",
                aspectRatio: "16 / 9",
                width: "100%",
                backgroundColor: "#000000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <video
                controls
                autoPlay
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                src={activeVideoSrc}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;