import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Check, Eye, EyeOff, LockKeyhole, ShieldCheck, X } from "lucide-react";
import API from "../api/axios";
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dialogRef = useRef(null);
  const [register, setRegister] = useState(false);
  const [email, setEmail] = useState(() => localStorage.getItem("cricket_login_email") || "");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [remember, setRemember] = useState(() => !!localStorage.getItem("cricket_login_email"));
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const returnTo = location.state?.from;
  const close = () => navigate(typeof returnTo === "string" && returnTo.startsWith("/") && !returnTo.startsWith("//") && returnTo !== "/login" ? returnTo : "/", { replace: true });

  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => { document.body.style.overflow = overflow; previous?.focus(); };
  }, []);

  const onKeyDown = event => {
    if (event.key === "Escape" && !loading) { event.preventDefault(); close(); }
    if (event.key !== "Tab") return;
    const focusable = [...dialogRef.current.querySelectorAll('a[href], button:not(:disabled), input:not(:disabled), [tabindex="0"]')].filter(element => element.getClientRects().length > 0);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialogRef.current)) { event.preventDefault(); first?.focus(); }
  };

  const submit = async event => {
    event.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      if (register) {
        await API.post("/auth/register", { name, email, phoneNo, password });
        setRegister(false);
        setPassword("");
        setMessage({ success: true, text: "Your captain account is ready. Sign in to continue." });
      } else {
        const { data } = await API.post("/auth/login", { email, password });
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role || data.user?.role);
        localStorage.setItem("paymentStatus", data.paymentStatus);
        localStorage.setItem("user", JSON.stringify(data.user));
        if (remember) localStorage.setItem("cricket_login_email", email);
        else localStorage.removeItem("cricket_login_email");
        navigate((data.user?.role || data.role) === "admin" ? "/admin" : "/captain", { replace: true });
      }
    } catch (error) {
      setMessage({ success: false, text: error.response?.data?.message || (register ? "Registration failed. Please try again." : "Unable to sign in. Please check your details and try again.") });
    } finally { setLoading(false); }
  };

  return <div className="auth-page" onClick={event => { if (event.target === event.currentTarget && !loading) close(); }}>
    <div className="auth-ambient" aria-hidden="true" />
    <section className="auth-dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="auth-title" tabIndex={-1} onKeyDown={onKeyDown}>
      <button className="auth-close" onClick={close} disabled={loading} aria-label="Close login"><X size={20}/></button>
      <aside className="auth-story">
        <Link to="/" className="auth-brand"><img src="/image/cds-logo.jpeg" alt=""/><span>CDS<small>PREMIER CRICKET LEAGUE</small></span></Link>
        <div><span className="auth-pill"><span/> THE GAME STARTS HERE</span><h2>Your team.<br/>Your moment.<br/><em>Your next innings.</em></h2><p>One place to manage your team, book your next match and be part of the CDS cricket community.</p></div>
        <div className="auth-story-bottom"><ShieldCheck size={18}/><span>Team access. Match-ready.</span></div>
      </aside>
      <div className="auth-content">
        <div className="auth-icon"><LockKeyhole size={24}/></div>
        <p className="page-eyebrow">CDS TEAM ACCESS</p>
        <h1 id="auth-title">{register ? "Build your team." : "Welcome back."}</h1>
        <p className="auth-subtitle">{register ? "Create your captain account to get started." : "Sign in and get ready for your next innings."}</p>
        {message && <div className={`auth-message${message.success ? ' is-success' : ''}`} role={message.success ? "status" : "alert"}>{message.success && <Check size={18}/>}<span>{message.text}</span></div>}
        <form onSubmit={submit} className="auth-form">
          {register && <><label htmlFor="auth-name">Full name<input id="auth-name" autoComplete="name" value={name} onChange={e=>setName(e.target.value)} required disabled={loading} placeholder="Your full name"/></label><label htmlFor="auth-phone">Mobile number<input id="auth-phone" type="tel" autoComplete="tel" value={phoneNo} onChange={e=>setPhoneNo(e.target.value)} required disabled={loading} placeholder="Your mobile number"/></label></>}
          <label htmlFor="auth-email">Email address<input id="auth-email" type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} required disabled={loading} placeholder="you@example.com"/></label>
          <label htmlFor="auth-password">Password<span className="auth-password"><input id="auth-password" type={visible ? "text" : "password"} autoComplete={register ? "new-password" : "current-password"} value={password} onChange={e=>setPassword(e.target.value)} required disabled={loading} placeholder={register ? "Create a password" : "Enter your password"}/><button type="button" onClick={()=>setVisible(!visible)} aria-label={visible ? "Hide password" : "Show password"} aria-pressed={visible}>{visible ? <EyeOff size={18}/> : <Eye size={18}/>}</button></span></label>
          {!register && <label className="auth-remember"><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/>Remember my email</label>}
          <button className="auth-submit" type="submit" disabled={loading}>{loading ? "Please wait..." : register ? "Create captain account" : "Sign in"}<ArrowUpRight size={19}/></button>
        </form>
        <p className="auth-switch">{register ? "Already have an account?" : "New to the league?"} <button type="button" disabled={loading} onClick={()=>{setRegister(!register);setPassword("");setMessage(null);}}>{register ? "Sign in" : "Register as captain"}</button></p>
        <Link to="/" className="auth-home"><ArrowLeft size={15}/>Back to the league</Link>
      </div>
    </section>
  </div>;
}
