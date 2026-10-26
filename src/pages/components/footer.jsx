import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const handleAnchorClick = (e, targetId) => {
    if (window.location.pathname === "/") {
      const element = document.querySelector(targetId);
      if (element) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

        .cds-footer {
          width: 100%;
          background-color: #000d03;
          color: rgba(167, 243, 208, 0.85);
          padding-top: 70px;
          padding-bottom: 45px;
          border-top: 1px solid rgba(13, 56, 22, 0.8);
          font-family: 'Outfit', sans-serif;
          position: relative;
          box-sizing: border-box;
        }

        .cds-footer-container {
          max-width: 1280px;
          margin-left: auto;
          margin-right: auto;
          padding-left: 24px;
          padding-right: 24px;
          box-sizing: border-box;
        }

        .cds-footer-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
          padding-bottom: 50px;
          border-bottom: 1px solid rgba(16, 185, 129, 0.2);
          box-sizing: border-box;
        }

        @media (max-width: 1024px) {
          .cds-footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 35px;
          }
        }

        @media (max-width: 640px) {
          .cds-footer-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }

        .cds-footer-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .cds-footer-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cds-footer-logo-box {
          width: 44px;
          height: 44px;
          min-width: 44px;
          min-height: 44px;
          border-radius: 12px;
          background: #022009;
          border: 1px solid rgba(245, 158, 11, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          overflow: hidden;
          box-sizing: border-box;
        }

        .cds-footer-logo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 10px;
          display: block;
        }

        .cds-footer-title {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 900;
          font-size: 18px;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .cds-footer-text {
          font-size: 13px;
          line-height: 1.6;
          color: rgba(167, 243, 208, 0.75);
          margin: 0;
        }

        .cds-social-icons {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 6px;
        }

        .cds-social-btn {
          width: 36px;
          height: 36px;
          min-width: 36px;
          min-height: 36px;
          border-radius: 9px;
          background: #04250c;
          border: 1px solid rgba(16, 185, 129, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a7f3d0;
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .cds-social-btn:hover {
          color: #f59e0b;
          border-color: #f59e0b;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35);
        }

        .cds-footer-heading {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: 14px;
          color: #f59e0b;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 4px;
        }

        .cds-footer-links {
          display: flex;
          flex-direction: column;
          gap: 10px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .cds-footer-link {
          color: rgba(167, 243, 208, 0.75);
          text-decoration: none;
          font-size: 13px;
          transition: color 0.2s ease, transform 0.2s ease;
        }

        .cds-footer-link:hover {
          color: #fde68a;
          transform: translateX(3px);
        }

        .cds-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13px;
          color: rgba(167, 243, 208, 0.75);
          line-height: 1.5;
        }

        .cds-status-card {
          padding: 14px 16px;
          border-radius: 12px;
          background: rgba(4, 37, 12, 0.75);
          border: 1px solid rgba(16, 185, 129, 0.3);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
        }

        .cds-bottom-strip {
          padding-top: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: rgba(167, 243, 208, 0.55);
          flex-wrap: wrap;
          gap: 16px;
        }

        .cds-bottom-links {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .cds-bottom-link {
          color: rgba(167, 243, 208, 0.55);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .cds-bottom-link:hover {
          color: #f59e0b;
        }
      `}</style>

      <footer className="cds-footer" id="contact">
        <div className="cds-footer-container">
          <div className="cds-footer-grid">
            {/* Col 1: Brand Info */}
            <div className="cds-footer-col">
              <div className="cds-footer-brand">
                <div className="cds-footer-logo-box">
                  <img
                    src="/image/cds-logo.jpeg"
                    alt="CDS League Logo"
                    className="cds-footer-logo-img"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ width: "22px", height: "22px", display: "none" }}
                  >
                    <circle cx="12" cy="12" r="6" stroke="#f59e0b" strokeDasharray="2 2" />
                    <path d="M12 6v12" />
                    <path d="M6 10c-1.5 2-1.5 4 0 6" />
                    <path d="M18 10c1.5 2 1.5 4 0 6" />
                    <path d="M4.5 17c2 2.5 5 3.5 7.5 3.5s5.5-1 7.5-3.5" />
                    <path d="M7 4l1 2" />
                    <path d="M17 4l-1 2" />
                  </svg>
                </div>
                <span className="cds-footer-title">CDS Premier League</span>
              </div>

              <p className="cds-footer-text">
                The peak of high-stakes franchise cricket, hosted live under international stadium floodlights at Yamunanagar
                Ground Stadium.
              </p>

              <div className="cds-social-icons">
                <a
                  className="cds-social-btn"
                  href="https://cdscricketleague.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Official Website"
                  title="Official Website"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: "16px", height: "16px" }}>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                  </svg>
                </a>
                <a
                  className="cds-social-btn"
                  href="#tournament"
                  onClick={(e) => handleAnchorClick(e, "#tournament")}
                  aria-label="Tournament"
                  title="Tournament Info"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: "16px", height: "16px" }}>
                    <path d="M6 12l6-6 6 6M6 18l6-6 6 6" />
                  </svg>
                </a>
                <a
                  className="cds-social-btn"
                  href="#highlights"
                  onClick={(e) => handleAnchorClick(e, "#highlights")}
                  aria-label="Broadcast Highlights"
                  title="Video Highlights"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: "16px", height: "16px" }}>
                    <path d="M15 10l5-5v14l-5-5M4 6h11a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div className="cds-footer-col">
              <span className="cds-footer-heading">Quick Navigation</span>
              <ul className="cds-footer-links">
                <li>
                  <a className="cds-footer-link" href="#tournament" onClick={(e) => handleAnchorClick(e, "#tournament")}>
                    Tournament Schedule &amp; Bracket
                  </a>
                </li>
                <li>
                  <a className="cds-footer-link" href="#stadium" onClick={(e) => handleAnchorClick(e, "#stadium")}>
                    Stadium &amp; Pavilion Seating
                  </a>
                </li>
                <li>
                  <a className="cds-footer-link" href="#time-slots" onClick={(e) => handleAnchorClick(e, "#time-slots")}>
                    Daily Fixture Slots &amp; Net Practice
                  </a>
                </li>
                <li>
                  <a className="cds-footer-link" href="#gallery" onClick={(e) => handleAnchorClick(e, "#gallery")}>
                    Ground Photographic Gallery
                  </a>
                </li>
                <li>
                  <a className="cds-footer-link" href="#highlights" onClick={(e) => handleAnchorClick(e, "#highlights")}>
                    Broadcast Highlights &amp; Super Overs
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Stadium Headquarters */}
            <div className="cds-footer-col">
              <span className="cds-footer-heading">Stadium Headquarters</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div className="cds-contact-item">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    style={{ width: "18px", height: "18px", minWidth: "18px", minHeight: "18px", marginTop: "2px" }}
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                  <span>Yamunanagar Ground Stadium Complex, Sector 14, Sports Enclave, Haryana &ndash; 135001</span>
                </div>

                <div className="cds-contact-item" style={{ alignItems: "center" }}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    style={{ width: "18px", height: "18px", minWidth: "18px", minHeight: "18px" }}
                  >
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  <span style={{ color: "#ffffff", fontWeight: "700", fontFamily: "'JetBrains Mono', monospace" }}>
                    +91 98765 43210
                  </span>
                </div>

                <div className="cds-contact-item" style={{ alignItems: "center" }}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    style={{ width: "18px", height: "18px", minWidth: "18px", minHeight: "18px" }}
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span style={{ color: "#ecfdf5" }}>register@cdscricketleague.com</span>
                </div>
              </div>
            </div>

            {/* Col 4: Match Centre & Status */}
            <div className="cds-footer-col">
              <span className="cds-footer-heading">Official Match Centre</span>
              <p className="cds-footer-text">
                Player entries and match timing queries are monitored round-the-clock by certified match referees and league directors.
              </p>
              <div className="cds-status-card">
                <span style={{ textTransform: "uppercase", letterSpacing: "0.08em", color: "#ffffff", fontWeight: "600" }}>
                  Stadium Gates Open
                </span>
                <span style={{ color: "#f59e0b", fontWeight: "800" }}>05:30 IST</span>
              </div>
            </div>
          </div>

          {/* Copyright Strip */}
          <div className="cds-bottom-strip">
            <p style={{ margin: 0 }}>&copy; 2025&ndash;2026 CDS Cricket Premier League. All tournament rights reserved.</p>
            <div className="cds-bottom-links">
              <Link to="/terms" className="cds-bottom-link">
                Tournament Regulations
              </Link>
              <Link to="/terms" className="cds-bottom-link">
                Match Terms
              </Link>
              <Link to="/privacy" className="cds-bottom-link">
                Privacy Policy
              </Link>
              <Link to="/refund" className="cds-bottom-link">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
