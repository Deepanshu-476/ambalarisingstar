import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import "./privacy_policy.css";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("section-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Scroll to top when page opens
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Copy email handler
  const handleCopyEmail = () => {
    navigator.clipboard.writeText("cdspremierleague@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  // Smooth scroll to section
  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const tocItems = [
    { id: "section-1", title: "1. Overview & Organization" },
    { id: "section-2", title: "2. Information We Collect" },
    { id: "section-3", title: "3. How We Use Your Data" },
    { id: "section-4", title: "4. Payments & Razorpay Security" },
    { id: "section-5", title: "5. Media, Photography & Streaming" },
    { id: "section-6", title: "6. Medical & Emergency Info" },
    { id: "section-7", title: "7. Cookies & Local Storage" },
    { id: "section-8", title: "8. Data Sharing & Third Parties" },
    { id: "section-9", title: "9. Data Security & Retention" },
    { id: "section-10", title: "10. Your Rights & Minor Protection" },
    { id: "section-11", title: "11. Grievance & Contact Us" },
    { id: "section-12", title: "12. Frequently Asked Questions" },
  ];

  return (
    <div className="privacy-page-wrapper">
      <Header />

      {/* Hero Section */}
      <section className="privacy-hero">
        <div className="privacy-hero-content">
          <div className="privacy-badge-group">
            <span className="privacy-badge">
              <i className="fas fa-shield-alt"></i> Official Legal Policy
            </span>
            <span className="privacy-badge status">
              <i className="fas fa-check-circle"></i> DPDP Act (2023) & IT Act Compliant
            </span>
            <span className="privacy-badge">
              <i className="fas fa-lock"></i> Razorpay Verified Gateway
            </span>
          </div>

          <h1 className="privacy-hero-title">Privacy Policy</h1>
          <p className="privacy-hero-subtitle">
            CDS Cricket Premier League is committed to safeguarding your personal information.
            This policy outlines how we collect, handle, protect, and use data across tournament
            registrations, slot bookings, player profiles, and our official digital platforms.
          </p>

          <div className="privacy-meta-row">
            <div className="privacy-meta-item">
              <i className="fas fa-calendar-alt"></i>
              <span>Effective Date: <strong>January 1, 2025</strong></span>
            </div>
            <div className="privacy-meta-item">
              <i className="fas fa-sync-alt"></i>
              <span>Last Updated: <strong>October 2025 (Active Season)</strong></span>
            </div>
            <div className="privacy-meta-item">
              <i className="fas fa-building"></i>
              <span>Organized by: <strong>CIIS - Career Infowis IT Solutions Pvt Ltd</strong></span>
            </div>

            <div className="privacy-actions">
              <button
                className="privacy-btn privacy-btn-outline"
                onClick={() => navigate("/")}
                title="Return to Home page"
              >
                <i className="fas fa-arrow-left"></i> Back to Home
              </button>
              <button
                className="privacy-btn privacy-btn-gold"
                onClick={handlePrint}
                title="Print or save as PDF"
              >
                <i className="fas fa-print"></i> Print Policy
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Banner */}
      <section className="privacy-highlights-section">
        <div className="privacy-highlights-grid">
          <div className="privacy-highlight-card">
            <div className="highlight-icon-box green">
              <i className="fas fa-user-shield"></i>
            </div>
            <h3>Transparent Data Use</h3>
            <p>
              Your contact and registration data are used exclusively for tournament
              organization, ground slot allocation, and official match fixtures.
            </p>
          </div>

          <div className="privacy-highlight-card">
            <div className="highlight-icon-box">
              <i className="fas fa-credit-card"></i>
            </div>
            <h3>Razorpay 100% Secure</h3>
            <p>
              All online transactions are encrypted via Razorpay. We never store credit/debit
              card credentials, UPI PINs, or CVVs on our servers.
            </p>
          </div>

          <div className="privacy-highlight-card">
            <div className="highlight-icon-box blue">
              <i className="fas fa-video"></i>
            </div>
            <h3>Broadcasting & Photos</h3>
            <p>
              Live streams and tournament photos capture the spirit of cricket at Yamuna Ground.
              Media rights are managed transparently for sports promotion.
            </p>
          </div>

          <div className="privacy-highlight-card">
            <div className="highlight-icon-box purple">
              <i className="fas fa-ban"></i>
            </div>
            <h3>Zero Ad Selling</h3>
            <p>
              We strictly do not sell, rent, or trade your personal details to third-party
              marketing agencies or unsolicited advertisers.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="privacy-main-container">
        {/* Sticky Table of Contents Sidebar */}
        <aside className="privacy-sidebar">
          <div className="privacy-sidebar-header">
            <h4>
              <i className="fas fa-list-ul"></i> Quick Navigation
            </h4>
          </div>

          <ul className="privacy-toc-list">
            {tocItems.map((item, idx) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`privacy-toc-link ${activeSection === item.id ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.id);
                  }}
                >
                  <span className="toc-num">{idx + 1}.</span>
                  <span>{item.title.replace(/^\d+\.\s*/, "")}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="sidebar-contact-card">
            <h5>Need Assistance?</h5>
            <p>Have questions about your data or player registration profile?</p>
            <button
              onClick={handleCopyEmail}
              className="privacy-btn privacy-btn-gold"
              style={{ width: "100%", justifyContent: "center", fontSize: "0.8rem", padding: "0.45rem" }}
            >
              <i className={copiedEmail ? "fas fa-check" : "fas fa-copy"}></i>
              {copiedEmail ? "Email Copied!" : "Copy Support Email"}
            </button>
          </div>
        </aside>

        {/* Content Clauses */}
        <main className="privacy-content-stream">
          {/* Section 1 */}
          <article id="section-1" className="privacy-section-card">
            <div className="privacy-section-header">
              <div className="section-icon-badge">
                <i className="fas fa-info-circle"></i>
              </div>
              <div className="section-title-wrap">
                <span className="section-tag">Clause 1</span>
                <h2>Overview & Organization Scope</h2>
              </div>
            </div>
            <div className="privacy-section-body">
              <p>
                <strong>CDS Cricket Premier League</strong> ("we", "our", "us", or "the League")
                operates the cricket platform and tournaments at Yamuna Ground Stadium, Yamunanagar,
                Haryana. The initiative is professionally managed and organized by{" "}
                <strong>CIIS - Career Infowis IT Solutions Pvt Ltd</strong> to discover, nurture,
                and showcase youth cricket talent across North India.
              </p>
              <p>
                This Privacy Policy applies to all individuals ("Users", "Participants", "Players",
                "Captains", "Spectators") who access our official website, register for tournaments
                (including the CDS Premier League, Ambala Rising Star, and Champions Trophy), book
                practice slots, or communicate with our management.
              </p>
              <div className="privacy-callout">
                <div className="privacy-callout-header">
                  <i className="fas fa-balance-scale"></i> Legal Framework
                </div>
                <p>
                  This policy is formulated in compliance with the <strong>Information Technology Act, 2000</strong>,
                  the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal
                  Data or Information) Rules, 2011, and the <strong>Digital Personal Data Protection Act (DPDP Act, 2023)</strong> of India.
                </p>
              </div>
            </div>
          </article>

          {/* Section 2 */}
          <article id="section-2" className="privacy-section-card">
            <div className="privacy-section-header">
              <div className="section-icon-badge">
                <i className="fas fa-id-card"></i>
              </div>
              <div className="section-title-wrap">
                <span className="section-tag">Clause 2</span>
                <h2>Information We Collect</h2>
              </div>
            </div>
            <div className="privacy-section-body">
              <p>
                We collect personal information necessary to organize tournaments, verify participant
                eligibility, allot match slots, and process payments securely.
              </p>

              <div className="privacy-inner-grid">
                <div className="privacy-inner-card">
                  <h4><i className="fas fa-user"></i> Player Details</h4>
                  <p>Full Name, Date of Birth, Age, Gender, Playing Role (Batsman, Bowler, All-Rounder, Wicketkeeper), Jersey Size, and Profile Photo.</p>
                </div>

                <div className="privacy-inner-card">
                  <h4><i className="fas fa-phone-alt"></i> Contact Details</h4>
                  <p>Mobile Number, WhatsApp Number, Email Address, and Residential City/State for match timing alerts and schedule communications.</p>
                </div>

                <div className="privacy-inner-card">
                  <h4><i className="fas fa-users-cog"></i> Team & Captain Data</h4>
                  <p>Team Name, Captain Name, Roster List, Player Roles, and Captain Login Credentials for the Captain Dashboard.</p>
                </div>

                <div className="privacy-inner-card">
                  <h4><i className="fas fa-certificate"></i> Eligibility Verification</h4>
                  <p>Age verification documents (Aadhaar Card, Birth Certificate) required for Junior Leagues (e.g. Under-14 / Under-16) to ensure fair play.</p>
                </div>
              </div>

              <p>
                <strong>Payment & Transaction Information:</strong> When you pay registration fees or
                book stadium slots, our payment partner (Razorpay) collects payment tokens. We record
                the transaction ID, amount paid, payment method type (UPI, Card, Net Banking), and status.
                <strong> We do not store credit card numbers, CVVs, or bank passwords.</strong>
              </p>
            </div>
          </article>

          {/* Section 3 */}
          <article id="section-3" className="privacy-section-card">
            <div className="privacy-section-header">
              <div className="section-icon-badge">
                <i className="fas fa-tasks"></i>
              </div>
              <div className="section-title-wrap">
                <span className="section-tag">Clause 3</span>
                <h2>How We Use Your Information</h2>
              </div>
            </div>
            <div className="privacy-section-body">
              <p>Your data is processed strictly for legitimate sporting and operational purposes:</p>
              <ul>
                <li><strong>Tournament Scheduling:</strong> Preparing official match fixtures, stadium slot calendar allotments, and team brackets.</li>
                <li><strong>Player Identification:</strong> Creating match team rosters, issuing official player ID cards, and verifying eligibility.</li>
                <li><strong>Official Scoring & Leaderboards:</strong> Publishing player match statistics, run tallies, bowling averages, and Player of the Match awards.</li>
                <li><strong>Alerts & Notifications:</strong> Sending updates regarding match timings, ground changes, weather delays, and event guidelines via SMS, WhatsApp, or Email.</li>
                <li><strong>Financial Accounting:</strong> Generating digital booking receipts, tracking registration payments, and auditing transaction logs.</li>
                <li><strong>Security & Safety:</strong> Ground gate security at Yamuna Ground Stadium and preventing unauthorized player substitutions.</li>
              </ul>
            </div>
          </article>

          {/* Section 4 */}
          <article id="section-4" className="privacy-section-card">
            <div className="privacy-section-header">
              <div className="section-icon-badge">
                <i className="fas fa-shield-check"></i>
              </div>
              <div className="section-title-wrap">
                <span className="section-tag">Clause 4</span>
                <h2>Online Payments & Razorpay Security</h2>
              </div>
            </div>
            <div className="privacy-section-body">
              <p>
                All financial transactions on our platform—including tournament entry fees, junior league
                enrolments, and stadium slot reservations—are handled through our secure payment gateway partner:
                <strong> Razorpay Software Private Limited</strong>.
              </p>

              <div className="privacy-callout success">
                <div className="privacy-callout-header">
                  <i className="fas fa-lock"></i> PCI-DSS Level 1 Encryption
                </div>
                <p>
                  Razorpay is certified under PCI-DSS Level 1 compliance and uses military-grade 256-bit SSL encryption.
                  Your card details, bank credentials, and UPI authorizations are processed directly by the banking
                  switch. CDS Premier League has no visibility or access to your financial passwords or card numbers.
                </p>
              </div>

              <p>
                In the event of a failed transaction, duplicate debit, or cancellation inquiry, please
                refer to our official <Link to="/refund" style={{ color: "var(--pp-primary)", fontWeight: "600" }}>Refund Policy</Link> or
                contact us with your Razorpay Payment ID.
              </p>
            </div>
          </article>

          {/* Section 5 */}
          <article id="section-5" className="privacy-section-card">
            <div className="privacy-section-header">
              <div className="section-icon-badge">
                <i className="fas fa-camera"></i>
              </div>
              <div className="section-title-wrap">
                <span className="section-tag">Clause 5</span>
                <h2>Media, Photography & Match Broadcasting</h2>
              </div>
            </div>
            <div className="privacy-section-body">
              <p>
                CDS Cricket Premier League matches are conducted in a public stadium environment
                (Yamuna Ground Stadium, Yamunanagar) with live audiences, professional sports photographers,
                and digital video broadcasting.
              </p>
              <ul>
                <li>
                  <strong>Live Streaming:</strong> Matches may be broadcast live on official YouTube,
                  social media channels, and tournament apps for cricket fans and talent scouts.
                </li>
                <li>
                  <strong>Action Photography:</strong> Photos of matches, celebration moments, and award
                  ceremonies are published in the Match Gallery, social media highlights, and tournament press releases.
                </li>
                <li>
                  <strong>Consent Notice:</strong> By participating in or attending the tournament, players
                  and team officials grant CDS Premier League non-exclusive rights to display match gameplay
                  recordings and player statistics.
                </li>
                <li>
                  <strong>Privacy Concerns:</strong> If a player or parent has a valid privacy concern
                  regarding a specific photograph or video, they can email us at{" "}
                  <strong>cdspremierleague@gmail.com</strong> for editorial review.
                </li>
              </ul>
            </div>
          </article>

          {/* Section 6 */}
          <article id="section-6" className="privacy-section-card">
            <div className="privacy-section-header">
              <div className="section-icon-badge">
                <i className="fas fa-heartbeat"></i>
              </div>
              <div className="section-title-wrap">
                <span className="section-tag">Clause 6</span>
                <h2>Health & Emergency Medical Information</h2>
              </div>
            </div>
            <div className="privacy-section-body">
              <p>
                Cricket is an active outdoor sport. In registration forms, we may request an emergency
                contact number or critical health declaration (e.g. severe allergies or physical limitations).
              </p>
              <p>
                This sensitive data is accessible solely by the on-ground medical and first-aid crew
                stationed at Yamuna Ground Stadium. It is never utilized for marketing or shared outside
                immediate emergency medical requirements.
              </p>
            </div>
          </article>

          {/* Section 7 */}
          <article id="section-7" className="privacy-section-card">
            <div className="privacy-section-header">
              <div className="section-icon-badge">
                <i className="fas fa-cookie-bite"></i>
              </div>
              <div className="section-title-wrap">
                <span className="section-tag">Clause 7</span>
                <h2>Cookies, Session Storage & Analytics</h2>
              </div>
            </div>
            <div className="privacy-section-body">
              <p>
                Our web application uses essential cookies and local browser storage to provide a seamless
                experience:
              </p>
              <div className="privacy-table-wrapper">
                <table className="privacy-table">
                  <thead>
                    <tr>
                      <th>Storage Type</th>
                      <th>Purpose</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Session Tokens</strong></td>
                      <td>Authenticates Admin and Captain Dashboards to protect team rosters.</td>
                      <td>Until Logout / Browser Close</td>
                    </tr>
                    <tr>
                      <td><strong>Popup State</strong></td>
                      <td>Remembers if you already viewed the season welcome video popup to avoid repeating it.</td>
                      <td>Current Session</td>
                    </tr>
                    <tr>
                      <td><strong>Payment Session</strong></td>
                      <td>Razorpay checkout SDK state for secure transaction confirmation.</td>
                      <td>Transaction Duration</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                You can configure your browser settings to reject cookies; however, dashboard logins
                and slot booking flows require active session storage.
              </p>
            </div>
          </article>

          {/* Section 8 */}
          <article id="section-8" className="privacy-section-card">
            <div className="privacy-section-header">
              <div className="section-icon-badge">
                <i className="fas fa-handshake"></i>
              </div>
              <div className="section-title-wrap">
                <span className="section-tag">Clause 8</span>
                <h2>Data Sharing & Third-Party Disclosure</h2>
              </div>
            </div>
            <div className="privacy-section-body">
              <p>
                We do not sell, trade, or rent personal identification data to any third party.
                Limited data exchange occurs solely under the following conditions:
              </p>
              <ul>
                <li><strong>Tournament Organizing Committee:</strong> Referees, umpires, and match scorers receive squad names and player jersey numbers.</li>
                <li><strong>Verified Service Providers:</strong> Trusted technical partners including payment processors (Razorpay), cloud hosting infrastructure, and transactional SMS providers.</li>
                <li><strong>Legal & Statutory Requirements:</strong> We may disclose information if required to comply with court orders, government requests, or Indian law enforcement investigations.</li>
              </ul>
            </div>
          </article>

          {/* Section 9 */}
          <article id="section-9" className="privacy-section-card">
            <div className="privacy-section-header">
              <div className="section-icon-badge">
                <i className="fas fa-database"></i>
              </div>
              <div className="section-title-wrap">
                <span className="section-tag">Clause 9</span>
                <h2>Data Security & Retention Period</h2>
              </div>
            </div>
            <div className="privacy-section-body">
              <p>
                We implement robust administrative, physical, and technical safeguards to prevent unauthorized
                access, disclosure, alteration, or destruction of your personal information:
              </p>
              <ul>
                <li><strong>HTTPS / SSL Encryption:</strong> All client-server communication is encrypted using modern TLS protocols.</li>
                <li><strong>Role-Based Access Control:</strong> Only authorized tournament officials with verified credentials can access administrative dashboards.</li>
                <li><strong>Retention Schedule:</strong> Player registration data is retained during the active tournament cycle. Historical tournament scores, records, and leaderboards are retained indefinitely as sports archives. Identity proofs submitted for junior verification are securely purged after verification.</li>
              </ul>
            </div>
          </article>

          {/* Section 10 */}
          <article id="section-10" className="privacy-section-card">
            <div className="privacy-section-header">
              <div className="section-icon-badge">
                <i className="fas fa-child"></i>
              </div>
              <div className="section-title-wrap">
                <span className="section-tag">Clause 10</span>
                <h2>Your Rights & Minor Protection (Under-18)</h2>
              </div>
            </div>
            <div className="privacy-section-body">
              <p>
                As a user and participant under India's Digital Personal Data Protection Act, you possess
                specific rights regarding your personal information:
              </p>
              <ul>
                <li><strong>Right to Review & Correct:</strong> You have the right to inspect your registered player profile and request corrections for misspellings, updated phone numbers, or changed jersey sizes.</li>
                <li><strong>Right to Erasure:</strong> You may request the deletion of non-essential registration records after the tournament conclusion, subject to statutory audit requirements.</li>
                <li><strong>Minors Protection (Under 18 Years):</strong> For junior leagues (e.g. Ambala Rising Star Under-14 / Under-16), registration must be verified by a parent or legal guardian. We do not track or profile minors for commercial advertising.</li>
              </ul>
            </div>
          </article>

          {/* Section 11 */}
          <article id="section-11" className="privacy-section-card">
            <div className="privacy-section-header">
              <div className="section-icon-badge">
                <i className="fas fa-headset"></i>
              </div>
              <div className="section-title-wrap">
                <span className="section-tag">Clause 11</span>
                <h2>Grievance Officer & Contact Information</h2>
              </div>
            </div>
            <div className="privacy-section-body">
              <p>
                If you have questions, feedback, or grievances regarding this Privacy Policy or how
                your personal data is handled, please contact our designated Grievance & Compliance Team:
              </p>

              <div className="privacy-contact-grid">
                <div className="contact-detail-box">
                  <div className="contact-detail-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="contact-detail-info">
                    <h4>Official Email</h4>
                    <p>
                      <a href="mailto:cdspremierleague@gmail.com">cdspremierleague@gmail.com</a>
                    </p>
                    <p style={{ marginTop: "4px", fontSize: "0.78rem" }}>Response within 48-72 business hours</p>
                  </div>
                </div>

                <div className="contact-detail-box">
                  <div className="contact-detail-icon">
                    <i className="fas fa-phone-volume"></i>
                  </div>
                  <div className="contact-detail-info">
                    <h4>Tournament Helpline</h4>
                    <p>
                      <a href="tel:+919876543210">+91 98765 43210</a>
                    </p>
                    <p style={{ marginTop: "4px", fontSize: "0.78rem" }}>Daily: 9:00 AM – 6:00 PM IST</p>
                  </div>
                </div>

                <div className="contact-detail-box">
                  <div className="contact-detail-icon">
                    <i className="fas fa-map-marked-alt"></i>
                  </div>
                  <div className="contact-detail-info">
                    <h4>Stadium & Office</h4>
                    <p>Yamuna Ground Cricket Stadium</p>
                    <p>Yamunanagar, Haryana - 135001, India</p>
                  </div>
                </div>

                <div className="contact-detail-box">
                  <div className="contact-detail-icon">
                    <i className="fas fa-building"></i>
                  </div>
                  <div className="contact-detail-info">
                    <h4>Organizing Entity</h4>
                    <p>CIIS - Career Infowis IT Solutions Pvt Ltd</p>
                    <p style={{ marginTop: "4px", fontSize: "0.78rem" }}>Affiliated Tournament Partner</p>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Section 12 - FAQ Accordion */}
          <article id="section-12" className="privacy-section-card">
            <div className="privacy-section-header">
              <div className="section-icon-badge">
                <i className="fas fa-question-circle"></i>
              </div>
              <div className="section-title-wrap">
                <span className="section-tag">Clause 12</span>
                <h2>Frequently Asked Privacy Questions</h2>
              </div>
            </div>
            <div className="privacy-section-body">
              {[
                {
                  q: "Is my online payment safe on the CDS Premier League website?",
                  a: "Yes, 100%. All transactions are processed through Razorpay's PCI-DSS Level 1 compliant gateway with 256-bit SSL encryption. We never store your debit/credit card numbers, CVVs, or UPI PINs on our servers."
                },
                {
                  q: "Why do you collect Aadhaar / ID documents for Junior tournaments?",
                  a: "Government ID or birth certificates are strictly used to verify age eligibility (e.g. Under-14 / Under-16) to ensure fair competition. These documents are kept strictly confidential and never published."
                },
                {
                  q: "Will my match photos and videos be published online?",
                  a: "Yes, tournament matches at Yamuna Ground are recorded and photographed for match leaderboards, live broadcasts, and sports promotion. If you have a specific privacy concern, contact our support team."
                },
                {
                  q: "Can I update my phone number or email address after registering?",
                  a: "Yes. You can contact our support helpline (+91 98765 43210) or email cdspremierleague@gmail.com with your Player ID and tournament name to update your details."
                }
              ].map((faq, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    marginBottom: "0.75rem",
                    overflow: "hidden"
                  }}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      background: openFaq === index ? "#f8fafc" : "#ffffff",
                      border: "none",
                      padding: "1rem 1.25rem",
                      fontSize: "0.95rem",
                      fontWeight: "700",
                      color: "var(--pp-dark)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "background 0.2s ease"
                    }}
                  >
                    <span><i className="fas fa-chevron-right" style={{
                      marginRight: "8px",
                      fontSize: "0.8rem",
                      color: "var(--pp-gold)",
                      transform: openFaq === index ? "rotate(90deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease"
                    }}></i>{faq.q}</span>
                    <i className={`fas fa-${openFaq === index ? "minus" : "plus"}`} style={{ fontSize: "0.75rem", color: "#64748b" }}></i>
                  </button>
                  {openFaq === index && (
                    <div style={{ padding: "1rem 1.25rem", background: "#f8fafc", borderTop: "1px solid #e2e8f0", fontSize: "0.9rem", color: "#475569", lineHeight: "1.6" }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </article>

          {/* Related Policy Links Bar */}
          <div className="privacy-related-links">
            <div className="related-title">
              <i className="fas fa-link" style={{ color: "var(--pp-gold)", marginRight: "6px" }}></i>
              Related Legal & Compliance Pages
            </div>
            <div className="related-chips">
              <Link to="/terms" className="related-chip">Terms & Conditions</Link>
              <Link to="/refund" className="related-chip">Refund & Cancellation Policy</Link>
              <Link to="/contact" className="related-chip">Contact Us</Link>
              <Link to="/" className="related-chip">Tournament Home</Link>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
