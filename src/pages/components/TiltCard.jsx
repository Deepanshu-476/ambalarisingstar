import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion as Motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import "./TiltCard.css";

export default function TiltCard() {
  const cardRef = useRef(null);

  // Framer Motion spring physics matching Nexinfosoft (stiffness 120, damping 18)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(mouseY, { stiffness: 120, damping: 18 });
  const rotateY = useSpring(mouseX, { stiffness: 120, damping: 18 });

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;

    // Smooth ±6 degrees 3D tilt
    mouseX.set(xPct * 6);
    mouseY.set(-yPct * 6);

    // Update CSS variables for dynamic spotlight following cursor
    card.style.setProperty("--cx", `${e.clientX - rect.left}px`);
    card.style.setProperty("--cy", `${e.clientY - rect.top}px`);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="ck-join-perspective-wrapper">
      <Motion.section
        ref={cardRef}
        className="ck-join ck-join--3d"
        id="register-banner"
        style={{
          rotateX,
          rotateY,
          transformPerspective: 1400,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Animated Grid Shift Background */}
        <span className="ck-join__grid" aria-hidden="true" />

        {/* Dynamic Spotlight Following Cursor */}
        <span className="ck-join__spotlight" aria-hidden="true" />

        {/* Original Content: Left Column */}
        <div className="ck-join__copy">
          <p className="ck-kicker">DIRECT FAST-TRACK ENROLMENT</p>
          <h2>
            <span className="cds-zoom-word">READY</span>{" "}
            <span className="cds-zoom-word">TO</span>{" "}
            <span className="cds-zoom-word">PLAY</span><br />
            <span className="cds-zoom-word">PROFESSIONAL</span>{" "}
            <span className="cds-zoom-word">CRICKET?</span>
          </h2>
          <p>
            Register now and secure your spot in the CDS Cricket Premier League.
            Limited slots available for each time session!
          </p>
        </div>

        {/* Original Content: Right Column Actions */}
        <div className="cds-registration-links ck-join__actions">
          <Link className="ck-button" to="/playerRegistration">
            <span>REGISTER FOR CDS CRICKET LEAGUE</span>
            <ArrowUpRight size={20} />
          </Link>
          <Link className="cds-text-link" to="/Ambala-Rising-Star">
            <span>AMBALA RISING STAR CRICKET LEAGUE</span>
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </Motion.section>
    </div>
  );
}
