import {Link} from 'react-router-dom';
import {ArrowUpRight,MapPin,Mail} from 'lucide-react';
import './footer.css';

export default function Footer(){
 return <footer className="site-footer"><div className="site-footer-grid">
  <div><Link className="site-footer-brand" to="/"><img src="/image/cds-logo.jpeg" alt="CDS League logo"/><span>CDS<small>PREMIER CRICKET LEAGUE</small></span></Link><p>Franchise cricket, daily matches and championship moments at Yamunanagar Ground Stadium.</p><Link className="site-footer-cta" to="/playerRegistration">REGISTER AS PLAYER<ArrowUpRight size={17}/></Link></div>
  <div><h2>EXPLORE THE LEAGUE</h2><a href="/#tournament">Tournament details</a><a href="/#stadium">Stadium &amp; facilities</a><a href="/#time-slots">Daily match slots</a><Link to="/gallery">Match gallery</Link><a href="/#highlights">Video highlights</a></div>
  <div><h2>GET IN THE GAME</h2><Link to="/playerRegistration">Book a match slot</Link><Link to="/playerRegistration">Player registration</Link><Link to="/Ambala-Rising-Star">Ambala Rising Star</Link><Link to="/login">Login</Link><Link to="/contact">Contact the league</Link></div>
  <div><h2>YAMUNANAGAR GROUND</h2><p className="site-footer-detail"><MapPin size={17}/><span>Sector 14, Sports Enclave, Yamunanagar, Haryana – 135001</span></p><a className="site-footer-detail" href="mailto:register@cdscricketleague.com"><Mail size={17}/><span>register@cdscricketleague.com</span></a><p>Daily cricket · 3 match sessions</p></div>
 </div><div className="site-footer-bottom"><small>&copy; {new Date().getFullYear()} CDS Premier Cricket League.</small><div><Link to="/terms">Terms</Link><Link to="/privacy">Privacy policy</Link><Link to="/refund">Refund policy</Link></div></div></footer>;
}
