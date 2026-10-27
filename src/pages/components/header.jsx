import {useEffect,useState} from 'react';
import {Link,useLocation} from 'react-router-dom';
import {ArrowUpRight,Menu,X} from 'lucide-react';
import './header.css';

export default function Header({hero=false}) {
  const [menuOpen,setMenuOpen]=useState(false);
  const {pathname}=useLocation();
  const [scrolled,setScrolled]=useState(()=>window.scrollY>20);
  useEffect(()=>{
    const update=()=>setScrolled(window.scrollY>20);
    window.addEventListener('scroll',update,{passive:true});
    return ()=>window.removeEventListener('scroll',update);
  },[]);
  return <header className={`site-header${hero?' site-header-hero':''}${scrolled?' is-scrolled':''}`}>
    <div className="site-header-inner">
      <Link to="/" className="site-brand" aria-label="CDS Premier Cricket League home" onClick={()=>setMenuOpen(false)}><img src="/image/cds-logo.jpeg" alt=""/><span>CDS<small>PREMIER CRICKET LEAGUE</small></span></Link>
      <button className="site-menu-toggle" onClick={()=>setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="site-navigation" aria-label={menuOpen?'Close menu':'Open menu'}>{menuOpen?<X/>:<Menu/>}</button>
      <nav id="site-navigation" className={`site-navigation${menuOpen?' is-open':''}`} aria-label="Main navigation" onClick={()=>setMenuOpen(false)}>
        <Link className={pathname==='/'?'is-active':''} to="/">HOME</Link><Link className={pathname==='/tournament'?'is-active':''} to="/tournament">TOURNAMENT</Link><Link className={pathname==='/stadium'?'is-active':''} to="/stadium">STADIUM</Link><Link className={pathname==='/slots'?'is-active':''} to="/slots">SLOTS</Link><Link className={pathname==='/gallery'?'is-active':''} to="/gallery">GALLERY</Link><Link className={pathname==='/contact'?'is-active':''} to="/contact">CONTACT</Link>
      </nav>
      <div className="site-header-actions"><Link className="site-login-button" to="/login" state={{from:pathname}}>LOGIN</Link><Link className="site-book-button" to="/book-slots">BOOK MATCH SLOT<ArrowUpRight size={15}/></Link></div>
    </div>
  </header>;
}
