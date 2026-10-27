import { CalendarDays, ShieldCheck, Trophy, UsersRound } from "lucide-react";
import PublicPageCta from "./PublicPageCta";
import PublicPageLayout from "./PublicPageLayout";
import "./PublicPage.css";

const features = [
  ["01", ShieldCheck, "Professional League", "Certified umpires, official white leather match balls and professional match equipment.", "CERTIFIED UMPIRES"],
  ["02", UsersRound, "Youth Focused", "Age-based categories for U-14, U-19 and U-25 players to showcase their talent.", "AGE 10–25 YEARS"],
  ["03", CalendarDays, "Daily Matches", "Three fixed daily sessions let players and teams choose a convenient time to play.", "3 DAILY SESSIONS"],
  ["04", Trophy, "Prizes & Awards", "Trophies, medals, certificates and Man of the Match awards for standout performances.", "TROPHIES & MEDALS"],
];

export default function Tournament() {
  return <PublicPageLayout eyebrow="LEAGUE BLUEPRINT" title="Built for the" accent="big stage." description="A structured, player-first cricket league built around professional match standards at Yamunanagar Ground Stadium." heroImage="/image/stadium3.jpeg">
    <div className="public-section-intro"><div><p>THE CDS STANDARD</p><h2>More than a match.</h2></div><span>Every fixture is designed to feel like a proper professional cricket experience.</span></div>
    <div className="public-card-grid">{features.map(([number, Icon, title, description, tag]) => <article className="public-card" key={number}><span className="public-card-number">{number}</span><span className="public-card-icon"><Icon size={22} /></span><h2>{title}</h2><p>{description}</p><strong>{tag}</strong></article>)}</div>
    <section className="public-detail-band"><div className="public-detail-intro"><span>COMPETITION FORMAT</span><h2>Every player gets a real stage.</h2><p>CDS combines scheduled fixtures, organised teams and match-day recognition so players can focus on one thing: playing their best cricket.</p></div><div className="public-detail-grid"><article className="public-detail-card"><span>01 / MATCHDAY</span><h3>Structured fixtures</h3><p>Planned sessions, allocated teams and a clear playing window keep every game moving smoothly.</p></article><article className="public-detail-card"><span>02 / PERFORMANCE</span><h3>Play to be noticed</h3><p>Use competitive matches to build confidence, sharpen your skills and make every innings count.</p></article><article className="public-detail-card"><span>03 / RECOGNITION</span><h3>Moments that matter</h3><p>Standout players and winning teams receive match-day awards, certificates and league recognition.</p></article><article className="public-detail-card"><span>04 / COMMUNITY</span><h3>One cricket community</h3><p>Meet players, build your squad and compete in an environment built around the game.</p></article></div></section>
    <section className="public-notes"><article className="public-note"><span>PLAYER PATHWAY</span><h3>Start with your team</h3><p>Create a captain account, build your squad and keep player details ready for every fixture.</p></article><article className="public-note"><span>MATCH FORMAT</span><h3>Twenty-over cricket</h3><p>Every session is designed around a complete 20-over cricket experience for both teams.</p></article><article className="public-note"><span>LEAGUE ACCESS</span><h3>Book a session</h3><p>Pick a daily match window that works for your side and confirm your place at the ground.</p></article></section>
    <PublicPageCta eyebrow="READY FOR YOUR INNINGS" title="Your team belongs on this stage." description="Create your team, explore the daily sessions and be ready for the next CDS cricket fixture." image="/image/award1.jpeg" actions={[{ label: "EXPLORE SLOTS", to: "/slots" }, { label: "REGISTER AS PLAYER", to: "/playerRegistration" }]} />
  </PublicPageLayout>;
}
