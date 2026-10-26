import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Header({ onOpenRegistration }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("HOME");
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e, tabName, targetId) => {
    e.preventDefault();
    setActiveTab(tabName);
    setIsMobileMenuOpen(false);

    if (targetId.startsWith("/")) {
      navigate(targetId);
      return;
    }

    if (location.pathname !== "/") {
      navigate(`/${targetId}`);
      return;
    }

    if (targetId === "#" || targetId === "#home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const element = document.querySelector(targetId);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleRegisterClick = () => {
    setIsMobileMenuOpen(false);
    if (typeof onOpenRegistration === "function") {
      onOpenRegistration("CDS Player Registration");
    } else {
      const event = new CustomEvent("open-cds-registration", {
        detail: "CDS Player Registration"
      });
      window.dispatchEvent(event);
      if (location.pathname !== "/") {
        navigate("/playerRegistration");
      }
    }
  };

  const handleLoginClick = () => {
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700;800&display=swap');

        /* Top Header Full-Width Bar with Home Page Emerald & Gold Theme */
        .cds-header-bar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: 'Space Grotesk', sans-serif;
          background: linear-gradient(to bottom, rgba(0, 24, 5, 0.96) 0%, rgba(0, 24, 5, 0.88) 70%, rgba(0, 24, 5, 0.7) 100%);
          border-bottom: 2px solid rgba(245, 158, 11, 0.35);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
        }

        .cds-header-bar.scrolled {
          background: rgba(0, 24, 5, 0.98);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 2px solid rgba(245, 158, 11, 0.55);
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.85), 0 0 15px rgba(245, 158, 11, 0.15);
        }

        .cds-header-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 14px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-sizing: border-box;
          transition: padding 0.3s ease;
          gap: 20px;
        }

        .cds-header-bar.scrolled .cds-header-container {
          padding: 10px 32px;
        }

        @media (max-width: 1024px) {
          .cds-header-container,
          .cds-header-bar.scrolled .cds-header-container {
            padding: 10px 20px;
          }
        }

        /* LEFT: USER'S ORIGINAL LOGO & BRAND */
        .cds-brand-section {
          display: flex;
          align-items: center;
          gap: 14px;
          text-decoration: none;
          cursor: pointer;
          user-select: none;
          flex-shrink: 0;
        }

        .cds-logo-wrapper {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          overflow: hidden;
          background: #001805;
          border: 2px solid #f59e0b;
          box-shadow: 0 0 16px rgba(245, 158, 11, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          flex-shrink: 0;
        }

        .cds-brand-section:hover .cds-logo-wrapper {
          transform: scale(1.08) rotate(2deg);
          box-shadow: 0 0 24px rgba(245, 158, 11, 0.7);
        }

        .cds-logo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .cds-brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1.15;
        }

        .cds-brand-title {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: 16px;
          letter-spacing: 0.04em;
          color: #ffffff;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .cds-brand-title span {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .cds-brand-sub {
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          font-size: 11px;
          letter-spacing: 0.1em;
          color: #34d399;
          text-transform: uppercase;
          margin-top: 2px;
          white-space: nowrap;
        }

        @media (max-width: 640px) {
          .cds-brand-title {
            font-size: 13.5px;
          }
          .cds-brand-sub {
            display: none;
          }
          .cds-logo-wrapper {
            width: 46px;
            height: 46px;
          }
        }

        /* CENTER: NAVIGATION LINKS */
        .cds-nav-menu {
          display: flex;
          align-items: center;
          gap: 28px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        @media (max-width: 1080px) {
          .cds-nav-menu {
            display: none;
          }
        }

        .cds-nav-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .cds-nav-link {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13.5px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #d1fae5;
          text-decoration: none;
          transition: color 0.25s ease;
          padding: 6px 0;
          display: block;
        }

        .cds-nav-link:hover,
        .cds-nav-link.active {
          color: #f59e0b;
        }

        /* Active Gold Underline Indicator beneath active item */
        .cds-active-bar {
          width: 24px;
          height: 3px;
          background-color: #f59e0b;
          border-radius: 9999px;
          margin-top: 2px;
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.85);
        }

        /* RIGHT: DESKTOP ACTION BUTTONS */
        .cds-desktop-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        @media (max-width: 960px) {
          .cds-desktop-actions {
            display: none;
          }
        }

        /* Register As Player Button */
        .cds-header-register-btn {
          border-radius: 50px;
          padding: 10px 22px;
          background: rgba(245, 158, 11, 0.12);
          color: #fde68a;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border: 1.5px solid rgba(245, 158, 11, 0.55);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.25s ease;
          text-decoration: none;
        }

        .cds-header-register-btn:hover {
          background: rgba(245, 158, 11, 0.25);
          color: #ffffff;
          border-color: #f59e0b;
          transform: translateY(-2px);
          box-shadow: 0 4px 18px rgba(245, 158, 11, 0.35);
        }

        /* Log-In Button (Gold Gradient Pill) */
        .cds-header-login-btn {
          border-radius: 50px;
          padding: 10px 24px;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
          color: #001805;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: 13px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: none;
          box-shadow: 0 4px 18px rgba(245, 158, 11, 0.45);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.25s ease;
          text-decoration: none;
        }

        .cds-header-login-btn:hover {
          background: linear-gradient(135deg, #fef08a 0%, #fbbf24 50%, #d97706 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(245, 158, 11, 0.7);
        }

        /* MOBILE HAMBURGER BUTTON */
        .cds-mobile-toggle {
          display: none;
          background: rgba(7, 47, 16, 0.75);
          border: 1px solid rgba(245, 158, 11, 0.4);
          border-radius: 10px;
          width: 42px;
          height: 42px;
          align-items: center;
          justify-content: center;
          color: #f59e0b;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        @media (max-width: 960px) {
          .cds-mobile-toggle {
            display: flex;
          }
        }

        /* MOBILE MENU DROPDOWN */
        .cds-mobile-dropdown {
          position: fixed;
          top: 76px;
          left: 16px;
          right: 16px;
          background: rgba(0, 24, 5, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(245, 158, 11, 0.4);
          border-radius: 20px;
          padding: 22px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.95), 0 0 25px rgba(245, 158, 11, 0.2);
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 999;
          animation: cdsSlideDown 0.25s ease-out;
        }

        @keyframes cdsSlideDown {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .cds-mobile-item {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #ecfdf5;
          text-decoration: none;
          padding: 12px 16px;
          border-radius: 10px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(7, 47, 16, 0.4);
          border: 1px solid rgba(52, 211, 153, 0.15);
          cursor: pointer;
        }

        .cds-mobile-item:hover,
        .cds-mobile-item.active {
          color: #f59e0b;
          background: rgba(245, 158, 11, 0.15);
          border-color: rgba(245, 158, 11, 0.4);
          border-left: 4px solid #f59e0b;
        }
      `}</style>

      <header className={`cds-header-bar ${isScrolled ? "scrolled" : ""}`}>
        <div className="cds-header-container">
          {/* LEFT: USER'S ORIGINAL LOGO AND LEAGUE TITLE */}
          <div
            className="cds-brand-section"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              if (location.pathname !== "/") navigate("/");
            }}
            onMouseEnter={() => setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
          >
            <div className="cds-logo-wrapper">
              <img
                src="/image/cds-logo.jpeg"
                alt="CDS LOGO"
                className="cds-logo-img"
              />
            </div>
            <div className="cds-brand-text">
              <div className="cds-brand-title">
                <span>CDS</span> PREMIER CRICKET LEAGUE
              </div>
              <div className="cds-brand-sub">
                Daily Professional Cricket Tournament
              </div>
            </div>
          </div>

          {/* CENTER: DESKTOP NAVIGATION LINKS */}
          <ul className="cds-nav-menu">
            <li className="cds-nav-item">
              <a
                href="#home"
                className={`cds-nav-link ${activeTab === "HOME" ? "active" : ""}`}
                onClick={(e) => handleNavClick(e, "HOME", "#home")}
              >
                HOME
              </a>
              {activeTab === "HOME" && <div className="cds-active-bar" />}
            </li>

            <li className="cds-nav-item">
              <a
                href="#tournament"
                className={`cds-nav-link ${activeTab === "TOURNAMENT" ? "active" : ""}`}
                onClick={(e) => handleNavClick(e, "TOURNAMENT", "#tournament")}
              >
                TOURNAMENT
              </a>
              {activeTab === "TOURNAMENT" && <div className="cds-active-bar" />}
            </li>

            <li className="cds-nav-item">
              <a
                href="#stadium"
                className={`cds-nav-link ${activeTab === "STADIUM" ? "active" : ""}`}
                onClick={(e) => handleNavClick(e, "STADIUM", "#stadium")}
              >
                STADIUM
              </a>
              {activeTab === "STADIUM" && <div className="cds-active-bar" />}
            </li>

            <li className="cds-nav-item">
              <a
                href="#slots"
                className={`cds-nav-link ${activeTab === "SLOTS" ? "active" : ""}`}
                onClick={(e) => handleNavClick(e, "SLOTS", "#slots")}
              >
                MATCH SLOTS
              </a>
              {activeTab === "SLOTS" && <div className="cds-active-bar" />}
            </li>

            <li className="cds-nav-item">
              <a
                href="/gallery"
                className={`cds-nav-link ${activeTab === "GALLERY" ? "active" : ""}`}
                onClick={(e) => handleNavClick(e, "GALLERY", "/gallery")}
              >
                GALLERY
              </a>
              {activeTab === "GALLERY" && <div className="cds-active-bar" />}
            </li>
          </ul>

          {/* RIGHT: DESKTOP FUNCTIONALITY BUTTONS */}
          <div className="cds-desktop-actions">
            <button
              className="cds-header-register-btn"
              onClick={handleRegisterClick}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#f59e0b" }}>
                how_to_reg
              </span>
              <span>Register As Player</span>
            </button>

            <button
              className="cds-header-login-btn"
              onClick={handleLoginClick}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                login
              </span>
              <span>LOG-IN</span>
            </button>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            className="cds-mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {isMobileMenuOpen && (
          <div className="cds-mobile-dropdown">
            <button
              className="cds-mobile-item"
              onClick={() => {
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
                if (location.pathname !== "/") navigate("/");
              }}
            >
              <span>Home</span>
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                home
              </span>
            </button>

            <button
              className="cds-mobile-item"
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate("/playerRegistration");
              }}
            >
              <span>Register As Player</span>
              <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#f59e0b" }}>
                how_to_reg
              </span>
            </button>

            <button
              className="cds-mobile-item"
              onClick={handleLoginClick}
            >
              <span>Log-In</span>
              <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#f59e0b" }}>
                login
              </span>
            </button>

            <button
              className="cds-mobile-item"
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate("/gallery");
              }}
            >
              <span>Gallery</span>
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                photo_library
              </span>
            </button>

            <button
              className="cds-mobile-item"
              onClick={(e) => handleNavClick(e, "TOURNAMENT", "#tournament")}
            >
              <span>Tournament Details</span>
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                trophy
              </span>
            </button>

            <button
              className="cds-mobile-item"
              onClick={(e) => handleNavClick(e, "STADIUM", "#stadium")}
            >
              <span>Stadium Showcase</span>
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                stadium
              </span>
            </button>
          </div>
        )}
      </header>
    </>
  );
}

export default Header;