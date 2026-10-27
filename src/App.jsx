import {useEffect} from "react";
import Header from "./pages/components/header";
import Footer from "./pages/components/footer";
import { Routes, Route, useLocation } from "react-router-dom";
import CustomCursor from "./pages/components/CustomCursor";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Tournament from "./pages/Tournament";
import Stadium from "./pages/Stadium";
import MatchSlots from "./pages/MatchSlots";
import "./App.css";

// pages
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SlotsPage from './pages/Slots/SlotsPage.jsx';
import CaptainDashboard from "./pages/captain/CaptainDashboard";
import ChampionsTrophy from "./pages/captain/ChampionsTrophy";

import Booking from "./pages/booking/Booking.jsx";
import Gallery from "./pages/Gallery";
import CricketPlayerRegistration from "./pages/PlayerRegistration.jsx"
import JuniorPremierLeagueAmbala from "./pages/JuniorPremierLeagueAmbala.jsx"  // ✅ NEW IMPORT
import AdminDashboardd from "./pages/AdminDashboard.jsx"

// protected route
import ProtectedRoute from "./pages/components/ProtectedRoute";
import  ContactUs  from "./pages/contact/contact_us.jsx";
import  PrivacyPolicy  from "./pages/contact/privacy_policy.jsx";
import  RefundPolicy  from "./pages/contact/refund_policy.jsx";
import  TermsAndConditions  from "./pages/contact/terms_and_conditions.jsx";
import "./SiteTheme.css";

// common components


function App() {
  const {pathname,hash}=useLocation();
  const showSiteChrome = ['/', '/tournament', '/stadium', '/slots', '/gallery', '/contact', '/privacy', '/privacy-policy', '/refund', '/terms'].includes(pathname);
  const isFormPage = ['/playerRegistration', '/Ambala-Rising-Star', '/book-slots'].includes(pathname);
  useEffect(()=>{
    if(hash){
      const frame=requestAnimationFrame(()=>document.getElementById(hash.slice(1))?.scrollIntoView({behavior:'smooth'}));
      return ()=>cancelAnimationFrame(frame);
    }
    window.scrollTo(0,0);
  },[pathname,hash]);
  return (
    <div className="cds-app">
      <CustomCursor />
      {showSiteChrome && <Header hero={pathname === "/"}/>}
      {showSiteChrome && pathname !== "/" && <div className="site-header-spacer" aria-hidden="true"/>}

      <main className={`app-route${isFormPage ? ' app-form-page' : ''}${showSiteChrome && pathname !== '/' ? ' app-public-page' : ''}`}>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/tournament" element={<Tournament />} />
        <Route path="/stadium" element={<Stadium />} />
        <Route path="/slots" element={<MatchSlots />} />
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/gallery" element={<Gallery />} />
        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/slots" element={<SlotsPage />} />
        <Route path="/trophyPlayer" element={<AdminDashboardd/>}/>
        {/* Team Captain Routes */}
        {/* <Route path="/captain" element={<ProtectedRoute role="teamCaptain"> <CaptainDashboard /></ProtectedRoute>}/> */}
        <Route path="/captain" element={<CaptainDashboard />} />
        <Route path="/ChampionsTrophy" element={<ChampionsTrophy />} />
        <Route path="/book-slots" element={<Booking />} />

        <Route path="/playerRegistration" element={<CricketPlayerRegistration/>} />
        <Route path="/Ambala-Rising-Star" element={<JuniorPremierLeagueAmbala />} />  {/* ✅ NEW ROUTE */}
        <Route path="/contact" element={< ContactUs/>}/>
        <Route path="/privacy" element={< PrivacyPolicy/>}/>
        <Route path="/privacy-policy" element={< PrivacyPolicy/>}/>
        <Route path="/refund" element={< RefundPolicy/>}/>
        <Route path="/terms" element={< TermsAndConditions/>}/>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </main>

      {showSiteChrome && <Footer/>}
 
    </div>
  );
}

export default App;
