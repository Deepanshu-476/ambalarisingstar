import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, X, MessageCircle } from "lucide-react";
import promoVideo from "../assets/popupview.mp4";
import "./Home.css";
import HomeContent from "./HomeContent";
import "./HomeTheme.css";
const ScrollCricketScene = lazy(() => import("./ScrollCricketScene"));

const slides = [
  {eyebrow:"CDS PREMIER CRICKET LEAGUE",lines:["JOIN THE CRICKET","REVOLUTION","AT YAMUNANAGAR"],description:"Experience high-octane franchise cricket at our state-of-the-art stadium. Daily competitive fixtures, international turf pitches and premier scouting exposure.",action:"REGISTER AS PLAYER",to:"/playerRegistration",scene:"ball"},
  {scene:"impact"}, {scene:"batsman"},
];

export default function Home() {
  const [active, setActive] = useState(0);
  const scrollRootRef = useRef(null);
  const progressRef = useRef(0);
  const [phase, setPhase] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
  const slide = slides[active];
  const [activeVideo,setActiveVideo]=useState(promoVideo);
  const [videoTitle,setVideoTitle]=useState('CDS Premier Cricket League Promo');
  const playVideo=(source=promoVideo,title='CDS Premier Cricket League Promo')=>{
    setActiveVideo(source);setVideoTitle(title);setVideoOpen(true);
  };

  useEffect(() => {
    const root = scrollRootRef.current;
    let frame = 0;
    let displayedProgress = null;
    let previousTime = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const clamp = value => Math.max(0, Math.min(1, value));
    const range = (start, end, value) => {
      const t = clamp((value - start) / (end - start));
      return t * t * (3 - 2 * t);
    };
    const update = (timestamp = performance.now()) => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const scrollProgress = clamp(-rect.top / Math.max(1, root.offsetHeight - window.innerHeight));
      // Follow the current scroll position in both directions so returning to
      // the sticky hero replays its scenes instead of holding the final frame.
      const target = scrollProgress >= .97 ? 1 : scrollProgress;
      const delta = Math.min(50, timestamp - (previousTime || timestamp));
      previousTime = timestamp;
      if(displayedProgress === null || reducedMotion.matches) displayedProgress=target;
      else displayedProgress+=(target-displayedProgress)*(1-Math.exp(-delta/70));
      if(Math.abs(target-displayedProgress)<.00005) displayedProgress=target;
      const progress=displayedProgress;
      progressRef.current = progress;
      const mid = range(.12,.23,progress) * (1-range(.49,.58,progress));
      const ending = range(.78,.91,progress);
      root.style.setProperty('--ck-progress', progress);
      root.style.setProperty('--ck-intro-opacity', 1-range(.09,.19,progress));
      root.style.setProperty('--ck-intro-y', `${-range(.09,.23,progress)*110}px`);
      root.style.setProperty('--ck-mid-opacity', mid);
      root.style.setProperty('--ck-burst-opacity', range(.43,.455,progress)*(1-range(.49,.53,progress)));
      root.style.setProperty('--ck-flight-opacity', range(.5,.56,progress)*(1-range(.76,.83,progress)));
      root.style.setProperty('--ck-end-opacity', ending);
      root.style.setProperty('--ck-end-y', `${(1-ending)*65}px`);
      root.style.setProperty('--ck-background-scale', 1+range(.49,.78,progress)*.2);
      root.style.setProperty('--ck-background-shift', `${mid*-16}%`);
      root.style.setProperty('--ck-fill', `${progress*100}%`);
      const currentPhase = progress < .17 ? 0 : progress < .42 ? 1 : progress < .52 ? 2 : progress < .8 ? 3 : 4;
      setPhase(previous => previous === currentPhase ? previous : currentPhase);
      setActive(previous => { const next = progress < .17 ? 0 : progress < .8 ? 1 : 2; return previous === next ? previous : next; });
      if(Math.abs(target-displayedProgress)>.00005) frame=requestAnimationFrame(update);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(root);
    update();
    return () => { window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);

  const goToMoment = index => {
    const root = scrollRootRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const stops = [0, .3, .46, .65, .97];
    window.scrollTo({ top: window.scrollY + root.getBoundingClientRect().top + stops[index] * (root.offsetHeight - window.innerHeight), behavior: reducedMotion ? 'instant' : 'smooth' });
  };

  useEffect(() => {
    if (!videoOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = event => { if (event.key === "Escape") setVideoOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [videoOpen]);

  return (
    <div className="crickt-home">
      <div className="ck-scroll-story" ref={scrollRootRef}>
      <section className={`ck-hero ck-scroll-hero ck-phase-${phase} ck-scene-${slide.scene}`} id="home" aria-label="Scroll to follow the ball from delivery to boundary">
        <div className="ck-stadium" aria-hidden="true" />
        <div className="ck-diagonal ck-diagonal-one" aria-hidden="true" /><div className="ck-diagonal ck-diagonal-two" aria-hidden="true" />


        <Suspense fallback={null}><ScrollCricketScene progressRef={progressRef} /></Suspense>
        <div className="ck-hero-inner">
          <div className="ck-copy ck-scroll-intro" aria-hidden={phase !== 0} inert={phase !== 0}>
            <p className="ck-eyebrow"><span />{slides[0].eyebrow}</p>
            <h1>{slides[0].lines.map(line => <span key={line}>{line}</span>)}</h1>
            <p className="ck-description">{slides[0].description}</p>
            <Link className="ck-button ck-primary" to={slides[0].to}>{slides[0].action}<ArrowUpRight size={19} /></Link>
            <button className="cds-promo-link" onClick={()=>playVideo()}>WATCH CDS PROMO <ArrowUpRight size={13}/></button>
          </div>
          <div className="ck-copy ck-scroll-outro" aria-hidden={phase !== 4} inert={phase !== 4}>
            <p className="ck-eyebrow"><span />DIRECT FAST-TRACK ENROLMENT</p>
            <h2>READY TO PLAY<br />PROFESSIONAL<br />CRICKET?</h2>
            <p className="ck-description">Register now and secure your spot in the CDS Cricket Premier League at Yamunanagar Ground.</p>
            <Link className="ck-button ck-primary" to="/playerRegistration">REGISTER AS PLAYER<ArrowUpRight size={19} /></Link>
          </div>
          <div className="ck-side-label" aria-hidden="true">DELIVERY / CONTACT / BOUNDARY</div>
        </div>

        <div className="ck-shot-data" aria-hidden={phase !== 1 && phase !== 2}>
          <span className="ck-data-label">DAILY MATCH SESSIONS</span><div className="ck-data-pair"><span><small>MORNING</small><b>6:00 <em>AM</em></b></span><span><small>DAY</small><b>9:30 <em>AM</em></b></span></div>
          <span className="ck-data-label">AFTERNOON CRICKET</span><div className="ck-data-pair"><span><small>EVENING</small><b>1:00 <em>PM</em></b></span><span><small>SESSIONS</small><b>03</b></span></div><small className="ck-demo-label">YAMUNANAGAR GROUND</small>
        </div>
        <div className="ck-bat-analysis" aria-hidden="true"><span className="ck-data-label">CDS PLAYER CATEGORIES</span><p>SUB-JUNIORS <b>U-14</b></p><p>YOUTH STARS <b>U-19</b></p><p>CHALLENGERS <b>U-25</b></p></div>
        <div className="ck-six-burst" aria-hidden="true"><span>SIX!</span></div>
        <div className="ck-hawkeye" aria-hidden={phase !== 3}>
          <div className="ck-hawkeye-badge">HAWK-EYE</div>
          <div className="ck-hawkeye-speed"><b>138</b><small>KM/H</small></div>
          <em>CDS RADAR TRACKING</em>
        </div>
        <div className="ck-hero-bottom"><span className="ck-slide-count">0{phase + 1}<span> / 05</span></span><div className="ck-slide-dots" role="group" aria-label="Jump to a moment">{['Delivery','The swing','Six!','Ball flight','CDS registration'].map((label,index) => <button key={label} aria-label={label} aria-pressed={phase === index} className={phase === index ? 'is-active' : ''} onClick={() => goToMoment(index)} />)}</div><button className="ck-scroll-cue" onClick={() => phase === 4 ? document.getElementById('tournament').scrollIntoView({behavior:'smooth'}) : goToMoment(Math.min(phase+1,4))}>SCROLL TO {phase === 4 ? 'EXPLORE' : 'PLAY'}<span>&darr;</span></button></div>
        <div className="ck-hero-ticker" aria-hidden="true">
          <div className="ck-ticker-track">
            <span>CDS PREMIER CRICKET LEAGUE</span><span className="ck-ticker-star">✳</span>
            <span>YAMUNANAGAR GROUND STADIUM</span><span className="ck-ticker-star">✳</span>
            <span>3 DAILY MATCH SESSIONS</span><span className="ck-ticker-star">✳</span>
            <span>BOOK MATCH SLOTS</span><span className="ck-ticker-star">✳</span>
            <span>CDS PREMIER CRICKET LEAGUE</span><span className="ck-ticker-star">✳</span>
            <span>YAMUNANAGAR GROUND STADIUM</span><span className="ck-ticker-star">✳</span>
            <span>3 DAILY MATCH SESSIONS</span><span className="ck-ticker-star">✳</span>
            <span>BOOK MATCH SLOTS</span><span className="ck-ticker-star">✳</span>
          </div>
        </div>
        <div className="ck-scroll-progress" aria-hidden="true"><span /></div>
      </section>
      </div>

      <HomeContent onPlayVideo={playVideo}/>
      <Link to="/contact" className="ck-chat" aria-label="Contact us"><MessageCircle size={25} /></Link>
      {videoOpen && <div className="ck-modal" onClick={event => { if (event.target === event.currentTarget) setVideoOpen(false); }}><div className="ck-modal-panel" role="dialog" aria-modal="true" aria-label={videoTitle} onKeyDown={event => { if (event.key === "Tab") { const items = event.currentTarget.querySelectorAll("button, video"); const first = items[0]; const last = items[items.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } } }}><button autoFocus className="ck-modal-close" onClick={() => setVideoOpen(false)} aria-label="Close film"><X /></button><video src={activeVideo} autoPlay controls playsInline tabIndex={0} /><p>{videoTitle}</p></div></div>}
    </div>
  );
}
