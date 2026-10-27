import {useEffect,useRef,useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUpRight,ChevronLeft,ChevronRight,Play,Clock,Check,ShieldCheck,Users,CalendarDays,Trophy} from 'lucide-react';
import {stadiumViews,galleryCategories,videoClips,timeSlots} from './homeContentData.js';
import TiltCard from './components/TiltCard';

const features=[
  ['01','PROFESSIONAL LEAGUE','Certified Umpires & Professional Equipment. Automated electronic scoring tablets, official white leather match balls, and strict international playing protocols.','CERTIFIED UMPIRES'],
  ['02','YOUTH FOCUSED','Open for players aged 10–25 years. Tailored categories for U-14 sub-juniors, U-19 youth stars, and under-25 challengers to showcase skills for district & state scouts.','AGE 10–25 YEARS'],
  ['03','DAILY MATCHES','Three fixed time slots are available every day so players and teams can choose a convenient match session.','3 DAILY SESSIONS'],
  ['04','PRIZES & AWARDS','Trophies, Medals & Certificates. Prestigious championship shields, Man of the Match awards, best bowler & batsman prizes, and certified player credentials.','TROPHIES & MEDALS'],
];
const featureIcons=[ShieldCheck,Users,CalendarDays,Trophy];
const facilities=['Professional Grade Cricket Pitch with True Bounce','Advanced Floodlights for Night Matches (50,000 LUX)','Sprawling 4-Acre Enclosure with Digital Scoreboards','Modern Pavilion & Changing Rooms with Team Dugouts','Practice Nets Available Daily with Bowling Machines','First Aid & Professional Medical Facilities On-Site'];

