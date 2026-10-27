import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, MapPin, ShieldCheck } from 'lucide-react';

export default function ContactUs() {
  return <div className="contact-page">
    <div className="contact-intro"><p className="page-eyebrow">LET US TALK CRICKET</p><h1>HERE FOR YOUR<br/><em>NEXT INNINGS.</em></h1><p>Questions about the league, registrations or your next match? Get in touch with the CDS Premier Cricket League team.</p></div>
    <div className="contact-grid">
      <article className="contact-card"><Mail/><h2>Write to the team</h2><p>For registration, match and payment enquiries.</p><a href="mailto:register@cdscricketleague.com">register@cdscricketleague.com</a></article>
      <article className="contact-card"><MapPin/><h2>Meet us at the ground</h2><p>Yamunanagar Ground Stadium<br/>Sector 14, Sports Enclave<br/>Yamunanagar, Haryana - 135001</p></article>
      <article className="contact-card"><ShieldCheck/><h2>League information</h2><p>Find the details you need before your next match.</p><Link to="/terms">Terms &amp; conditions</Link><p><Link to="/refund">Refund &amp; cancellation policy</Link></p></article>
    </div>
    <div className="contact-note"><div><h2>Your place on the pitch awaits.</h2><p>Explore the daily sessions and book your team's next match.</p></div><Link to="/playerRegistration">BOOK MATCH SLOT<ArrowUpRight size={18}/></Link></div>
  </div>;
}