export function ZoomWord({ text }) {
  if (typeof text !== 'string') return text;
  return (
    <span className="cds-zoom-phrase">
      {text.split(' ').map((word, idx, arr) => (
        <span key={idx} className="cds-zoom-word-wrap">
          <span className="cds-zoom-word">{word}</span>
          {idx < arr.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
}

export default function HomeContent({onPlayVideo}) {
  const [stadium,setStadium]=useState(0);
  const contentRef=useRef(null);
  useEffect(()=>{
    const root=contentRef.current;
    const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
    if(preference.matches || !('IntersectionObserver' in window))return;
    const targets=[...root.querySelectorAll('.ck-section-heading > div, .ck-section-heading > p, .cds-info-card, .cds-stadium-photo, .cds-stadium-copy, .cds-gallery-card, .cds-video-card, #register-banner > div')];
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        entry.target.classList.add('cds-reveal-visible');
        observer.unobserve(entry.target);
      });
    },{threshold:.08,rootMargin:'0px 0px -25px 0px'});
    targets.forEach(element=>{
      const siblings=[...element.parentElement.children];
      const stagger=element.matches('.cds-info-card, .cds-gallery-card, .cds-video-card')?siblings.indexOf(element)%4:0;
      element.style.setProperty('--reveal-delay',`${stagger*110}ms`);
      const image=element.matches('.cds-stadium-photo');
      const copy=element.matches('.cds-stadium-copy, .ck-section-heading > p');
      element.dataset.reveal=image?'left':copy?'right':'up';
      // Already-visible content stays readable on hash navigation or restored scroll.
      const rect=element.getBoundingClientRect();
      if(rect.top<window.innerHeight && rect.bottom>0)return;
      element.classList.add('cds-reveal');
      observer.observe(element);
    });
    const revealFocused=event=>{
      const target=event.target.closest('.cds-reveal');
      if(target){target.classList.add('cds-reveal-visible');observer.unobserve(target);}
    };
    const revealAll=()=>targets.forEach(element=>element.classList.add('cds-reveal-visible'));
    const preferenceChanged=()=>{if(preference.matches)revealAll();};
    root.addEventListener('focusin',revealFocused);
    window.addEventListener('beforeprint',revealAll);
    preference.addEventListener('change',preferenceChanged);
    return ()=>{
      observer.disconnect();root.removeEventListener('focusin',revealFocused);
      window.removeEventListener('beforeprint',revealAll);
      preference.removeEventListener('change',preferenceChanged);
      targets.forEach(element=>{element.classList.remove('cds-reveal','cds-reveal-visible');delete element.dataset.reveal;});
    };
  },[]);

  // Nexinfosoft 3D Tilt & Cursor Spotlight on ALL Home Cards
  useEffect(()=>{
    const root = contentRef.current;
    if(!root) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if(reducedMotion.matches) return;

    const cards = root.querySelectorAll(
      '.cds-info-card, .cds-gallery-card > a, .cds-video-card, .cds-stadium-photo'
    );

    const cleanups = [];

    cards.forEach((card)=>{
      card.classList.add('ck-3d-interactive-card');

      if(!card.querySelector('.ck-card-spotlight')){
        const spotlight = document.createElement('span');
        spotlight.className = 'ck-card-spotlight';
        spotlight.setAttribute('aria-hidden', 'true');
        card.appendChild(spotlight);
      }

      let reqId = null;
      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;
      let isHovered = false;

      const animate = ()=>{
        currentX += (targetX - currentX) * 0.14;
        currentY += (targetY - currentY) * 0.14;

        card.style.setProperty('--rx', `${currentY.toFixed(2)}deg`);
        card.style.setProperty('--ry', `${currentX.toFixed(2)}deg`);

        if(isHovered || Math.abs(targetX - currentX) > 0.02 || Math.abs(targetY - currentY) > 0.02){
          reqId = requestAnimationFrame(animate);
        } else {
          card.style.setProperty('--rx', '0deg');
          card.style.setProperty('--ry', '0deg');
          reqId = null;
        }
      };

      const onMouseMove = (e)=>{
        const rect = card.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;

        targetX = xPct * 9;
        targetY = -yPct * 9;

        card.style.setProperty('--cx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--cy', `${e.clientY - rect.top}px`);

        isHovered = true;
        if(!reqId) reqId = requestAnimationFrame(animate);
      };

      const onMouseEnter = (e)=>{
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--cx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--cy', `${e.clientY - rect.top}px`);
        isHovered = true;
        if(!reqId) reqId = requestAnimationFrame(animate);
      };

      const onMouseLeave = ()=>{
        isHovered = false;
        targetX = 0;
        targetY = 0;
        if(!reqId) reqId = requestAnimationFrame(animate);
      };

      card.addEventListener('mousemove', onMouseMove, {passive: true});
      card.addEventListener('mouseenter', onMouseEnter, {passive: true});
      card.addEventListener('mouseleave', onMouseLeave, {passive: true});

      cleanups.push(()=>{
        card.removeEventListener('mousemove', onMouseMove);
        card.removeEventListener('mouseenter', onMouseEnter);
        card.removeEventListener('mouseleave', onMouseLeave);
        if(reqId) cancelAnimationFrame(reqId);
      });
    });

    return ()=>{
      cleanups.forEach(c => c());
    };
  },[]);
  return <main className="cds-home-content" ref={contentRef}>
    <div className="cds-league-strip"><div><span>THE LEAGUE</span><strong>CDS PREMIER CRICKET</strong></div><div><span>THE HOME GROUND</span><strong>YAMUNANAGAR STADIUM</strong></div><div><span>YOUR NEXT INNINGS</span><strong>3 DAILY MATCH SESSIONS</strong></div><Link to="/playerRegistration" aria-label="Explore match slots"><ArrowUpRight size={25}/></Link></div>
    <section className="cds-content-section" id="tournament">
      <div className="ck-section-heading"><div><p className="ck-kicker">LEAGUE BLUEPRINT &amp; ARCHITECTURE</p><h2>TOURNAMENT DETAILS<br />&amp; <em>FEATURES.</em></h2></div><p>Professional cricket championship organized by CDS at Yamunanagar Ground Stadium under full BCCI and international match protocols.</p></div>
      <div className="cds-feature-grid">{features.map(([number,title,description,tag],index)=>{const Icon=featureIcons[index];return <article className="cds-info-card" key={number}><div className="cds-feature-top"><span className="cds-feature-icon"><Icon size={25} strokeWidth={1.6}/></span><span className="cds-card-number">{number}</span></div><h3><ZoomWord text={title} /></h3><p>{description}</p><span className="cds-card-tag">{tag}<ArrowUpRight size={14}/></span></article>})}</div>
    </section>
    <section className="cds-content-section cds-stadium-section" id="stadium">
      <div className="cds-stadium-photo"><img src={stadiumViews[stadium].img} alt={stadiumViews[stadium].tab+' at Yamunanagar Ground'} loading="lazy"/><div className="cds-photo-caption"><span>{stadiumViews[stadium].title}</span><div><button onClick={()=>setStadium((stadium+stadiumViews.length-1)%stadiumViews.length)} aria-label="Previous stadium photo"><ChevronLeft/></button><button onClick={()=>setStadium((stadium+1)%stadiumViews.length)} aria-label="Next stadium photo"><ChevronRight/></button></div></div><div className="cds-stadium-tabs">{stadiumViews.map((view,index)=><button key={view.tab} aria-pressed={stadium===index} onClick={()=>setStadium(index)}>{view.tab}</button>)}</div></div>
      <div className="cds-stadium-copy"><p className="ck-kicker">HOME GROUND OF CDS LEAGUE</p><h2>YAMUNANAGAR GROUND<br /><em>CRICKET STADIUM.</em></h2><p>Our professional cricket stadium in Yamunanagar provides world-class facilities for both day and night matches. With a perfect curated pitch, advanced floodlights, and spectator seating for 500+ people, we create the ideal environment for cricket enthusiasts.</p><ul>{facilities.map(facility=><li key={facility}><Check size={15}/>{facility}</li>)}</ul><Link className="ck-button" to="/playerRegistration">BOOK PITCH SLOT<ArrowUpRight size={18}/></Link><small>Sector 14, Sports Enclave, Yamunanagar</small></div>
    </section>
    <section className="cds-content-section" id="time-slots"><div className="ck-section-heading"><div><p className="ck-kicker">GUARANTEED DAILY MATCH FIXTURES</p><h2>DAILY MATCH<br /><em>TIME SLOTS.</em></h2></div><p>Same time slots available every day at Yamunanagar Ground Stadium. Choose your preferred match timing and secure your spot.</p></div><div className="cds-feature-grid">{timeSlots.map(slot=><article className="cds-info-card cds-slot-card" key={slot.session}><span className="cds-card-tag">{slot.session} / {slot.badge}</span><h3><ZoomWord text={slot.title} /></h3><strong><Clock size={17}/>{slot.time}</strong><p>{slot.desc}</p><dl><dt>Pitch</dt><dd>{slot.pitch}</dd><dt>Format</dt><dd>{slot.format}</dd></dl><Link to="/playerRegistration" className="cds-text-link">{slot.btnText}<ArrowUpRight size={17}/></Link></article>)}</div></section>
    <section className="cds-content-section" id="gallery"><div className="ck-section-heading"><div><p className="ck-kicker">GROUND MEMORIES &amp; TROPHY MOMENTS</p><h2>MATCH GALLERY<br />&amp; <em>HIGHLIGHTS.</em></h2></div><p>Experience the excitement through photos from our previous matches and tournaments at Yamunanagar Ground Stadium.</p></div><div className="cds-gallery-grid">{galleryCategories.map(group=><article className="cds-gallery-card" key={group.category}><Link to="/gallery"><div className="cds-card-photo-window"><div className="cds-card-photo-track">{[0,1].map(copy=><div className="cds-card-photo-set" key={copy} aria-hidden={copy===1?true:undefined}>{[...new Set(group.images)].map((image,index)=><img key={image} src={image} alt={copy===0?`${group.category} photo ${index+1}`:''} loading="lazy"/>)}</div>)}</div></div><span><ZoomWord text={group.category} /><ArrowUpRight size={18}/></span></Link><p>{group.subtitle}</p></article>)}</div><Link className="ck-button" to="/gallery">EXPLORE FULL MATCH GALLERY<ArrowUpRight size={18}/></Link></section>
    <section className="cds-content-section" id="highlights"><div className="ck-section-heading"><div><p className="ck-kicker">BROADCAST MATCH CLIPS</p><h2>MATCH HIGHLIGHTS<br /><em>VIDEOS.</em></h2></div><p>Watch exciting highlights and previous fixtures from Yamunanagar Ground Stadium recorded in high definition.</p></div><div className="cds-video-grid">{videoClips.map(clip=><button className="cds-video-card" key={clip.videoSrc} onClick={()=>onPlayVideo(clip.videoSrc,clip.title)} aria-haspopup="dialog"><div><img src={clip.poster} alt="" loading="lazy"/><span className="ck-film-play"><Play fill="currentColor" size={22}/></span></div><span className="cds-card-tag">{clip.category}</span><h3><ZoomWord text={clip.title} /></h3><p>{clip.desc}</p></button>)}</div></section>
    <TiltCard />
  </main>;
}
