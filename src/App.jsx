import {
  useState, useEffect, useCallback, useRef,
  createContext, useContext, Component
} from "react";
import {
  BrowserRouter, Routes, Route, Link, NavLink,
  useNavigate, useParams, Navigate, useLocation
} from "react-router-dom";

/* ═══════════════════════════════════════════════════
   HOW TO USE THIS FILE:
   1. npm install react-router-dom
   2. Replace your existing App.jsx with this file
   3. Your main.jsx just needs:
      import App from './App.jsx'
      createRoot(document.getElementById('root')).render(<App />)
   ═══════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   GLOBAL STYLES  (Dark + Light theme variables)
   IMPROVED TEXT CONTRAST FOR BETTER READABILITY
   ───────────────────────────────────────────── */
import API from './services/api';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser } from './services/auth.service';
import { getWorkers, getWorkerById } from './services/worker.service';
import { createBooking, getUserBookings, cancelBooking } from './services/booking.service';
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&family=Cinzel:wght@400;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── BASE (Dark = default) ── */
    :root {
      --jade:#5CE0C8; --jade2:#3ECBAD; --jade-dim:rgba(92,224,200,0.12);
      --rose:#FF7EB6; --rose2:#FF4FA3; --gold:#E8C96A; --mist:#A8DAFF; --lav:#C4AAFF; --peach:#FFB899;
      --ink:#060D18; --ink2:#0A1624; --ink3:#0E1F32;
      --surface:rgba(255,255,255,0.055); --surface2:rgba(255,255,255,0.09);
      --border:rgba(92,224,200,0.18); --border2:rgba(255,255,255,0.10);
      --text:#EDF4FF; --text2:#B0C4DE; --text3:#6B8DA8;
      --shadow:0 10px 45px rgba(0,0,0,0.55); --shadow-lg:0 24px 80px rgba(0,0,0,0.7);
      --glow-jade:0 0 35px rgba(92,224,200,0.38); --glow-rose:0 0 35px rgba(255,79,163,0.35); --glow-gold:0 0 28px rgba(232,201,106,0.38);
      --r-xl:28px; --r-lg:20px; --r-md:14px; --r-sm:10px; --r-full:9999px;
      --bounce:cubic-bezier(0.34,1.3,0.64,1); --ease:cubic-bezier(0.23,1,0.32,1);
      --serif:'Cinzel',serif; --serif2:'Cormorant Garamond',Georgia,serif; --sans:'DM Sans',sans-serif;
      --bg-page:var(--ink); --bg-card:var(--surface); --tx-main:var(--text); --tx-sub:var(--text2);
      --nav-height:66px;
    }

    /* ── GLOBAL CONTAINER FIX (CRITICAL FOR SPACING) ── */
    .app-main {
      overflow-x: hidden;
    }
    .container-safe {
      width: 100%;
      max-width: 1400px;
      margin-left: auto;
      margin-right: auto;
      padding-left: clamp(1rem, 5vw, 3rem);
      padding-right: clamp(1rem, 5vw, 3rem);
    }
    /* Mobile first spacing - content NEVER touches edges */
    @media (max-width: 640px) {
      .container-safe {
        padding-left: 20px;
        padding-right: 20px;
      }
      .section {
        padding-left: 20px !important;
        padding-right: 20px !important;
      }
      .hero-content {
        padding-left: 20px !important;
        padding-right: 20px !important;
      }
    }
    @media (min-width: 641px) and (max-width: 1024px) {
      .container-safe {
        padding-left: 2rem;
        padding-right: 2rem;
      }
    }
    @media (min-width: 1025px) {
      .container-safe {
        padding-left: 3rem;
        padding-right: 3rem;
      }
    }

    /* ── LIGHT THEME (improved contrast) ── */
    [data-theme="light"] {
      --ink:#F5F7FB; --ink2:#FFFFFF; --ink3:#E8EDF5;
      --surface:rgba(0,0,0,0.03); --surface2:rgba(0,0,0,0.06);
      --border2:rgba(0,0,0,0.10); --border:rgba(92,224,200,0.40);
      --text:#1A2C3E; --text2:#2C4C6C; --text3:#5A7A9A;
      --shadow:0 10px 45px rgba(0,0,0,0.08); --shadow-lg:0 24px 80px rgba(0,0,0,0.12);
      --glow-jade:0 0 35px rgba(92,224,200,0.18);
    }

    html { scroll-behavior:smooth; }
    body { font-family:var(--sans); background:var(--ink); color:var(--text); min-height:100vh; overflow-x:hidden; transition:background 0.4s,color 0.4s; }
    ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:var(--ink2)} ::-webkit-scrollbar-thumb{background:linear-gradient(var(--jade),var(--rose));border-radius:4px}

    /* ── IMAGES ── */
    img { display:block; max-width:100%; }
    .img-cover { width:100%; height:100%; object-fit:cover; object-position:center; }
    .img-avatar { object-fit:cover; object-position:center top; }

    @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
    @keyframes floatY2{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-18px) rotate(1deg)}}
    @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
    @keyframes glowPulse{0%,100%{box-shadow:var(--glow-jade)}50%{box-shadow:0 0 55px rgba(92,224,200,0.7)}}
    @keyframes glowRose{0%,100%{box-shadow:var(--glow-rose)}50%{box-shadow:0 0 55px rgba(255,79,163,0.6)}}
    @keyframes blink{0%,90%,100%{transform:scaleY(1)}95%{transform:scaleY(0.08)}}
    @keyframes lanternRise{0%{transform:translateY(110vh) rotate(0deg);opacity:0}6%{opacity:0.7}94%{opacity:0.45}100%{transform:translateY(-12vh) rotate(720deg);opacity:0}}
    @keyframes mistFloat{0%,100%{transform:translateX(0) scale(1);opacity:0.2}50%{transform:translateX(50px) scale(1.1);opacity:0.32}}
    @keyframes slideUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
    @keyframes scaleIn{from{opacity:0;transform:scale(0.88) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes confDrop{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(900deg);opacity:0}}
    @keyframes toastSlide{from{transform:translateX(70px);opacity:0}to{transform:none;opacity:1}}
    @keyframes radarRing{0%{transform:translate(-50%,-50%) scale(0.6);opacity:0.9}100%{transform:translate(-50%,-50%) scale(2.8);opacity:0}}
    @keyframes heartPop{0%,100%{transform:scale(1)}45%{transform:scale(1.45)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes pulse2{0%,100%{opacity:1}50%{opacity:0.4}}
    @keyframes scanLine{0%{top:-10%}100%{top:110%}}
    @keyframes pageFade{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
    @keyframes dotBounce{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}
    @keyframes skeletonShimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
    @keyframes mobileMenuSlide{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes menuItemFade{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}

    .page-enter { animation:pageFade 0.38s var(--ease) both; }

    /* ── LOADING ── */
    .loading-page{min-height:70vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.2rem;padding-top:var(--nav-height)}
    .spinner-ring{width:52px;height:52px;border-radius:50%;border:3px solid var(--border2);border-top-color:var(--jade);animation:spin 0.9s linear infinite;box-shadow:var(--glow-jade)}
    .loading-title{font-family:var(--serif);font-size:1rem;color:var(--jade);letter-spacing:0.08em}
    .loading-sub{font-size:0.78rem;color:var(--text3)}
    .dot-loader{display:flex;gap:0.4rem}
    .dot-loader span{width:8px;height:8px;border-radius:50%;background:var(--jade);animation:dotBounce 1.4s infinite ease-in-out both}
    .dot-loader span:nth-child(1){animation-delay:-0.32s}
    .dot-loader span:nth-child(2){animation-delay:-0.16s}

    /* ── SKELETON ── */
    .skeleton{background:linear-gradient(90deg,var(--surface) 25%,var(--surface2) 50%,var(--surface) 75%);background-size:400px 100%;animation:skeletonShimmer 1.4s ease infinite;border-radius:var(--r-md)}
    .sk-card{border-radius:var(--r-xl);overflow:hidden;border:1px solid var(--border2)}
    .sk-img{height:220px}
    .sk-body{padding:1rem}
    .sk-line{height:12px;margin-bottom:8px}
    .sk-line.w70{width:70%}
    .sk-line.w50{width:50%}
    .sk-line.w90{width:90%}

    /* ── ERROR STATE ── */
    .error-page{min-height:70vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;text-align:center;padding:2rem;padding-top:var(--nav-height)}
    .error-icon-big{font-size:4rem;margin-bottom:0.5rem}
    .error-h{font-family:var(--serif);font-size:1.6rem;font-weight:700;color:var(--text);letter-spacing:0.04em}
    .error-msg{font-size:0.88rem;color:var(--text2);max-width:400px;line-height:1.7}
    .error-btns{display:flex;gap:0.75rem;flex-wrap:wrap;justify-content:center;margin-top:0.5rem}

    /* ── 404 PAGE ── */
    .notfound-page{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.2rem;text-align:center;padding:2rem;position:relative;overflow:hidden;padding-top:var(--nav-height)}
    .notfound-num{font-family:var(--serif);font-size:clamp(5rem,20vw,14rem);font-weight:700;line-height:1;background:linear-gradient(135deg,var(--jade),var(--mist),var(--rose));-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 4s linear infinite;background-size:220% auto}
    .notfound-title{font-family:var(--serif);font-size:1.8rem;color:var(--text);letter-spacing:0.06em}
    .notfound-desc{color:var(--text2);font-size:0.95rem;max-width:420px;line-height:1.75;font-family:var(--serif2)}

    /* ── THEME TOGGLE ── */
    .theme-toggle-btn{position:fixed;bottom:100px;right:20px;z-index:150;width:46px;height:46px;border-radius:50%;background:var(--surface2);border:1.5px solid var(--border2);cursor:pointer;font-size:1.2rem;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(12px);box-shadow:var(--shadow);transition:all 0.3s var(--bounce)}
    .theme-toggle-btn:hover{transform:scale(1.12) rotate(15deg);border-color:var(--jade);box-shadow:var(--glow-jade)}

    /* ── HOORI BOT ── */
    .hoori-btn{position:fixed;bottom:22px;left:22px;z-index:150;cursor:pointer;animation:floatY 4s ease-in-out infinite}
    .hoori-orb{width:52px;height:52px;border-radius:50%;background:radial-gradient(circle at 35% 35%,rgba(168,218,255,0.92),rgba(92,224,200,0.65));border:1.5px solid rgba(92,224,200,0.72);box-shadow:var(--glow-jade),0 0 60px rgba(92,224,200,0.22);display:flex;align-items:center;justify-content:center;position:relative;animation:glowPulse 3s ease-in-out infinite}
    .hoori-eye{width:5px;height:7px;background:var(--ink);border-radius:50%;position:absolute;animation:blink 5.5s ease-in-out infinite}
    .hoori-eye.l{left:14px;top:18px}.hoori-eye.r{right:14px;top:18px}
    .hoori-badge{position:absolute;top:-5px;right:-5px;width:18px;height:18px;background:var(--rose);border-radius:50%;border:2px solid var(--ink);animation:pulse2 2s infinite}
    .hoori-tip{position:absolute;bottom:calc(100% + 10px);left:50%;transform:translateX(-50%);background:rgba(6,13,24,0.94);border:1px solid var(--border);border-radius:var(--r-lg);padding:0.5rem 0.9rem;font-size:0.7rem;color:var(--jade);white-space:nowrap;backdrop-filter:blur(16px);box-shadow:var(--shadow);animation:scaleIn 0.3s var(--bounce)}
    .hoori-tip::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:rgba(6,13,24,0.94)}
    .hoori-window{position:fixed;bottom:86px;left:22px;width:320px;max-height:520px;background:var(--ink2);border-radius:var(--r-xl);box-shadow:var(--shadow-lg),var(--glow-jade);border:1px solid var(--border);display:flex;flex-direction:column;overflow:hidden;z-index:160;animation:scaleIn 0.35s var(--bounce)}
    @media(max-width:500px){.hoori-window{width:calc(100vw - 44px);left:22px}}
    .hoori-head{padding:1rem 1.2rem;background:linear-gradient(135deg,var(--jade),var(--jade2));display:flex;justify-content:space-between;align-items:center}
    .hoori-head-info{display:flex;align-items:center;gap:0.6rem}
    .hoori-head-av{width:34px;height:34px;border-radius:50%;background:rgba(6,13,24,0.3);display:flex;align-items:center;justify-content:center;font-size:1.1rem}
    .hoori-head-name{font-weight:800;font-size:0.9rem;color:var(--ink)}
    .hoori-head-status{font-size:0.65rem;color:rgba(6,13,24,0.7)}
    .hoori-close-btn{background:rgba(6,13,24,0.2);border:none;border-radius:50%;width:28px;height:28px;cursor:pointer;font-size:0.85rem;color:var(--ink);display:flex;align-items:center;justify-content:center;transition:background 0.2s}
    .hoori-close-btn:hover{background:rgba(6,13,24,0.4)}
    .hoori-msgs{flex:1;overflow-y:auto;padding:1rem;display:flex;flex-direction:column;gap:0.8rem;min-height:0}
    .hoori-msgs::-webkit-scrollbar{width:3px}
    .h-msg{display:flex;gap:0.5rem;animation:slideUp 0.2s var(--ease)}
    .h-msg.user{flex-direction:row-reverse}
    .h-msg-bubble{max-width:80%;padding:0.6rem 0.9rem;border-radius:18px;font-size:0.8rem;line-height:1.55}
    .h-msg.bot .h-msg-bubble{background:var(--surface2);border:1px solid var(--border2);border-radius:4px 18px 18px 18px;color:var(--text)}
    .h-msg.user .h-msg-bubble{background:linear-gradient(135deg,var(--jade),var(--jade2));color:var(--ink);border-radius:18px 4px 18px 18px;font-weight:600}
    .h-msg-av{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--jade),var(--mist));display:flex;align-items:center;justify-content:center;font-size:0.85rem;flex-shrink:0}
    .h-nav-btn{display:inline-flex;align-items:center;gap:0.35rem;margin-top:0.5rem;padding:0.3rem 0.8rem;background:var(--jade);border:none;border-radius:99px;color:var(--ink);font-size:0.7rem;font-weight:700;cursor:pointer;transition:transform 0.2s}
    .h-nav-btn:hover{transform:scale(1.06)}
    .h-typing{display:flex;align-items:center;gap:4px;padding:0.5rem 0.9rem;background:var(--surface2);border:1px solid var(--border2);border-radius:4px 18px 18px 18px;width:fit-content}
    .h-typing span{width:6px;height:6px;border-radius:50%;background:var(--jade);animation:dotBounce 1.4s infinite ease-in-out both}
    .h-typing span:nth-child(1){animation-delay:-0.32s}
    .h-typing span:nth-child(2){animation-delay:-0.16s}
    .hoori-chips{padding:0.6rem 0.8rem;display:flex;flex-wrap:wrap;gap:0.4rem;border-top:1px solid var(--border2)}
    .h-chip{padding:0.32rem 0.75rem;background:var(--surface);border:1px solid var(--border2);border-radius:99px;font-size:0.68rem;cursor:pointer;color:var(--text2);transition:all 0.2s;font-family:var(--sans)}
    .h-chip:hover{background:rgba(92,224,200,0.12);border-color:var(--jade);color:var(--jade)}
    .hoori-input-row{padding:0.6rem 0.8rem;display:flex;gap:0.5rem;border-top:1px solid var(--border2)}
    .hoori-input{flex:1;padding:0.55rem 0.9rem;border:1.5px solid var(--border2);border-radius:99px;background:var(--surface);color:var(--text);font-family:var(--sans);font-size:0.8rem;outline:none;transition:border-color 0.2s}
    .hoori-input:focus{border-color:var(--jade)}
    .hoori-send{padding:0.55rem 1rem;background:linear-gradient(135deg,var(--jade),var(--jade2));border:none;border-radius:99px;color:var(--ink);font-weight:700;font-size:0.78rem;cursor:pointer;transition:transform 0.2s}
    .hoori-send:hover{transform:scale(1.06)}

    /* ════════════════════════════════════════
       NAVBAR — DESKTOP + MOBILE (hamburger)
       ════════════════════════════════════════ */
    .navbar {
      position:fixed;top:0;left:0;right:0;z-index:300;
      height:var(--nav-height);
      display:flex;align-items:center;justify-content:space-between;
      padding:0 clamp(1rem,4vw,2.5rem);
      background:rgba(6,13,24,0.85);
      backdrop-filter:blur(26px) saturate(1.6);
      border-bottom:1px solid var(--border2);
      transition:all 0.4s;
    }
    [data-theme="light"] .navbar{background:rgba(245,247,250,0.92)}
    .navbar.scrolled{background:rgba(6,13,24,0.96);border-bottom-color:rgba(92,224,200,0.2)}
    [data-theme="light"] .navbar.scrolled{background:rgba(245,247,250,0.96)}

    .nav-brand{
      font-family:var(--serif);font-size:1.45rem;font-weight:700;cursor:pointer;
      background:linear-gradient(90deg,var(--jade),var(--mist),var(--gold));
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;
      letter-spacing:0.12em;text-decoration:none;flex-shrink:0;
    }

    /* Desktop nav links */
    .nav-links{display:flex;gap:clamp(1rem,2vw,1.8rem);align-items:center}
    .nav-link{
      font-size:0.69rem;font-weight:500;cursor:pointer;text-transform:uppercase;letter-spacing:0.12em;
      color:var(--text2);transition:color 0.25s;background:none;border:none;font-family:var(--sans);
      position:relative;text-decoration:none;display:inline-block;white-space:nowrap;
    }
    .nav-link::after{content:'';position:absolute;bottom:-4px;left:0;right:0;height:1.5px;background:var(--jade);transform:scaleX(0);transition:transform 0.3s var(--bounce);transform-origin:center}
    .nav-link:hover::after,.nav-link.active::after{transform:scaleX(1)}
    .nav-link:hover,.nav-link.active{color:var(--jade)}

    .nav-actions{display:flex;gap:0.5rem;align-items:center}

    /* Hide desktop links on mobile */
    @media(max-width:860px){
      .nav-links{display:none}
      .nav-actions .btn:not(.btn-icon){display:none}
    }
    @media(max-width:480px){
      .nav-brand{font-size:1.2rem}
    }

    /* ── HAMBURGER BUTTON ── */
    .hamburger{
      display:none;flex-direction:column;justify-content:center;align-items:center;gap:5px;
      width:40px;height:40px;background:var(--surface);border:1px solid var(--border2);
      border-radius:var(--r-sm);cursor:pointer;padding:0;flex-shrink:0;
      transition:all 0.3s var(--bounce);
    }
    .hamburger:hover{border-color:var(--jade);background:rgba(92,224,200,0.1)}
    .hamburger span{
      display:block;width:18px;height:1.5px;background:var(--text2);
      border-radius:2px;transition:all 0.32s var(--bounce);transform-origin:center;
    }
    .hamburger.open span:nth-child(1){transform:translateY(6.5px) rotate(45deg);background:var(--jade)}
    .hamburger.open span:nth-child(2){opacity:0;transform:scaleX(0)}
    .hamburger.open span:nth-child(3){transform:translateY(-6.5px) rotate(-45deg);background:var(--jade)}
    @media(max-width:860px){.hamburger{display:flex}}

    /* ── MOBILE MENU ── */
    .mobile-menu-backdrop{
      position:fixed;inset:0;z-index:290;
      background:rgba(4,10,20,0.7);
      backdrop-filter:blur(8px);
      animation:fadeIn 0.2s ease;
    }
    .mobile-menu{
      position:fixed;top:var(--nav-height);left:0;right:0;z-index:295;
      background:rgba(6,13,24,0.97);
      border-bottom:1px solid rgba(92,224,200,0.15);
      padding:0.75rem 0 1.25rem;
      animation:mobileMenuSlide 0.3s var(--ease);
      backdrop-filter:blur(28px);
      box-shadow:0 20px 60px rgba(0,0,0,0.6);
    }
    [data-theme="light"] .mobile-menu{background:rgba(245,247,250,0.98)}

    .mobile-menu-item{
      display:flex;align-items:center;gap:0.75rem;
      padding:0.85rem clamp(1rem,5vw,1.75rem);
      font-family:var(--sans);font-size:0.88rem;font-weight:500;
      color:var(--text2);text-decoration:none;
      border-left:3px solid transparent;
      transition:all 0.22s;cursor:pointer;
      animation:menuItemFade 0.3s var(--ease) both;
    }
    .mobile-menu-item:hover,.mobile-menu-item.active{
      color:var(--jade);
      background:rgba(92,224,200,0.06);
      border-left-color:var(--jade);
    }
    .mobile-menu-item .mi-icon{font-size:1.1rem;width:24px;text-align:center;flex-shrink:0}
    .mobile-menu-divider{height:1px;background:var(--border2);margin:0.5rem clamp(1rem,5vw,1.75rem)}
    .mobile-menu-actions{
      display:flex;gap:0.6rem;padding:0.75rem clamp(1rem,5vw,1.75rem) 0;
    }

    /* ── BUTTONS ── */
    .btn{display:inline-flex;align-items:center;justify-content:center;gap:0.4rem;padding:0.65rem 1.65rem;border-radius:var(--r-full);font-family:var(--sans);font-weight:600;font-size:0.82rem;cursor:pointer;border:none;transition:all 0.35s var(--bounce);position:relative;overflow:hidden;letter-spacing:0.04em;text-decoration:none}
    .btn::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.14),transparent);opacity:0;transition:opacity 0.3s}
    .btn:hover::before{opacity:1}
    .btn-jade{background:linear-gradient(135deg,var(--jade),var(--jade2));color:var(--ink);font-weight:700;box-shadow:0 4px 22px rgba(92,224,200,0.35)}
    .btn-jade:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 8px 34px rgba(92,224,200,0.55)}
    .btn-rose{background:linear-gradient(135deg,var(--rose),var(--rose2));color:white;font-weight:700;box-shadow:0 4px 22px rgba(255,79,163,0.35)}
    .btn-rose:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 8px 34px rgba(255,79,163,0.5)}
    .btn-gold{background:linear-gradient(135deg,var(--gold),#C9A94A);color:var(--ink);font-weight:700;box-shadow:var(--glow-gold)}
    .btn-gold:hover{transform:translateY(-3px);box-shadow:0 8px 28px rgba(232,201,106,0.6)}
    .btn-ghost{background:var(--surface);color:var(--text);border:1px solid var(--border2);backdrop-filter:blur(10px)}
    .btn-ghost:hover{background:var(--surface2);border-color:var(--jade);color:var(--jade);transform:translateY(-2px)}
    .btn-outline{background:transparent;color:var(--jade);border:1px solid rgba(92,224,200,0.45)}
    .btn-outline:hover{background:rgba(92,224,200,0.1);transform:translateY(-2px)}
    .btn-sm{padding:0.38rem 1rem;font-size:0.75rem}
    .btn-lg{padding:0.88rem 2.4rem;font-size:0.9rem}
    .btn-icon{width:38px;height:38px;padding:0;border-radius:var(--r-full);background:var(--surface);border:1px solid var(--border2);color:var(--text);font-size:1rem;backdrop-filter:blur(10px)}
    .btn-icon:hover{background:rgba(92,224,200,0.15);border-color:var(--jade);transform:scale(1.08)}

    /* ── CARDS ── */
    .card{background:var(--surface);backdrop-filter:blur(20px) saturate(1.4);border:1px solid var(--border2);border-radius:var(--r-xl);box-shadow:var(--shadow);transition:all 0.45s var(--ease);overflow:hidden}
    .card:hover{border-color:rgba(92,224,200,0.28);box-shadow:var(--shadow-lg),var(--glow-jade);transform:translateY(-6px)}

    /* ── WORKER CARD ── */
    .wcard{cursor:pointer;position:relative}
    .wcard-img{position:relative;overflow:hidden;height:220px;background:var(--ink3)}
    .wcard-img img{width:100%;height:100%;object-fit:cover;object-position:center top;transition:transform 0.7s var(--ease);filter:brightness(0.88) contrast(1.08) saturate(1.1)}
    .wcard:hover .wcard-img img{transform:scale(1.1);filter:brightness(0.95) contrast(1.1) saturate(1.2)}
    .wcard-img-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(6,13,24,0.82) 0%,rgba(6,13,24,0.1) 55%)}
    .wcard-profession-tag{position:absolute;bottom:10px;left:10px;display:flex;align-items:center;gap:0.4rem;background:rgba(6,13,24,0.85);backdrop-filter:blur(12px);border:1px solid rgba(92,224,200,0.35);border-radius:99px;padding:4px 12px;font-size:0.68rem;font-weight:700;color:var(--jade);letter-spacing:0.06em}
    .wcard-body{padding:1rem 1.2rem 1.25rem}
    .wcard-name{font-family:var(--serif2);font-weight:700;font-size:1.08rem;color:var(--text);margin-bottom:3px}
    .wcard-meta{display:flex;gap:0.75rem;font-size:0.73rem;color:var(--text2);margin-bottom:0.5rem;flex-wrap:wrap}
    .wcard-footer{display:flex;justify-content:space-between;align-items:center;margin-top:0.65rem}
    .wcard-price{font-family:var(--serif2);font-weight:700;color:var(--jade);font-size:1.05rem}
    .wcard-price span{font-size:0.66rem;font-weight:400;color:var(--text3);font-family:var(--sans)}
    .heart-btn{position:absolute;top:10px;right:10px;width:34px;height:34px;border-radius:50%;background:rgba(6,13,24,0.75);backdrop-filter:blur(8px);border:1px solid var(--border2);cursor:pointer;font-size:0.92rem;display:flex;align-items:center;justify-content:center;transition:transform 0.3s var(--bounce)}
    .heart-btn:hover{transform:scale(1.22)}
    .heart-btn.liked{animation:heartPop 0.35s var(--bounce)}
    .vbadge{position:absolute;top:10px;left:10px;background:rgba(92,224,200,0.2);backdrop-filter:blur(8px);color:var(--jade);font-size:0.63rem;font-weight:700;letter-spacing:0.07em;padding:3px 9px;border-radius:99px;border:1px solid rgba(92,224,200,0.3)}
    .sdot{display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:4px}
    .sdot-avail{background:var(--jade);box-shadow:0 0 6px rgba(92,224,200,0.8)}
    .sdot-busy{background:#FFAD6B;box-shadow:0 0 6px rgba(255,173,107,0.6)}

    /* ── INPUTS ── */
    .input{width:100%;padding:0.7rem 1.15rem;border:1.5px solid var(--border2);border-radius:var(--r-md);font-family:var(--sans);font-size:0.86rem;background:rgba(255,255,255,0.055);color:var(--text);backdrop-filter:blur(10px);transition:all 0.3s;outline:none}
    [data-theme="light"] .input{background:rgba(0,0,0,0.04)}
    .input::placeholder{color:var(--text3)}
    .input:focus{border-color:var(--jade);box-shadow:0 0 0 3px rgba(92,224,200,0.14)}
    .input.err{border-color:#FF6B8A}
    .input.ok{border-color:rgba(92,224,200,0.6)}
    .form-group{margin-bottom:1rem}
    .form-label{display:block;margin-bottom:0.35rem;font-size:0.71rem;font-weight:600;color:var(--text2);letter-spacing:0.08em;text-transform:uppercase}
    .form-error{font-size:0.72rem;color:#FF6B8A;margin-top:0.3rem}
    select.input{cursor:pointer;background:rgba(6,13,24,0.85)}
    [data-theme="light"] select.input{background:rgba(240,244,250,0.9)}
    textarea.input{resize:vertical;min-height:110px}

    /* ── TABS ── */
    .tabs{display:flex;background:rgba(255,255,255,0.05);border-radius:var(--r-md);padding:4px;gap:3px}
    .tab{flex:1;padding:0.45rem;border:none;border-radius:10px;background:none;cursor:pointer;font-family:var(--sans);font-size:0.78rem;font-weight:500;color:var(--text2);transition:all 0.3s}
    .tab.active{background:rgba(92,224,200,0.15);color:var(--jade);font-weight:700;border:1px solid rgba(92,224,200,0.25)}

    /* ── GRIDS ── */
    .g2{display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem}
    .g3{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem}
    .g4{display:grid;grid-template-columns:repeat(4,1fr);gap:1.25rem}
    @media(max-width:1100px){.g4{grid-template-columns:repeat(2,1fr)}.g3{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:680px){.g2,.g3,.g4{grid-template-columns:1fr}}

    /* ── SECTION (with safe spacing) ── */
    .section{
      padding:clamp(2.5rem,6vw,5rem) 0;
      max-width:1400px;
      margin:0 auto;
      width:100%;
    }
    /* All direct children inside section get container-safe padding */
    .section > * {
      padding-left: clamp(1rem, 5vw, 3rem);
      padding-right: clamp(1rem, 5vw, 3rem);
    }

    /* ── HERO (improved text contrast) ── */
    .hero{position:relative;min-height:100vh;display:flex;align-items:center;justify-content:center;overflow:hidden;text-align:center}
    .hero-bg{position:absolute;inset:0;z-index:0;background:radial-gradient(ellipse at 22% 48%,rgba(92,224,200,0.15) 0%,transparent 55%),radial-gradient(ellipse at 78% 22%,rgba(168,218,255,0.12) 0%,transparent 55%),radial-gradient(ellipse at 50% 85%,rgba(196,170,255,0.08) 0%,transparent 55%),linear-gradient(180deg,var(--ink) 0%,var(--ink2) 55%,var(--ink3) 100%)}
    .hero-city{position:absolute;inset:0;z-index:1;background:linear-gradient(to top,rgba(6,13,24,0.92) 0%,rgba(6,13,24,0.45) 55%,rgba(6,13,24,0.65) 100%),url('https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?w=1800&q=75&auto=format&fit=crop') center/cover no-repeat}
    [data-theme="light"] .hero-city{background:linear-gradient(to top,rgba(245,247,250,0.92) 0%,rgba(245,247,250,0.45) 55%,rgba(245,247,250,0.65) 100%),url('https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?w=1800&q=75&auto=format&fit=crop') center/cover no-repeat}
    .hero-mist{position:absolute;inset:0;z-index:2;pointer-events:none;background:radial-gradient(ellipse at 50% 65%,rgba(92,224,200,0.08) 0%,transparent 70%);animation:mistFloat 20s ease-in-out infinite}
    .hero-content{position:relative;z-index:5;max-width:920px;margin:0 auto;padding:clamp(1rem, 5vw, 2rem);width:100%}
    .hero-eyebrow{display:inline-flex;align-items:center;gap:0.6rem;padding:0.4rem 1.4rem;background:rgba(92,224,200,0.12);border:1px solid rgba(92,224,200,0.4);border-radius:var(--r-full);font-size:0.75rem;letter-spacing:0.16em;color:var(--jade);margin-bottom:1.8rem;text-transform:uppercase;backdrop-filter:blur(12px);animation:slideUp 0.7s var(--ease) both;font-weight:600}
    .hero-title{font-family:var(--serif);font-size:clamp(2rem,7vw,5.8rem);font-weight:700;line-height:1.08;margin-bottom:1.4rem;letter-spacing:0.04em;color:var(--text);animation:slideUp 0.7s 0.12s var(--ease) both;text-shadow:0 2px 10px rgba(0,0,0,0.3)}
    .hero-title .grad{background:linear-gradient(90deg,var(--jade),var(--mist),var(--rose),var(--lav));background-size:220% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 6s linear infinite}
    .hero-sub{font-size:1rem;color:var(--text2);max-width:560px;margin:0 auto 2.2rem;line-height:1.85;font-family:var(--serif2);font-size:clamp(0.95rem,2.5vw,1.15rem);animation:slideUp 0.7s 0.24s var(--ease) both;font-weight:500}
    .hero-btns{display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap;animation:slideUp 0.7s 0.36s var(--ease) both}
    .hero-stats{display:flex;gap:clamp(1.5rem,4vw,3rem);justify-content:center;margin-top:3.5rem;flex-wrap:wrap;animation:slideUp 0.7s 0.5s var(--ease) both}
    .hstat-num{font-family:var(--serif);font-size:clamp(1.6rem,4vw,2.1rem);font-weight:700;color:var(--jade);text-shadow:0 0 8px rgba(92,224,200,0.3)}
    .hstat-label{font-size:0.66rem;color:var(--text3);letter-spacing:0.12em;text-transform:uppercase;margin-top:3px;font-weight:600}

    /* ── SECTION HEADS ── */
    .sec-head{text-align:center;margin-bottom:3rem}
    .sec-head h2{font-family:var(--serif);font-size:clamp(1.6rem,4vw,3rem);font-weight:700;color:var(--text);margin-bottom:0.65rem;letter-spacing:0.05em}
    .sec-head p{color:var(--text2);font-size:0.95rem;max-width:480px;margin:0 auto;line-height:1.82;font-family:var(--serif2);font-size:1.05rem;font-weight:500}
    .sec-eyebrow{font-family:var(--serif2);font-style:italic;color:var(--gold);font-size:1rem;display:block;margin-bottom:0.45rem;letter-spacing:0.04em;font-weight:600}
    .sec-divider{display:flex;align-items:center;gap:0.9rem;justify-content:center;margin-bottom:0.9rem}
    .sec-divider::before,.sec-divider::after{content:'';flex:1;max-width:60px;height:1px;background:linear-gradient(90deg,transparent,rgba(232,201,106,0.6))}
    .sec-divider::after{background:linear-gradient(90deg,rgba(232,201,106,0.6),transparent)}

    /* ── SERVICES GRID ── */
    .srv-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:1rem}
    @media(max-width:900px){.srv-grid{grid-template-columns:repeat(3,1fr)}}
    @media(max-width:480px){.srv-grid{grid-template-columns:repeat(2,1fr)}}
    .srv-btn{display:flex;flex-direction:column;align-items:center;gap:0.55rem;padding:1.4rem 0.5rem;border-radius:var(--r-lg);border:1px solid var(--border2);background:var(--surface);backdrop-filter:blur(14px);cursor:pointer;transition:all 0.4s var(--bounce);font-family:var(--sans);font-size:0.72rem;font-weight:600;color:var(--text2);letter-spacing:0.04em}
    .srv-btn:hover{background:rgba(92,224,200,0.12);border-color:var(--jade);transform:translateY(-7px) scale(1.04);color:var(--jade);box-shadow:var(--glow-jade)}
    .srv-btn .si{font-size:1.9rem}

    /* ── HOW IT WORKS ── */
    .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:2rem}
    @media(max-width:700px){.steps{grid-template-columns:1fr}}
    .step-card{text-align:center;padding:2.5rem 1.8rem}
    .step-num{width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,var(--jade),var(--mist));color:var(--ink);font-size:1.35rem;font-weight:800;display:flex;align-items:center;justify-content:center;margin:0 auto 1.2rem;box-shadow:var(--glow-jade)}
    .step-title{font-family:var(--serif);font-size:1.1rem;font-weight:700;color:var(--text);margin-bottom:0.6rem;letter-spacing:0.04em}
    .step-desc{font-size:0.84rem;color:var(--text2);line-height:1.78}

    /* ── STATS ── */
    .stats-strip{background:linear-gradient(135deg,rgba(92,224,200,0.12),rgba(168,218,255,0.08));border:1px solid rgba(92,224,200,0.25);padding:2.8rem clamp(1rem,4vw,2.5rem);border-radius:var(--r-xl);display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;text-align:center;backdrop-filter:blur(16px)}
    @media(max-width:680px){.stats-strip{grid-template-columns:repeat(2,1fr)}}
    .ss-num{font-family:var(--serif);font-size:clamp(1.6rem,4vw,2.3rem);font-weight:700;color:var(--jade)}
    .ss-label{font-size:0.68rem;color:var(--text3);letter-spacing:0.1em;text-transform:uppercase;margin-top:5px}

    /* ── TESTIMONIALS ── */
    .testi{padding:1.8rem}
    .testi-quote{font-family:var(--serif2);font-style:italic;font-size:1rem;color:var(--text2);line-height:1.82;margin-bottom:1.2rem}
    .testi-av{width:44px;height:44px;border-radius:50%;object-fit:cover;object-position:center top;border:1.5px solid rgba(92,224,200,0.5)}
    .testi-name{font-weight:700;font-size:0.83rem;color:var(--text)}
    .testi-loc{font-size:0.7rem;color:var(--text3);margin-top:1px}
    .stars{color:var(--gold);font-size:0.8rem;margin-bottom:0.6rem}

    /* ── DIRECTORY ── */
    .dir-page{padding-top:var(--nav-height);min-height:100vh}
    .dir-header{padding:clamp(1.5rem,4vw,3rem) 0 1.5rem;max-width:1400px;margin:0 auto;width:100%}
    .dir-header > * {
      padding-left: clamp(1rem, 5vw, 3rem);
      padding-right: clamp(1rem, 5vw, 3rem);
    }
    .dir-controls{display:flex;gap:0.6rem;align-items:center;padding:0.5rem 0 1rem;max-width:1400px;margin:0 auto;flex-wrap:wrap;width:100%}
    .dir-controls > * {
      padding-left: clamp(1rem, 5vw, 3rem);
      padding-right: 0;
    }
    .dir-controls > :first-child { padding-left: clamp(1rem, 5vw, 3rem); }
    @media(max-width: 768px) {
      .dir-controls > * { padding-left: 20px; padding-right: 20px; }
      .dir-controls > :first-child { padding-left: 20px; }
    }
    .search-wrap{position:relative;flex:1;min-width:200px}
    .search-wrap .input{padding-left:2.8rem}
    .search-ico{position:absolute;left:1rem;top:50%;transform:translateY(-50%);color:var(--text3);pointer-events:none}
    .f-chip{padding:0.38rem 1rem;border-radius:var(--r-full);border:1px solid var(--border2);background:var(--surface);font-size:0.72rem;cursor:pointer;font-family:var(--sans);color:var(--text2);transition:all 0.25s;backdrop-filter:blur(8px)}
    .f-chip.active{border-color:var(--jade);background:rgba(92,224,200,0.12);color:var(--jade);font-weight:700}
    .dir-body{display:flex;gap:1.75rem;padding:0.5rem 0 5rem;max-width:1400px;margin:0 auto;width:100%}
    .dir-body > .fsidebar { margin-left: clamp(1rem, 5vw, 3rem); }
    .dir-body > div:last-child { padding-right: clamp(1rem, 5vw, 3rem); }
    @media(max-width:960px){
      .fsidebar{display:none}
      .dir-body > div:last-child { padding-left: clamp(1rem, 5vw, 3rem); }
    }
    .fsidebar{width:265px;flex-shrink:0}
    .fs-title{font-weight:700;font-size:0.68rem;color:var(--text2);margin-bottom:0.5rem;letter-spacing:0.1em;text-transform:uppercase}
    .fs-opt{display:flex;align-items:center;gap:0.5rem;margin-bottom:0.42rem;font-size:0.8rem;color:var(--text2);cursor:pointer}
    .fs-opt input{accent-color:var(--jade);cursor:pointer}
    .sep{height:1px;background:var(--border2);margin:1.2rem 0}

    /* ── DETAIL ── */
    .detail-page{padding-top:var(--nav-height);min-height:100vh}
    .detail-cover{position:relative;height:clamp(220px,35vw,340px);overflow:hidden;background:var(--ink3)}
    .detail-cover img{width:100%;height:100%;object-fit:cover;filter:brightness(0.85) saturate(1.1)}
    .detail-cover-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(6,13,24,0.95) 0%,rgba(6,13,24,0.2) 60%)}
    .detail-wrap{max-width:1400px;margin:0 auto;padding:0 0 5rem 0;width:100%}
    .detail-wrap > *:not(.detail-cover) {
      padding-left: clamp(1rem, 5vw, 3rem);
      padding-right: clamp(1rem, 5vw, 3rem);
    }
    .detail-profile{display:flex;gap:2rem;margin-top:-58px;position:relative;z-index:3;align-items:flex-end;flex-wrap:wrap}
    .detail-avatar{width:110px;height:110px;border-radius:var(--r-lg);border:3px solid rgba(92,224,200,0.55);object-fit:cover;object-position:center top;box-shadow:var(--glow-jade);filter:brightness(0.92) saturate(1.1);flex-shrink:0;background:var(--ink3)}
    .detail-name{font-family:var(--serif);font-size:clamp(1.5rem,4vw,2rem);font-weight:700;color:var(--text);letter-spacing:0.04em}
    .detail-badge{display:inline-block;background:linear-gradient(135deg,var(--jade),var(--mist));color:var(--ink);padding:3px 14px;border-radius:99px;font-size:0.72rem;font-weight:700;margin-bottom:0.55rem;letter-spacing:0.05em}
    .dstat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin:2rem 0}
    @media(max-width:680px){.dstat-grid{grid-template-columns:repeat(2,1fr)}.detail-profile{flex-direction:column;align-items:flex-start;margin-top:-30px}}
    .dstat{text-align:center;padding:1.3rem}
    .dstat-num{font-family:var(--serif);font-size:1.6rem;font-weight:700;color:var(--jade)}
    .dstat-label{font-size:0.72rem;color:var(--text2);margin-top:3px}
    .stag{padding:0.28rem 0.85rem;background:rgba(92,224,200,0.1);border:1px solid rgba(92,224,200,0.25);border-radius:99px;font-size:0.72rem;color:var(--jade);font-weight:600}
    .port-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0.7rem}
    @media(max-width:680px){.port-grid{grid-template-columns:repeat(2,1fr)}}
    .port-img{aspect-ratio:1;border-radius:var(--r-md);overflow:hidden;cursor:pointer;position:relative;background:var(--ink3)}
    .port-img img{width:100%;height:100%;object-fit:cover;transition:transform 0.5s var(--ease);filter:brightness(0.88) saturate(1.1)}
    .port-img:hover img{transform:scale(1.12);filter:brightness(0.98) saturate(1.2)}
    .port-img-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(6,13,24,0.7),transparent);opacity:0;transition:opacity 0.3s}
    .port-img:hover .port-img-overlay{opacity:1}
    .rev-card{padding:1.2rem;margin-bottom:0.75rem}
    .rev-name{font-weight:700;font-size:0.83rem;color:var(--text)}
    .rev-date{font-size:0.7rem;color:var(--text3)}
    .rev-text{font-size:0.83rem;color:var(--text2);line-height:1.68;margin-top:0.3rem}

    /* ── MODALS ── */
    .modal-ov{position:fixed;inset:0;z-index:500;background:rgba(4,10,20,0.78);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;padding:1rem;animation:fadeIn 0.22s ease}
    .modal-box{background:rgba(8,18,32,0.96);border-radius:var(--r-xl);border:1px solid var(--border);box-shadow:0 40px 100px rgba(0,0,0,0.65),var(--glow-jade);width:100%;max-width:525px;max-height:90vh;overflow-y:auto;animation:scaleIn 0.38s var(--bounce)}
    [data-theme="light"] .modal-box{background:rgba(245,247,250,0.97)}
    .modal-header{padding:1.5rem 1.5rem 0;display:flex;justify-content:space-between;align-items:center}
    .modal-title{font-family:var(--serif);font-size:1.35rem;font-weight:700;color:var(--text);letter-spacing:0.05em}
    .modal-body{padding:1.5rem}
    .time-slots{display:grid;grid-template-columns:repeat(4,1fr);gap:0.45rem;margin-top:0.3rem}
    @media(max-width:400px){.time-slots{grid-template-columns:repeat(3,1fr)}}
    .tslot{padding:0.45rem;text-align:center;border-radius:var(--r-md);border:1px solid var(--border2);font-size:0.72rem;cursor:pointer;font-family:var(--sans);background:var(--surface);color:var(--text2);transition:all 0.2s}
    .tslot.sel{border-color:var(--jade);background:rgba(92,224,200,0.12);color:var(--jade);font-weight:700}
    .tslot:hover:not(.sel){border-color:rgba(92,224,200,0.4)}
    .price-box{background:rgba(92,224,200,0.06);border:1px solid rgba(92,224,200,0.15);border-radius:var(--r-md);padding:1rem;margin:1rem 0}
    .price-row{display:flex;justify-content:space-between;font-size:0.82rem;color:var(--text2);padding:0.22rem 0}
    .price-total{font-weight:800;color:var(--jade);font-size:0.95rem;border-top:1px solid rgba(92,224,200,0.2);padding-top:0.5rem;margin-top:0.5rem}

    /* ── EMERGENCY ── */
    .emrg-box{border-color:rgba(255,126,182,0.25);box-shadow:0 40px 100px rgba(0,0,0,0.7),var(--glow-rose)}
    .emrg-cat{display:flex;flex-direction:column;align-items:center;gap:0.42rem;padding:1.1rem 0.5rem;border-radius:var(--r-lg);border:1px solid rgba(255,126,182,0.18);background:rgba(255,126,182,0.06);cursor:pointer;transition:all 0.3s var(--bounce);font-size:0.72rem;font-weight:600;color:var(--text2);text-align:center;font-family:var(--sans)}
    .emrg-cat.sel{border-color:rgba(255,126,182,0.55);background:rgba(255,126,182,0.16);color:var(--rose);box-shadow:var(--glow-rose)}
    .emrg-cat:hover:not(.sel){border-color:rgba(255,126,182,0.35);transform:translateY(-3px)}
    .radar-wrap{position:relative;width:120px;height:120px;margin:0 auto 1.5rem}
    .radar-ring{position:absolute;border-radius:50%;border:1.5px solid rgba(255,126,182,0.45);top:50%;left:50%}
    .radar-pulse{position:absolute;border-radius:50%;border:1.5px solid rgba(255,126,182,0.55);top:50%;left:50%;animation:radarRing 2.2s ease-out infinite}
    .radar-dot{width:12px;height:12px;border-radius:50%;background:var(--rose);position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);box-shadow:0 0 14px rgba(255,79,163,0.9)}

    /* ── CONFIRM ── */
    .confirm-page{padding-top:var(--nav-height);min-height:100vh;display:flex;align-items:center;justify-content:center}
    .confirm-box{max-width:520px;width:100%;padding:clamp(1.5rem,4vw,2.5rem);text-align:center;margin:0 20px}
    .confirm-icon{font-size:4.5rem;margin-bottom:1rem;animation:scaleIn 0.6s var(--bounce)}
    .confirm-title{font-family:var(--serif);font-size:clamp(1.5rem,4vw,2rem);font-weight:700;color:var(--text);margin-bottom:0.5rem;letter-spacing:0.04em}
    .confirm-detail{background:rgba(92,224,200,0.06);border:1px solid rgba(92,224,200,0.2);border-radius:var(--r-md);padding:1.2rem;margin:1.5rem 0;text-align:left}
    .confirm-row{display:flex;justify-content:space-between;font-size:0.82rem;padding:0.28rem 0;border-bottom:1px solid var(--border2)}
    .confirm-row:last-child{border-bottom:none}
    .cr-label{color:var(--text3)}.cr-val{font-weight:700;color:var(--text)}
    .conf{position:fixed;pointer-events:none;z-index:600;border-radius:2px;animation:confDrop ease forwards}

    /* ── AUTH ── */
    .auth-page{min-height:100vh;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;padding-top:var(--nav-height);padding-bottom:2rem}
    .auth-box{background:rgba(6,13,24,0.94);backdrop-filter:blur(28px);border-radius:var(--r-xl);border:1px solid var(--border);box-shadow:0 32px 90px rgba(0,0,0,0.65),var(--glow-jade);padding:clamp(1.5rem,4vw,2.6rem);width:100%;max-width:475px;position:relative;z-index:4;margin:1rem 20px;animation:scaleIn 0.4s var(--bounce)}
    [data-theme="light"] .auth-box{background:rgba(255,255,255,0.96)}
    .auth-logo{text-align:center;margin-bottom:1.5rem}
    .auth-logo span{font-family:var(--serif);font-size:2rem;font-weight:700;background:linear-gradient(90deg,var(--jade),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:0.14em}
    .auth-title{font-family:var(--serif2);font-size:1.6rem;font-weight:600;color:var(--text);text-align:center;margin-bottom:0.25rem}
    .auth-sub{font-size:0.83rem;color:var(--text2);text-align:center;margin-bottom:1.6rem}
    .pwd-bar{height:3px;background:var(--border2);border-radius:2px;overflow:hidden;margin-top:0.4rem}
    .pwd-fill{height:100%;border-radius:2px;transition:all 0.35s}
    .step-dots{display:flex;gap:0.45rem;justify-content:center;margin-bottom:1.6rem}
    .sdot-step{width:7px;height:7px;border-radius:50%;background:var(--border2);transition:all 0.3s}
    .sdot-step.active{background:var(--jade);width:22px;border-radius:4px}
    .sdot-step.done{background:var(--gold)}

    /* ── DASHBOARD ── */
    .dash-page{padding-top:var(--nav-height);min-height:100vh}
    .dash-sidebar{width:245px;background:rgba(6,13,24,0.94);backdrop-filter:blur(20px);border-right:1px solid var(--border2);padding:2rem 1rem;position:fixed;top:var(--nav-height);left:0;bottom:0;overflow-y:auto;z-index:50}
    [data-theme="light"] .dash-sidebar{background:rgba(255,255,255,0.96)}
    @media(max-width:900px){.dash-sidebar{display:none}}
    .dash-main{margin-left:245px;padding:clamp(1.25rem,3vw,2.5rem) clamp(1rem, 5vw, 3rem)}
    @media(max-width:900px){.dash-main{margin-left:0;padding:clamp(1rem,3vw,1.5rem)}}
    .dnav-item{display:flex;align-items:center;gap:0.7rem;padding:0.6rem 0.9rem;border-radius:var(--r-md);font-size:0.82rem;font-weight:500;cursor:pointer;color:var(--text2);transition:all 0.25s;background:none;border:none;font-family:var(--sans);width:100%;text-align:left}
    .dnav-item:hover{background:rgba(92,224,200,0.1);color:var(--jade)}
    .dnav-item.active{background:rgba(92,224,200,0.14);color:var(--jade);font-weight:700;border:1px solid rgba(92,224,200,0.22)}
    .dash-title{font-family:var(--serif);font-size:clamp(1.4rem,4vw,1.9rem);font-weight:700;color:var(--text);letter-spacing:0.04em}
    .dash-sub{color:var(--text2);font-size:0.88rem;margin-bottom:2rem;font-family:var(--serif2);font-style:italic}
    .kpi{padding:1.5rem;text-align:center}
    .kpi-ic{font-size:1.8rem;margin-bottom:0.5rem}
    .kpi-num{font-family:var(--serif);font-size:1.9rem;font-weight:700;color:var(--jade)}
    .kpi-lbl{font-size:0.72rem;color:var(--text2);margin-top:3px;letter-spacing:0.05em}
    .bk-item{display:flex;gap:1rem;margin-bottom:1.2rem;padding-bottom:1.2rem;border-bottom:1px solid var(--border2);align-items:flex-start}
    .bk-dot{width:9px;height:9px;border-radius:50%;background:var(--jade);margin-top:6px;flex-shrink:0}
    .bk-name{font-weight:700;font-size:0.85rem;color:var(--text)}
    .bk-detail{font-size:0.73rem;color:var(--text2);margin-top:2px}
    .bk-status{font-size:0.67rem;font-weight:700;padding:2px 9px;border-radius:99px;white-space:nowrap}
    .st-confirmed{background:rgba(92,224,200,0.15);color:var(--jade)}
    .st-pending{background:rgba(255,173,107,0.15);color:#FFAD6B}
    .st-completed{background:rgba(196,170,255,0.15);color:var(--lav)}

    /* ── ABOUT ── */
    .about-page{padding-top:var(--nav-height)}
    .team-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem}
    @media(max-width:900px){.team-grid{grid-template-columns:repeat(2,1fr)}}
    .team-card{text-align:center;padding:1.6rem 1rem}
    .team-av{width:82px;height:82px;border-radius:50%;object-fit:cover;object-position:center top;border:2px solid rgba(92,224,200,0.5);margin:0 auto 0.7rem;display:block;box-shadow:var(--glow-jade);background:var(--ink3)}
    .team-name{font-weight:700;color:var(--text);font-size:0.86rem}
    .team-role{font-size:0.72rem;color:var(--jade);margin-top:2px}
    .tl{position:relative;padding-left:2.8rem}
    .tl::before{content:'';position:absolute;left:20px;top:0;bottom:0;width:1px;background:linear-gradient(to bottom,var(--jade),var(--lav));opacity:0.5}
    .tl-item{display:flex;gap:1.2rem;margin-bottom:2.2rem;position:relative}
    .tl-dot{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--jade),var(--mist));display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:1rem;box-shadow:var(--glow-jade);position:absolute;left:-1.8rem}
    .tl-content{padding-top:0.4rem;padding-left:1.5rem}
    .tl-year{font-size:0.68rem;color:var(--gold);font-weight:700;letter-spacing:0.1em;text-transform:uppercase}
    .tl-title{font-family:var(--serif2);font-weight:600;color:var(--text);font-size:1rem}
    .tl-desc{font-size:0.8rem;color:var(--text2);line-height:1.65;margin-top:0.2rem}

    /* ── CONTACT ── */
    .contact-page{padding-top:var(--nav-height)}
    .faq-item{border:1px solid var(--border2);border-radius:var(--r-md);margin-bottom:0.5rem;overflow:hidden;background:var(--surface);backdrop-filter:blur(10px)}
    .faq-q{padding:0.9rem 1.1rem;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font-weight:600;font-size:0.83rem;color:var(--text)}
    .faq-a{padding:0 1.1rem 0.85rem;font-size:0.8rem;color:var(--text2);line-height:1.72}

    /* ─────────────────────────────────────────────
       FOOTER — Professional SaaS footer with mobile stack
       ───────────────────────────────────────────── */
    .footer {
      background: linear-gradient(180deg, rgba(4,10,20,0.0) 0%, rgba(4,10,20,0.98) 8%);
      border-top: 1px solid var(--border2);
      margin-top: 2rem;
      position: relative;
      overflow: hidden;
      width: 100%;
    }
    [data-theme="light"] .footer { background: linear-gradient(180deg, rgba(26,42,58,0) 0%, rgba(26,42,58,0.98) 8%); }

    .footer::before {
      content: '';
      position: absolute;
      top: -1px; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(92,224,200,0.35), transparent);
    }

    .footer-inner {
      max-width: 1400px;
      margin: 0 auto;
      padding: clamp(2rem,5vw,4rem) clamp(1rem, 5vw, 3rem) 0;
    }

    .footer-top {
      display: grid;
      grid-template-columns: 2.2fr 1fr 1fr 1fr;
      gap: clamp(1.5rem,3vw,2.5rem);
      padding-bottom: clamp(2rem,4vw,3rem);
      border-bottom: 1px solid var(--border2);
    }
    @media(max-width:900px) { .footer-top { grid-template-columns: 1fr 1fr; } }
    @media(max-width:520px) { .footer-top { grid-template-columns: 1fr; } }

    .footer-brand-col {}
    .footer-brand {
      font-family: var(--serif);
      font-size: 1.75rem;
      font-weight: 700;
      background: linear-gradient(90deg, var(--jade), var(--gold));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.75rem;
      letter-spacing: 0.1em;
      display: block;
    }
    .footer-desc {
      font-size: 0.85rem;
      color: var(--text2);
      line-height: 1.85;
      margin-bottom: 1.2rem;
      max-width: 280px;
    }
    .footer-social {
      display: flex;
      gap: 0.6rem;
      flex-wrap: wrap;
    }
    .footer-social-btn {
      width: 36px; height: 36px;
      border-radius: 50%;
      background: var(--surface);
      border: 1px solid var(--border2);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      font-size: 1rem;
      color: var(--text3);
      transition: all 0.25s var(--bounce);
      text-decoration: none;
    }
    .footer-social-btn:hover {
      border-color: var(--jade);
      background: rgba(92,224,200,0.12);
      color: var(--jade);
      transform: translateY(-3px);
    }

    .footer-col {}
    .footer-heading {
      font-weight: 800;
      font-size: 0.7rem;
      color: var(--text2);
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }
    .footer-link {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.82rem;
      color: var(--text2);
      margin-bottom: 0.55rem;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
    }
    .footer-link:hover { color: var(--jade); padding-left: 4px; }
    .footer-link-dot {
      width: 4px; height: 4px;
      border-radius: 50%;
      background: var(--text3);
      transition: background 0.2s;
      flex-shrink: 0;
    }
    .footer-link:hover .footer-link-dot { background: var(--jade); }

    .footer-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.3rem 0.7rem;
      background: rgba(92,224,200,0.08);
      border: 1px solid rgba(92,224,200,0.2);
      border-radius: var(--r-full);
      font-size: 0.7rem;
      color: var(--jade);
      font-weight: 600;
      margin-top: 0.75rem;
      letter-spacing: 0.05em;
    }

    .footer-bottom {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1.25rem clamp(1rem, 5vw, 3rem);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .footer-copy {
      font-size: 0.75rem;
      color: var(--text3);
    }
    .footer-copy strong { color: var(--jade); font-weight: 700; }
    .footer-tagline {
      font-size: 0.7rem;
      color: var(--jade);
      letter-spacing: 0.1em;
      font-weight: 700;
      text-transform: uppercase;
    }
    .footer-legal {
      display: flex;
      gap: 1.2rem;
      flex-wrap: wrap;
    }
    .footer-legal a {
      font-size: 0.72rem;
      color: var(--text3);
      text-decoration: none;
      transition: color 0.2s;
      cursor: pointer;
    }
    .footer-legal a:hover { color: var(--jade); }
    @media(max-width:520px){
      .footer-bottom { flex-direction: column; text-align: center; }
      .footer-legal { flex-wrap: wrap; justify-content: center; }
    }

    /* ── CATEGORIES ── */
    .cat-page{padding-top:var(--nav-height);min-height:100vh}
    .cat-hero-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem}
    @media(max-width:900px){.cat-hero-grid{grid-template-columns:1fr 1fr}}
    @media(max-width:540px){.cat-hero-grid{grid-template-columns:1fr}}
    .cat-card{position:relative;overflow:hidden;border-radius:var(--r-xl);cursor:pointer;height:260px;background:var(--ink3)}
    .cat-card img{width:100%;height:100%;object-fit:cover;transition:transform 0.6s var(--ease);filter:brightness(0.72) saturate(1.15)}
    .cat-card:hover img{transform:scale(1.08);filter:brightness(0.85) saturate(1.2)}
    .cat-card-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(6,13,24,0.88) 0%,rgba(6,13,24,0.1) 60%);transition:background 0.4s}
    .cat-card:hover .cat-card-ov{background:linear-gradient(to top,rgba(6,13,24,0.92) 0%,rgba(92,224,200,0.08) 60%)}
    .cat-card-content{position:absolute;bottom:0;left:0;right:0;padding:1.5rem}
    .cat-card-icon{font-size:2.2rem;margin-bottom:0.4rem}
    .cat-card-title{font-family:var(--serif);font-size:1.25rem;font-weight:700;color:var(--text);letter-spacing:0.04em;margin-bottom:0.25rem}
    .cat-card-count{font-size:0.72rem;color:var(--jade);font-weight:600}
    .cat-card-border{position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--jade),var(--mist));transform:scaleX(0);transition:transform 0.4s var(--bounce);transform-origin:left}
    .cat-card:hover .cat-card-border{transform:scaleX(1)}

    /* ── PORTFOLIO ── */
    .port-page{padding-top:var(--nav-height);min-height:100vh}
    .port-masonry{columns:3;gap:1rem}
    @media(max-width:900px){.port-masonry{columns:2}}
    @media(max-width:540px){.port-masonry{columns:1}}
    .port-masonry-item{break-inside:avoid;margin-bottom:1rem;border-radius:var(--r-md);overflow:hidden;position:relative;cursor:pointer;background:var(--ink3)}
    .port-masonry-item img{width:100%;display:block;filter:brightness(0.88) saturate(1.1);transition:all 0.5s var(--ease)}
    .port-masonry-item:hover img{transform:scale(1.04);filter:brightness(0.98) saturate(1.2)}
    .port-masonry-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(6,13,24,0.8),transparent);opacity:0;transition:opacity 0.3s;display:flex;align-items:flex-end;padding:1rem}
    .port-masonry-item:hover .port-masonry-ov{opacity:1}
    .ba-slider{position:relative;overflow:hidden;border-radius:var(--r-lg);height:280px;cursor:col-resize;background:var(--ink3)}
    .ba-after,.ba-before{position:absolute;inset:0}
    .ba-after img,.ba-before img{width:100%;height:100%;object-fit:cover}
    .ba-divider{position:absolute;top:0;bottom:0;width:3px;background:var(--jade);box-shadow:var(--glow-jade);cursor:col-resize;z-index:10}
    .ba-handle{position:absolute;top:50%;transform:translate(-50%,-50%);width:40px;height:40px;border-radius:50%;background:var(--jade);display:flex;align-items:center;justify-content:center;color:var(--ink);font-size:1rem;box-shadow:var(--glow-jade);font-weight:700}
    .skill-bar-wrap{margin-bottom:1rem}
    .skill-bar-label{display:flex;justify-content:space-between;font-size:0.78rem;color:var(--text2);margin-bottom:5px}
    .skill-bar-track{height:6px;background:var(--border2);border-radius:3px;overflow:hidden}
    .skill-bar-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--jade),var(--mist));transition:width 1s var(--ease)}

    /* ── EMERGENCY LIVE ── */
    .emrg-live-page{padding-top:var(--nav-height);min-height:100vh;background:radial-gradient(ellipse at 50% 0%,rgba(255,79,163,0.06),transparent 60%)}
    .emrg-alert-banner{background:linear-gradient(135deg,rgba(255,79,163,0.15),rgba(255,126,182,0.08));border:1px solid rgba(255,79,163,0.3);border-radius:var(--r-lg);padding:1rem 1.5rem;display:flex;align-items:center;gap:1rem;margin-bottom:2rem;backdrop-filter:blur(12px)}
    .emrg-worker-card{padding:1.2rem;margin-bottom:0.8rem;display:flex;gap:1rem;align-items:center;cursor:pointer}
    .emrg-worker-card:hover{border-color:rgba(255,126,182,0.4)!important}
    .emrg-avatar{width:54px;height:54px;border-radius:50%;object-fit:cover;object-position:center top;border:2px solid rgba(255,126,182,0.5);filter:brightness(0.92);background:var(--ink3)}
    .emrg-eta{font-family:var(--serif);color:var(--rose);font-size:1.2rem;font-weight:700}
    .scan-line{position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(92,224,200,0.6),transparent);animation:scanLine 3s linear infinite;pointer-events:none}

    /* ── SMART CITY ── */
    .smart-page{padding-top:var(--nav-height);min-height:100vh}
    .city-widget{padding:1.5rem;position:relative;overflow:hidden}
    .city-widget::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--jade),transparent);animation:shimmer 3s linear infinite;background-size:200%}
    .heatmap-cell{border-radius:4px;transition:transform 0.2s;cursor:pointer}
    .heatmap-cell:hover{transform:scale(1.15)}
    .live-dot{width:8px;height:8px;border-radius:50%;background:var(--jade);box-shadow:0 0 8px rgba(92,224,200,0.9);animation:pulse2 1.5s ease-in-out infinite;display:inline-block}

    /* ── PAGINATION ── */
    .pagination{display:flex;gap:0.45rem;justify-content:center;margin-top:2.5rem;flex-wrap:wrap}
    .pbtn{width:34px;height:34px;border-radius:var(--r-md);border:1px solid var(--border2);background:var(--surface);backdrop-filter:blur(8px);cursor:pointer;font-family:var(--sans);font-size:0.8rem;color:var(--text2);transition:all 0.2s}
    .pbtn:hover{border-color:var(--jade);color:var(--jade)}
    .pbtn.active{background:var(--jade);color:var(--ink);border-color:var(--jade);font-weight:700;box-shadow:var(--glow-jade)}

    /* ── EMPTY STATE ── */
    .empty-state{text-align:center;padding:4rem 2rem}
    .empty-icon{font-size:4rem;margin-bottom:1rem}
    .empty-title{font-family:var(--serif);font-size:1.4rem;font-weight:700;color:var(--text);margin-bottom:0.45rem;letter-spacing:0.04em}
    .empty-desc{color:var(--text2);font-size:0.84rem}

    /* ── TOAST ── */
    .toast-wrap{position:fixed;bottom:1.5rem;right:1.5rem;z-index:700;display:flex;flex-direction:column;gap:0.5rem;max-width:calc(100vw - 3rem)}
    .toast{background:rgba(92,224,200,0.18);border:1px solid rgba(92,224,200,0.42);color:var(--jade);padding:0.75rem 1.3rem;border-radius:var(--r-full);font-size:0.82rem;font-weight:600;backdrop-filter:blur(16px);box-shadow:var(--glow-jade);animation:toastSlide 0.4s var(--bounce);font-family:var(--sans)}
    .toast.error{background:rgba(255,107,138,0.15);border-color:rgba(255,107,138,0.42);color:#FF6B8A;box-shadow:0 0 22px rgba(255,107,138,0.3)}

    /* ── EMERGENCY FLOAT ── */
    .emrg-float{position:fixed;bottom:22px;right:22px;z-index:150;width:54px;height:54px;border-radius:50%;background:linear-gradient(135deg,rgba(255,126,182,0.28),rgba(196,170,255,0.22));border:1.5px solid rgba(255,126,182,0.52);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1.35rem;box-shadow:var(--glow-rose);animation:glowRose 2.5s ease-in-out infinite,floatY2 5.5s ease-in-out infinite;transition:transform 0.3s var(--bounce)}
    .emrg-float:hover{transform:scale(1.14)}

    /* ── UTILITIES ── */
    .w-full{width:100%}.text-center{text-align:center}
    .flex{display:flex}.items-center{align-items:center}.justify-between{justify-content:space-between}
    .gap-2{gap:0.5rem}.gap-3{gap:0.75rem}.gap-4{gap:1rem}
    .mt-2{margin-top:0.5rem}.mt-3{margin-top:0.75rem}.mt-4{margin-top:1rem}
    .mb-2{margin-bottom:0.5rem}.mb-3{margin-bottom:0.75rem}.mb-4{margin-bottom:1rem}
    .sec-title{font-family:var(--serif);font-size:1.25rem;font-weight:700;color:var(--text);margin-bottom:1rem;letter-spacing:0.04em}
    .back-btn{display:flex;align-items:center;gap:0.35rem;font-size:0.8rem;color:var(--text2);cursor:pointer;transition:color 0.2s;background:none;border:none;font-family:var(--sans);padding:0.4rem 0}
    .back-btn:hover{color:var(--jade)}
    .skill-tags{display:flex;flex-wrap:wrap;gap:0.45rem}
    .bar-bg{height:4px;background:var(--border2);border-radius:3px;overflow:hidden;margin-top:5px}
    .bar-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--jade),var(--mist));transition:width 0.8s var(--ease)}
    input[type=range]{accent-color:var(--jade);width:100%}
    .nl-wrap{display:flex;gap:0.5rem;max-width:420px;margin:0 auto;flex-wrap:wrap}
    .nl-input{flex:1;min-width:160px;padding:0.65rem 1.2rem;border-radius:var(--r-full);border:1px solid var(--border);font-family:var(--sans);font-size:0.85rem;outline:none;background:rgba(255,255,255,0.06);color:var(--text)}
    [data-theme="light"] .nl-input{background:rgba(0,0,0,0.05);color:var(--text)}
    .nl-input::placeholder{color:var(--text3)}
    .nl-input:focus{border-color:var(--jade)}

    /* ── PROFESSION GRID FIX ── */
    .profession-grid { display:grid; grid-template-columns:2fr 1fr 1fr; grid-template-rows:200px 200px; gap:0.75rem; border-radius:var(--r-xl); overflow:hidden; }
    @media(max-width:768px) { .profession-grid { grid-template-columns:1fr 1fr; grid-template-rows:auto; } .profession-grid .span-tall { grid-row:auto; } }
    @media(max-width:480px) { .profession-grid { grid-template-columns:1fr; } }
    .profession-grid-item { position:relative; overflow:hidden; cursor:pointer; min-height:160px; background:var(--ink3); }
    .profession-grid-item img { width:100%; height:100%; object-fit:cover; filter:brightness(0.72) saturate(1.15); transition:transform 0.6s var(--ease),filter 0.4s; }
    .profession-grid-item:hover img { transform:scale(1.06); filter:brightness(0.88) saturate(1.25); }
    .profession-grid-item .overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(6,13,24,0.75),transparent); }
    .profession-grid-item .label { position:absolute; bottom:12px; left:14px; font-family:var(--serif); color:var(--text); font-size:0.85rem; font-weight:700; letter-spacing:0.05em; }
  `}</style>
);

/* ═══════════════════════════════════════════════════
   CONTEXT
═══════════════════════════════════════════════════ */
const AppCtx = createContext();
const useApp = () => useContext(AppCtx);

/* ═══════════════════════════════════════════════════
   THEME CONTEXT
═══════════════════════════════════════════════════ */
const ThemeCtx = createContext();
const useTheme = () => useContext(ThemeCtx);
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('srv_theme') || 'dark'; } catch { return 'dark'; }
  });
  useEffect(() => {
    try { localStorage.setItem('srv_theme', theme); } catch {}
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme(p => p === 'dark' ? 'light' : 'dark');
  return <ThemeCtx.Provider value={{ theme, toggleTheme }}>{children}</ThemeCtx.Provider>;
};

/* ═══════════════════════════════════════════════════
   FALLBACK IMAGE HELPER
═══════════════════════════════════════════════════ */
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=60&auto=format&fit=crop';
const FALLBACK_AVATAR_M = (i = 1) => `https://randomuser.me/api/portraits/men/${(i % 60) + 1}.jpg`;
const FALLBACK_AVATAR_F = (i = 1) => `https://randomuser.me/api/portraits/women/${(i % 60) + 1}.jpg`;

function imgFallback(e, fallback = FALLBACK_IMG) {
  if (e.target.src !== fallback) {
    e.target.onerror = null;
    e.target.src = fallback;
  }
}

/* ═══════════════════════════════════════════════════
   DATA (unchanged)
═══════════════════════════════════════════════════ */
const PROFESSION_IMAGES = {
  Electrician:{cover:'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=900&q=80&auto=format&fit=crop',avatar:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80&auto=format&fit=crop',portfolio:['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1621905251918-bf1b7a4e6fe2?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80&auto=format&fit=crop'],categoryImg:'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80&auto=format&fit=crop'},
  Plumber:{cover:'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=900&q=80&auto=format&fit=crop',avatar:'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=300&q=80&auto=format&fit=crop',portfolio:['https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80&auto=format&fit=crop'],categoryImg:'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&q=80&auto=format&fit=crop'},
  Cleaner:{cover:'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900&q=80&auto=format&fit=crop',avatar:'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80&auto=format&fit=crop',portfolio:['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1527515545081-5db817172677?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80&auto=format&fit=crop'],categoryImg:'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80&auto=format&fit=crop'},
  'AC Technician':{cover:'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=900&q=80&auto=format&fit=crop',avatar:'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&q=80&auto=format&fit=crop',portfolio:['https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80&auto=format&fit=crop'],categoryImg:'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80&auto=format&fit=crop'},
  Carpenter:{cover:'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=900&q=80&auto=format&fit=crop',avatar:'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80&auto=format&fit=crop',portfolio:['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80&auto=format&fit=crop'],categoryImg:'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80&auto=format&fit=crop'},
  Painter:{cover:'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=900&q=80&auto=format&fit=crop',avatar:'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=300&q=80&auto=format&fit=crop',portfolio:['https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&q=80&auto=format&fit=crop'],categoryImg:'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=600&q=80&auto=format&fit=crop'},
  Tutor:{cover:'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80&auto=format&fit=crop',avatar:'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&q=80&auto=format&fit=crop',portfolio:['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&q=80&auto=format&fit=crop'],categoryImg:'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80&auto=format&fit=crop'},
  Mechanic:{cover:'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=900&q=80&auto=format&fit=crop',avatar:'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=300&q=80&auto=format&fit=crop',portfolio:['https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80&auto=format&fit=crop'],categoryImg:'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=600&q=80&auto=format&fit=crop'},
  Beautician:{cover:'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&q=80&auto=format&fit=crop',avatar:'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&q=80&auto=format&fit=crop',portfolio:['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1487412947147-5cebf100d3c6?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80&auto=format&fit=crop'],categoryImg:'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80&auto=format&fit=crop'},
  Chef:{cover:'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=900&q=80&auto=format&fit=crop',avatar:'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=300&q=80&auto=format&fit=crop',portfolio:['https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1514986888952-8cd320577b68?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80&auto=format&fit=crop'],categoryImg:'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&q=80&auto=format&fit=crop'},
  Driver:{cover:'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=900&q=80&auto=format&fit=crop',avatar:'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=300&q=80&auto=format&fit=crop',portfolio:['https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1484185759689-8f7f0c03e352?w=400&q=80&auto=format&fit=crop'],categoryImg:'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80&auto=format&fit=crop'},
  Gardener:{cover:'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=80&auto=format&fit=crop',avatar:'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&q=80&auto=format&fit=crop',portfolio:['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1585320806297-9794b3e4aaae?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&q=80&auto=format&fit=crop','https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400&q=80&auto=format&fit=crop'],categoryImg:'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80&auto=format&fit=crop'},
};
const SKILLS=['Electrician','Plumber','Cleaner','AC Technician','Carpenter','Painter','Tutor','Mechanic','Beautician','Chef','Driver','Gardener'];
const CITIES=['Gujrat','Lahore','Karachi','Islamabad','Rawalpindi','Faisalabad','Multan','Peshawar','Sialkot','Quetta'];
const ZONES=['Satellite Town','Defence Housing','City Centre','Garden Town','Model Town','Cantt Area','Saddar','Johar Town'];
const M_NAMES=['Ali Khan','Bilal Ahmed','Usman Ali','Omar Shafiq','Hamza Butt','Tariq Mehmood','Imran Rao','Asad Chaudhry',' mirza faisal ','Junaid Qureshi','faisal mirza','kamran dar','Hassan Raza'];
const F_NAMES=['Aisha Khan','Fatima Ali','Sara Ahmed','Zara Malik','Hina Tariq','Sana Mir','Nadia Hassan','Rabia Sheikh','Mehwish Zafar','Anum Riaz','Sumera Butt','Laila Khan'];
const REV_POOL=['🌊 Amazing service — professional, punctual, and very thorough.','✨ Did an excellent job. Clean, careful, and affordable. Will hire again.','💕 Very happy with the quality. Fair pricing and great attitude.','🫶 Quick response, very courteous, and impressively skilled.','⭐ Super satisfied! Everything was done perfectly to specification.','🌟 Best professional in the city! Very transparent about pricing.','💖 Went above and beyond every expectation. Truly 5 stars.'];
const SERVICES=[{icon:'⚡',label:'Electrician'},{icon:'🔧',label:'Plumber'},{icon:'🧹',label:'Cleaner'},{icon:'❄️',label:'AC Repair'},{icon:'🔨',label:'Carpenter'},{icon:'🎨',label:'Painter'},{icon:'📚',label:'Tutor'},{icon:'🚗',label:'Driver'},{icon:'🍳',label:'Chef'},{icon:'💄',label:'Beautician'},{icon:'🌿',label:'Gardener'},{icon:'🔩',label:'Mechanic'}];
const TESTIMONIALS=[{name:'Sara Ahmed',loc:'Lahore',r:5,text:'"Found a verified electrician in 10 minutes. Professional, punctual, and very reasonable. 🌊"',av:'https://randomuser.me/api/portraits/women/11.jpg'},{name:'Fatima Malik',loc:'Gujrat',r:5,text:'"The cleaning team was absolutely fantastic. My home looks completely new. ✨"',av:'https://randomuser.me/api/portraits/women/22.jpg'},{name:'Hina Tariq',loc:'Islamabad',r:5,text:'"Booked a Sunday emergency plumber. Arrived within 35 minutes. 💕"',av:'https://randomuser.me/api/portraits/women/33.jpg'},{name:'Zara Khan',loc:'Karachi',r:5,text:'"Love that verified female workers are available. Felt completely safe. 🫶"',av:'https://randomuser.me/api/portraits/women/44.jpg'}];
const EMRG_CATS=[{icon:'⚡',label:'Electric'},{icon:'🚿',label:'Water'},{icon:'❄️',label:'AC'},{icon:'🔐',label:'Lockout'},{icon:'🩺',label:'Medical'},{icon:'🔥',label:'Fire'}];
const MOCK_BOOKINGS=[{id:1,name:'Aisha Khan',skill:'Electrician',date:'May 21, 2025',time:'2:00 PM',price:1500,status:'confirmed'},{id:2,name:'Ali Raza',skill:'Plumber',date:'May 18, 2025',time:'10:00 AM',price:1200,status:'completed'},{id:3,name:'Sara Ahmed',skill:'Cleaner',date:'May 15, 2025',time:'9:00 AM',price:800,status:'completed'},{id:4,name:'Bilal Ahmed',skill:'AC Technician',date:'May 28, 2025',time:'3:00 PM',price:2000,status:'pending'}];
const NEARBY_WORKERS=[{name:'Ali Khan',skill:'Electrician',eta:'2 min',s:'🟢',img:'https://randomuser.me/api/portraits/men/1.jpg'},{name:'Bilal Ahmed',skill:'Plumber',eta:'5 min',s:'🟢',img:'https://randomuser.me/api/portraits/men/2.jpg'},{name:'Usman Ali',skill:'AC Tech',eta:'9 min',s:'🟡',img:'https://randomuser.me/api/portraits/men/3.jpg'}];

function genWorkers(){
  return Array.from({length:105},(_,i)=>{
    const isFem=i%2===0;
    const name=isFem?F_NAMES[i%F_NAMES.length]:M_NAMES[i%M_NAMES.length];
    const skill=SKILLS[i%SKILLS.length];
    const prof=PROFESSION_IMAGES[skill]||PROFESSION_IMAGES['Electrician'];
    const avatar=isFem?FALLBACK_AVATAR_F(i):FALLBACK_AVATAR_M(i);
    const revs=Array.from({length:Math.floor(Math.random()*4)+1},(_,ri)=>({id:ri,userName:isFem?M_NAMES[ri%M_NAMES.length]:F_NAMES[ri%F_NAMES.length],rating:Math.floor(Math.random()*2)+4,text:REV_POOL[(i+ri)%REV_POOL.length],date:new Date(Date.now()-Math.random()*90*864e5).toLocaleDateString('en-PK',{day:'numeric',month:'short',year:'numeric'}),verified:Math.random()>0.3}));
    const skills=[{name:'Communication',pct:70+Math.round(Math.random()*25)},{name:'Technical Skill',pct:75+Math.round(Math.random()*22)},{name:'Punctuality',pct:80+Math.round(Math.random()*18)},{name:'Quality of Work',pct:72+Math.round(Math.random()*25)}];
    return{id:i+1,name,email:`${name.toLowerCase().replace(/\s/g,'.')}@servire.pk`,phone:`+92 3${Math.floor(Math.random()*4)}0 ${Math.floor(Math.random()*9e6)+1e6}`,avatar,coverImage:prof.cover,portfolio:prof.portfolio.map((img,pi)=>({id:pi,image:img})),skill,subSkills:[SKILLS[(i+1)%SKILLS.length],SKILLS[(i+2)%SKILLS.length]],experience:Math.floor(Math.random()*14)+1,price:500+i*45,rating:+(revs.reduce((s,r)=>s+r.rating,0)/revs.length).toFixed(1),totalReviews:revs.length*18+12,reviews:revs,city:CITIES[i%CITIES.length],zone:ZONES[i%ZONES.length],availability:Math.random()>0.3?'available':'busy',verified:Math.random()>0.2,completedJobs:Math.floor(Math.random()*500)+20,joinDate:new Date(Date.now()-Math.random()*1000*864e5).toLocaleDateString('en-PK',{month:'long',year:'numeric'}),emergencyAvailable:Math.random()>0.5,languages:['Urdu','English',...(Math.random()>0.6?['Punjabi']:[])],skillBars:skills,bio:`🌊 Seasoned ${skill} with ${Math.floor(Math.random()*14)+1}+ years of professional excellence.\n\n✨ Known for meticulous work, honest pricing, and complete customer satisfaction.\n\n🌿 Serving ${CITIES[i%CITIES.length]} and surrounding areas with verified credentials.`};
  });
}
const WORKERS=genWorkers();
const EMPLOYEES=Array.from({length:105},(_,i)=>{const isFem=i%2===0;return{id:i+1,name:isFem?F_NAMES[i%F_NAMES.length]:M_NAMES[i%M_NAMES.length],avatar:isFem?FALLBACK_AVATAR_F(i):FALLBACK_AVATAR_M(i),department:['Management','Operations','Support','Verification','Finance','HR'][i%6],role:['Senior Executive','Manager','Specialist','Coordinator','Analyst'][i%5],rating:+(3+Math.random()*2).toFixed(1),status:Math.random()>0.15?'active':'on-leave'};});

/* ═══════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════ */
function useDebounce(v,d){const[dv,setDv]=useState(v);useEffect(()=>{const h=setTimeout(()=>setDv(v),d);return()=>clearTimeout(h);},[v,d]);return dv;}

/* ═══════════════════════════════════════════════════
   ERROR BOUNDARY
═══════════════════════════════════════════════════ */
class ErrorBoundary extends Component {
  constructor(props){super(props);this.state={hasError:false,error:null};}
  static getDerivedStateFromError(error){return{hasError:true,error:error.message};}
  componentDidCatch(error,info){console.error('Servire Error:',error,info);}
  render(){
    if(this.state.hasError)return(
      <div className="error-page">
        <div className="error-icon-big">💔</div>
        <h2 className="error-h">Application Error</h2>
        <p className="error-msg">{this.state.error||'Something unexpected happened.'}</p>
        <div className="error-btns">
          <button className="btn btn-jade" onClick={()=>window.location.reload()}>🔄 Reload App</button>
          <button className="btn btn-ghost" onClick={()=>window.location.href='/'}>🏠 Go Home</button>
        </div>
      </div>
    );
    return this.props.children;
  }
}

/* ═══════════════════════════════════════════════════
   LOADING SPINNER
═══════════════════════════════════════════════════ */
const LoadingSpinner = ({message='Loading...',sub='Please wait ✨'}) => (
  <div className="loading-page">
    <div className="spinner-ring"/>
    <div className="dot-loader"><span/><span/><span/></div>
    <div className="loading-title">{message}</div>
    <div className="loading-sub">{sub}</div>
  </div>
);

/* ═══════════════════════════════════════════════════
   SKELETON CARD
═══════════════════════════════════════════════════ */
const SkeletonCard = () => (
  <div className="sk-card card">
    <div className="skeleton sk-img"/>
    <div className="sk-body">
      <div className="skeleton sk-line w70" style={{height:16,marginBottom:10}}/>
      <div className="skeleton sk-line w50" style={{height:12,marginBottom:8}}/>
      <div className="skeleton sk-line w90" style={{height:12,marginBottom:8}}/>
      <div className="skeleton sk-line" style={{height:32,borderRadius:99,width:'60%'}}/>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════
   ERROR STATE
═══════════════════════════════════════════════════ */
const ErrorState = ({error,onRetry,title='Something went wrong!'}) => (
  <div className="error-page">
    <div className="error-icon-big">⚠️</div>
    <h2 className="error-h">{title}</h2>
    <p className="error-msg">{error||'Failed to load data. Please try again.'}</p>
    <div className="error-btns">
      {onRetry&&<button className="btn btn-jade" onClick={onRetry}>🔄 Try Again</button>}
      <Link className="btn btn-ghost" to="/">🏠 Go Home</Link>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════
   PROTECTED ROUTE
═══════════════════════════════════════════════════ */
const ProtectedRoute = ({children,requiredRole}) => {
  const {user} = useApp();
  if(!user) return <Navigate to="/login" replace/>;
  if(requiredRole&&user.role!==requiredRole) return <Navigate to="/dashboard" replace/>;
  return children;
};

/* ═══════════════════════════════════════════════════
   PAGE WRAPPER
═══════════════════════════════════════════════════ */
const PageWrapper = ({children}) => {
  const {pathname} = useLocation();
  return <div key={pathname} className="page-enter">{children}</div>;
};

/* ═══════════════════════════════════════════════════
   THEME TOGGLE
═══════════════════════════════════════════════════ */
const ThemeToggleBtn = () => {
  const {theme,toggleTheme} = useTheme();
  return (
    <button className="theme-toggle-btn" onClick={toggleTheme} title={`Switch to ${theme==='dark'?'light':'dark'} mode`}>
      {theme==='dark'?'☀️':'🌙'}
    </button>
  );
};

/* ═══════════════════════════════════════════════════
   HOORI BOT (unchanged)
═══════════════════════════════════════════════════ */
const HOORI_RESPONSES = [
  {keys:['hello','hi','hey','salam'],reply:'Hello! 👋 Welcome to Servire! I\'m Hoori, your AI assistant. How can I help?'},
  {keys:['book','booking','appointment','hire'],reply:'📅 To book a worker:\n1. Browse Workers page\n2. Click on a profile\n3. Click "Book Now"\n4. Select date & time\n5. Confirm! ✨',nav:{label:'Browse Workers →',to:'/workers'}},
  {keys:['electrician','electric','wiring'],reply:'⚡ We have verified electricians in all major cities. Avg rating: 4.8 ⭐',nav:{label:'Find Electricians →',to:'/workers'}},
  {keys:['plumber','plumbing','water','leak'],reply:'🔧 Our plumbers are available 24/7 including emergencies!',nav:{label:'Find Plumbers →',to:'/workers'}},
  {keys:['clean','cleaner','cleaning','maid'],reply:'🧹 Deep cleaning, regular maintenance, and office cleaning services.',nav:{label:'Find Cleaners →',to:'/workers'}},
  {keys:['ac','air condition','cooling'],reply:'❄️ AC technicians for installation, repair, and maintenance. Same-day available!',nav:{label:'Find AC Technicians →',to:'/workers'}},
  {keys:['emergency','urgent','sos','immediate'],reply:'🚨 Emergency services 24/7! Rapid response within minutes.',nav:{label:'Emergency Page →',to:'/emergency'}},
  {keys:['price','cost','rate','how much'],reply:'💰 Service prices range from Rs. 500 to Rs. 5,000+. All prices are shown transparently on worker profiles. No hidden fees!'},
  {keys:['verified','safe','trust','background'],reply:'✅ All professionals undergo ID verification, skill assessment, background screening, and reference checks.'},
  {keys:['category','categories','service type'],reply:'🗂 We offer 12 service categories!',nav:{label:'Browse Categories →',to:'/categories'}},
  {keys:['about','servire','company','what is'],reply:'🌊 Servire is Pakistan\'s trusted home service platform — 105+ workers, 10+ cities, 1,240+ jobs done!',nav:{label:'About Us →',to:'/about'}},
  {keys:['contact','support','problem'],reply:'📞 Support available Mon-Sat 9AM-8PM. Emergency support 24/7.',nav:{label:'Contact Us →',to:'/contact'}},
  {keys:['login','sign in'],reply:'🔐 Sign in to access your dashboard and bookings.',nav:{label:'Login →',to:'/login'}},
  {keys:['signup','register','join'],reply:'✨ Join Servire in under 2 minutes!',nav:{label:'Sign Up →',to:'/signup'}},
  {keys:['city','lahore','karachi','islamabad','gujrat'],reply:'📍 We\'re in 10+ cities: Gujrat, Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Sialkot, Quetta!'},
  {keys:['payment','pay','jazzcash','cash'],reply:'💳 Payment options: Cash, JazzCash, and Easypaisa — paid directly to the professional after service.'},
  {keys:['female','women','lady'],reply:'👩 Yes! Verified female professionals are available. Filter by "female worker" on the Workers page.',nav:{label:'Browse Workers →',to:'/workers'}},
  {keys:['thanks','thank you','great','awesome'],reply:'You\'re welcome! 🌊 Anything else I can help with?'},
  {keys:['bye','goodbye'],reply:'Goodbye! 👋 Come back anytime. Servire is always here for you! 🌊'},
];
const HOORI_DEFAULT = '🤔 I didn\'t catch that. Try asking about:\n• How to book a worker\n• Service categories\n• Pricing & payments\n• Emergency help';
const HOORI_CHIPS = ['🔍 Find Workers','📅 How to Book?','🚨 Emergency Help','💰 Pricing Info','✅ Verified Workers?','📍 Which Cities?'];

const HooriBot = () => {
  const navigate = useNavigate();
  const {addToast} = useApp();
  const [open,setOpen] = useState(false);
  const [msgs,setMsgs] = useState([{role:'bot',text:'🌊 Hi! I\'m Hoori, your Servire assistant!\n\nI can help you find workers, answer questions, or navigate the platform.'}]);
  const [input,setInput] = useState('');
  const [typing,setTyping] = useState(false);
  const [showTip,setShowTip] = useState(true);
  const scrollRef = useRef();

  useEffect(()=>{scrollRef.current?.scrollIntoView({behavior:'smooth'});},[msgs,typing]);
  useEffect(()=>{const t=setTimeout(()=>setShowTip(false),5000);return()=>clearTimeout(t);},[]);

  const findResponse = (txt) => {
    const lower = txt.toLowerCase();
    for(const r of HOORI_RESPONSES){
      if(r.keys.some(k=>lower.includes(k))) return r;
    }
    return null;
  };

  const send = async (text) => {
    const msg = text||input;
    if(!msg.trim()) return;
    setMsgs(p=>[...p,{role:'user',text:msg}]);
    setInput('');
    setTyping(true);
    await new Promise(r=>setTimeout(r,700+Math.random()*600));
    const res = findResponse(msg);
    setMsgs(p=>[...p,{role:'bot',text:res?res.reply:HOORI_DEFAULT,nav:res?.nav||null}]);
    setTyping(false);
  };

  return (<>
    <div className="hoori-btn" onClick={()=>{setOpen(p=>!p);setShowTip(false);}}>
      {showTip&&!open&&<div className="hoori-tip">💬 Ask Hoori!</div>}
      <div className="hoori-orb">
        <div className="hoori-eye l"/><div className="hoori-eye r"/>
        {!open&&<div className="hoori-badge"/>}
      </div>
    </div>
    {open&&(
      <div className="hoori-window">
        <div className="hoori-head">
          <div className="hoori-head-info">
            <div className="hoori-head-av">🌊</div>
            <div><div className="hoori-head-name">Hoori Assistant</div><div className="hoori-head-status">● Online · Instant replies</div></div>
          </div>
          <button className="hoori-close-btn" onClick={()=>setOpen(false)}>✕</button>
        </div>
        <div className="hoori-msgs">
          {msgs.map((m,i)=>(
            <div key={i} className={`h-msg ${m.role}`}>
              {m.role==='bot'&&<div className="h-msg-av">🌊</div>}
              <div className="h-msg-bubble">
                {m.text.split('\n').map((line,li)=><div key={li}>{line}</div>)}
                {m.nav&&<button className="h-nav-btn" onClick={()=>{navigate(m.nav.to);setOpen(false);addToast('✨ Navigating...');}}>🔗 {m.nav.label}</button>}
              </div>
            </div>
          ))}
          {typing&&(<div className="h-msg bot"><div className="h-msg-av">🌊</div><div className="h-typing"><span/><span/><span/></div></div>)}
          <div ref={scrollRef}/>
        </div>
        <div className="hoori-chips">
          {HOORI_CHIPS.map((c,i)=>(<button key={i} className="h-chip" onClick={()=>send(c.replace(/^[^\w]+/,'').trim())}>{c}</button>))}
        </div>
        <div className="hoori-input-row">
          <input className="hoori-input" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask me anything..."/>
          <button className="hoori-send" onClick={()=>send()}>Send</button>
        </div>
      </div>
    )}
  </>);
};

/* ═══════════════════════════════════════════════════
   PARTICLES
═══════════════════════════════════════════════════ */
const LANT=['🏮','✨','🌸','💫','🌊','⭐','🌿','🔮'];
const Particles=()=>(
  <div style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:2,overflow:'hidden'}}>
    {LANT.map((l,i)=>(
      <div key={i} style={{position:'absolute',fontSize:`${0.7+Math.random()*0.55}rem`,opacity:0,left:`${(i*13+5)%100}%`,animation:`lanternRise ${14+i*2.8}s ${i*2.5}s linear infinite`}}>{l}</div>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════
   CONFETTI
═══════════════════════════════════════════════════ */
const CONF_COLS=['#5CE0C8','#A8DAFF','#C4AAFF','#E8C96A','#FF7EB6','#FFB899'];
const Confetti=({show})=>{
  if(!show)return null;
  return(
    <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:600}}>
      {Array.from({length:80},(_,i)=>(
        <div key={i} className="conf" style={{left:`${Math.random()*100}%`,top:`${-5-Math.random()*15}%`,background:CONF_COLS[i%CONF_COLS.length],width:`${5+Math.random()*8}px`,height:`${5+Math.random()*8}px`,borderRadius:Math.random()>0.5?'50%':'3px',animationDelay:`${Math.random()*1.5}s`,animationDuration:`${2.2+Math.random()*2}s`}}/>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════ */
const Toast=({toasts})=>(
  <div className="toast-wrap">
    {toasts.map(t=><div key={t.id} className={`toast ${t.type||''}`}>{t.msg}</div>)}
  </div>
);

/* ═══════════════════════════════════════════════════
   NAVBAR — FULLY RESPONSIVE WITH HAMBURGER
═══════════════════════════════════════════════════ */
const NAV_ITEMS = [
  {to:'/', label:'Home', icon:'🏠'},
  {to:'/workers', label:'Workers', icon:'👷'},
  {to:'/categories', label:'Categories', icon:'🗂'},
  {to:'/portfolio', label:'Portfolio', icon:'📸'},
  {to:'/emergency', label:'Emergency', icon:'🚨'},
  {to:'/smartcity', label:'Smart City', icon:'📊'},
  {to:'/about', label:'About', icon:'🌊'},
  {to:'/contact', label:'Contact', icon:'💬'},
];

const Navbar=()=>{
  const {user,favorites}=useApp();
  const [scrolled,setScrolled]=useState(false);
  const [menuOpen,setMenuOpen]=useState(false);
  const navigate=useNavigate();
  const location=useLocation();

  useEffect(()=>{const h=()=>setScrolled(window.scrollY>30);window.addEventListener('scroll',h,{passive:true});return()=>window.removeEventListener('scroll',h);},[]);
  useEffect(()=>{setMenuOpen(false);},[location.pathname]);
  useEffect(()=>{document.body.style.overflow=menuOpen?'hidden':'';return()=>{document.body.style.overflow='';};},[menuOpen]);

  return (<>
    <nav className={`navbar ${scrolled?'scrolled':''}`}>
      <Link className="nav-brand" to="/" onClick={()=>setMenuOpen(false)}>✦ SERVIRE</Link>

      <div className="nav-links">
        {NAV_ITEMS.map(({to,label})=>(
          <NavLink key={to} className={({isActive})=>`nav-link${isActive?' active':''}`} to={to} end={to==='/'}>
            {label}
          </NavLink>
        ))}
        {user?.role==='admin'&&<NavLink className={({isActive})=>`nav-link${isActive?' active':''}`} to="/admin">Admin</NavLink>}
      </div>

      <div className="nav-actions">
        <Link className="btn btn-icon" style={{position:'relative',textDecoration:'none'}} to="/favorites" title="Favorites">
          💖
          {favorites.length>0&&<span style={{position:'absolute',top:-4,right:-4,background:'var(--jade)',color:'var(--ink)',borderRadius:99,fontSize:'0.55rem',padding:'1px 5px',fontWeight:800,lineHeight:1}}>{favorites.length}</span>}
        </Link>
        {user?(
          <Link className="btn btn-ghost btn-sm" to="/dashboard" style={{textDecoration:'none'}}>👤 {user.name.split(' ')[0]}</Link>
        ):(<>
          <Link className="btn btn-ghost btn-sm" to="/login" style={{textDecoration:'none'}}>Login</Link>
          <Link className="btn btn-jade btn-sm" to="/signup" style={{textDecoration:'none'}}>Sign Up ✦</Link>
        </>)}

        <button
          className={`hamburger ${menuOpen?'open':''}`}
          onClick={()=>setMenuOpen(p=>!p)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span/><span/><span/>
        </button>
      </div>
    </nav>

    {menuOpen&&<div className="mobile-menu-backdrop" onClick={()=>setMenuOpen(false)}/>}

    {menuOpen&&(
      <div className="mobile-menu" role="navigation" aria-label="Mobile navigation">
        {NAV_ITEMS.map(({to,label,icon},i)=>(
          <NavLink
            key={to}
            className={({isActive})=>`mobile-menu-item${isActive?' active':''}`}
            to={to}
            end={to==='/'}
            style={{animationDelay:`${i*0.04}s`}}
            onClick={()=>setMenuOpen(false)}
          >
            <span className="mi-icon">{icon}</span>
            {label}
          </NavLink>
        ))}
        {user?.role==='admin'&&(
          <>
            <div className="mobile-menu-divider"/>
            <NavLink className={({isActive})=>`mobile-menu-item${isActive?' active':''}`} to="/admin" onClick={()=>setMenuOpen(false)}>
              <span className="mi-icon">👑</span>Admin Panel
            </NavLink>
          </>
        )}
        <div className="mobile-menu-divider"/>
        <div className="mobile-menu-actions">
          {user?(
            <Link className="btn btn-jade w-full" to="/dashboard" style={{textDecoration:'none',justifyContent:'center'}} onClick={()=>setMenuOpen(false)}>
              👤 My Dashboard
            </Link>
          ):(<>
            <Link className="btn btn-ghost" to="/login" style={{textDecoration:'none',flex:1,justifyContent:'center'}} onClick={()=>setMenuOpen(false)}>Login</Link>
            <Link className="btn btn-jade" to="/signup" style={{textDecoration:'none',flex:2,justifyContent:'center'}} onClick={()=>setMenuOpen(false)}>Sign Up ✦</Link>
          </>)}
        </div>
      </div>
    )}
  </>);
};

/* ═══════════════════════════════════════════════════
   FOOTER — Professional SaaS Footer
═══════════════════════════════════════════════════ */
const Footer=()=>{
  const {addToast}=useApp();
  const QUICK_LINKS=[{to:'/workers',label:'Browse Workers'},{to:'/categories',label:'Categories'},{to:'/portfolio',label:'Portfolio'},{to:'/emergency',label:'Emergency'},{to:'/smartcity',label:'Smart City'}];
  const COMPANY_LINKS=[{to:'/about',label:'About Us'},{to:'/contact',label:'Contact'},{to:'/admin',label:'Admin Panel'}];
  const SUPPORT_LINKS=['FAQs','Privacy Policy','Terms of Service','Safety Tips','Careers','Blog'];

  return(
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand-col">
            <span className="footer-brand">✦ SERVIRE</span>
            <p className="footer-desc">
              Connecting verified home service professionals with families across Pakistan. Your comfort, our craft — since 2021.
            </p>
            <div className="footer-social">
              {[['📘','Facebook'],['🐦','Twitter'],['📸','Instagram'],['💬','WhatsApp'],['▶️','YouTube']].map(([ic,label])=>(
                <button key={label} className="footer-social-btn" title={label} aria-label={label}>{ic}</button>
              ))}
            </div>
            <div className="footer-badge">
              <span className="live-dot" style={{width:6,height:6}}/>
              <span>105+ workers online</span>
            </div>
          </div>

          <div className="footer-col">
            <div className="footer-heading">Pages</div>
            {QUICK_LINKS.map(({to,label})=>(
              <Link key={to} className="footer-link" to={to}>
                <span className="footer-link-dot"/>
                {label}
              </Link>
            ))}
          </div>

          <div className="footer-col">
            <div className="footer-heading">Company</div>
            {COMPANY_LINKS.map(({to,label})=>(
              <Link key={to} className="footer-link" to={to}>
                <span className="footer-link-dot"/>
                {label}
              </Link>
            ))}
            <div style={{marginTop:'1rem'}}>
              <div className="footer-heading">Newsletter</div>
              <div style={{display:'flex',gap:'0.4rem',flexWrap:'wrap'}}>
                <input
                  className="nl-input"
                  type="email"
                  placeholder="your@email.com"
                  style={{minWidth:0,flex:1,fontSize:'0.75rem',padding:'0.5rem 0.9rem'}}
                />
                <button className="btn btn-jade btn-sm" onClick={()=>addToast('Subscribed! 🌊','success')} style={{whiteSpace:'nowrap'}}>
                  Join ✦
                </button>
              </div>
            </div>
          </div>

          <div className="footer-col">
            <div className="footer-heading">Support</div>
            {SUPPORT_LINKS.map(s=>(
              <span key={s} className="footer-link" onClick={()=>addToast(`Opening ${s}...`,'')}>
                <span className="footer-link-dot"/>
                {s}
              </span>
            ))}
            <div style={{marginTop:'1rem'}}>
              <div style={{fontSize:'0.78rem',color:'var(--text2)',lineHeight:1.75}}>
                <div>📞 +92 300-SERVIRE</div>
                <div>📧 hello@servire.pk</div>
                <div>📍 Gujrat, Punjab</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copy">
          © 2025 <strong>Servire</strong> — Crafted with 🌊 in Pakistan
        </p>
        <div className="footer-legal">
          {['Privacy','Terms','Cookies','Sitemap'].map(l=>(
            <a key={l} href="#" onClick={e=>e.preventDefault()}>{l}</a>
          ))}
        </div>
        <span className="footer-tagline">VERIFIED · TRUSTED · LOVED</span>
      </div>
    </footer>
  );
};

/* ═══════════════════════════════════════════════════
   WORKER CARD (unchanged)
═══════════════════════════════════════════════════ */
const WorkerCard=({worker:w,onClick})=>{
  const{favorites,toggleFavorite,addToast}=useApp();
  const navigate=useNavigate();
  const liked=favorites.includes(w.id);
  const profImg=PROFESSION_IMAGES[w.skill]||PROFESSION_IMAGES['Electrician'];
  const handleClick=()=>onClick?onClick():navigate(`/worker/${w.id}`);
  const heart=e=>{
    e.stopPropagation();
    const added=toggleFavorite(w.id);
    addToast(added?`Saved ${w.name.split(' ')[0]}! 💖`:'Removed from saved','');
  };
  return(
    <div className="card wcard" onClick={handleClick}>
      <div className="wcard-img">
        <img
          src={w.avatar}
          alt={w.name}
          className="img-avatar"
          onError={e=>imgFallback(e, w.id%2===0?FALLBACK_AVATAR_F(w.id):FALLBACK_AVATAR_M(w.id))}
        />
        <div className="wcard-img-ov"/>
        {w.verified&&<span className="vbadge">✦ Verified</span>}
        <button className={`heart-btn ${liked?'liked':''}`} onClick={heart}>{liked?'❤️':'🤍'}</button>
        <div className="wcard-profession-tag">
          <span>{SERVICES.find(s=>s.label===w.skill||s.label.includes(w.skill.split(' ')[0]))?.icon||'👷'}</span>
          {w.skill}
        </div>
      </div>
      <div className="wcard-body">
        <div className="wcard-name">{w.name}</div>
        <div className="wcard-meta"><span>📍 {w.city}</span><span>⭐ {w.rating} ({w.totalReviews})</span></div>
        <div className="wcard-meta">
          <span>{w.availability==='available'?<><span className="sdot sdot-avail"/>Available</>:<><span className="sdot sdot-busy"/>Busy</>}</span>
          <span>✅ {w.completedJobs} jobs</span>
        </div>
        <div className="wcard-footer">
          <div className="wcard-price">Rs. {w.price.toLocaleString()}<span>/service</span></div>
          <button className="btn btn-jade btn-sm" onClick={e=>{e.stopPropagation();handleClick();}}>Book →</button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   BEFORE/AFTER SLIDER (unchanged)
═══════════════════════════════════════════════════ */
const BeforeAfterSlider=({before,after})=>{
  const[pos,setPos]=useState(50);
  const ref=useRef();
  const drag=useCallback(e=>{
    if(!ref.current)return;
    const r=ref.current.getBoundingClientRect();
    const x=(e.touches?e.touches[0].clientX:e.clientX)-r.left;
    setPos(Math.max(5,Math.min(95,(x/r.width)*100)));
  },[]);
  return(
    <div ref={ref} className="ba-slider" onMouseMove={drag} onTouchMove={drag}>
      <div className="ba-after">
        <img src={after} alt="After" style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>imgFallback(e)}/>
      </div>
      <div className="ba-before" style={{clipPath:`inset(0 ${100-pos}% 0 0)`}}>
        <img src={before} alt="Before" style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(0.75) saturate(0.7) grayscale(0.3)'}} onError={e=>imgFallback(e)}/>
      </div>
      <div className="ba-divider" style={{left:`${pos}%`}}><div className="ba-handle">⇔</div></div>
      <div style={{position:'absolute',top:12,left:16,background:'rgba(6,13,24,0.8)',color:'var(--text3)',fontSize:'0.65rem',fontWeight:700,padding:'2px 8px',borderRadius:99}}>BEFORE</div>
      <div style={{position:'absolute',top:12,right:16,background:'rgba(92,224,200,0.2)',color:'var(--jade)',fontSize:'0.65rem',fontWeight:700,padding:'2px 8px',borderRadius:99,border:'1px solid rgba(92,224,200,0.4)'}}>AFTER</div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   EMERGENCY MODAL (unchanged)
═══════════════════════════════════════════════════ */
const EmergencyModal=({onClose})=>{
  const{addToast}=useApp();
  const[phase,setPhase]=useState('select');
  const[sel,setSel]=useState('');
  const req=()=>{if(!sel){addToast('Please select emergency type','error');return;}setPhase('scanning');setTimeout(()=>setPhase('found'),3200);};
  return(
    <div className="modal-ov" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal-box emrg-box">
        <div className="modal-header">
          <div><div className="modal-title" style={{color:'var(--rose)'}}>🚨 Emergency Rescue</div><div style={{fontSize:'0.75rem',color:'var(--text3)',marginTop:2}}>24/7 rapid response system</div></div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {phase==='select'&&(<>
            <p style={{fontSize:'0.84rem',color:'var(--text2)',marginBottom:'1.2rem',lineHeight:1.7}}>Select your emergency type and we'll dispatch the nearest verified professional immediately.</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'0.6rem',marginBottom:'1.5rem'}}>
              {EMRG_CATS.map(c=>(<div key={c.label} className={`emrg-cat ${sel===c.label?'sel':''}`} onClick={()=>setSel(c.label)}><span style={{fontSize:'1.8rem'}}>{c.icon}</span>{c.label}</div>))}
            </div>
            <button className="btn w-full" style={{background:'linear-gradient(135deg,rgba(255,126,182,0.28),rgba(196,170,255,0.22))',color:'var(--rose)',border:'1px solid rgba(255,126,182,0.45)',justifyContent:'center',fontWeight:700,padding:'0.8rem'}} onClick={req}>🚨 Request Emergency Help</button>
          </>)}
          {phase==='scanning'&&(
            <div style={{textAlign:'center',padding:'1rem 0'}}>
              <div className="radar-wrap">
                <div className="radar-ring" style={{width:58,height:58,transform:'translate(-50%,-50%)'}}/>
                <div className="radar-ring" style={{width:88,height:88,transform:'translate(-50%,-50%)'}}/>
                <div className="radar-pulse" style={{width:58,height:58}}/><div className="radar-pulse" style={{width:58,height:58,animationDelay:'0.8s'}}/>
                <div className="radar-dot"/>
              </div>
              <div style={{fontFamily:'var(--serif)',color:'var(--rose)',marginBottom:'0.5rem'}}>Scanning nearby...</div>
            </div>
          )}
          {phase==='found'&&(<>
            <div style={{textAlign:'center',marginBottom:'1.5rem'}}><div style={{fontSize:'2.5rem',marginBottom:'0.5rem'}}>✅</div><div style={{fontFamily:'var(--serif2)',fontSize:'1rem',color:'var(--jade)',fontWeight:600}}>3 professionals found nearby</div></div>
            {NEARBY_WORKERS.map(w=>(
              <div key={w.name} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.85rem 1rem',marginBottom:'0.5rem',background:'var(--surface)',border:'1px solid var(--border2)',borderRadius:'var(--r-md)'}}>
                <div style={{display:'flex',alignItems:'center',gap:'0.7rem'}}>
                  <img src={w.img} alt={w.name} style={{width:40,height:40,borderRadius:'50%',objectFit:'cover',border:'1.5px solid rgba(255,126,182,0.5)'}} onError={e=>imgFallback(e,FALLBACK_AVATAR_M())}/>
                  <div><div style={{fontWeight:700,fontSize:'0.85rem',color:'var(--text)'}}>{w.name}</div><div style={{fontSize:'0.72rem',color:'var(--text3)'}}>{w.skill}</div></div>
                </div>
                <div style={{textAlign:'right'}}><div style={{fontSize:'0.8rem',color:'var(--jade)',fontWeight:700}}>ETA {w.eta}</div><div style={{fontSize:'0.72rem'}}>{w.s} Available</div></div>
              </div>
            ))}
            <button className="btn btn-rose w-full mt-4" style={{justifyContent:'center'}} onClick={()=>{addToast('Help dispatched! ETA 2 minutes 🚨','success');onClose();}}>📞 Dispatch Nearest Professional</button>
          </>)}
        </div>
      </div>
    </div>
  );
};
const EmergencyFloat=()=>{const[open,setOpen]=useState(false);return(<><div className="emrg-float" onClick={()=>setOpen(true)} title="Emergency Help">🚨</div>{open&&<EmergencyModal onClose={()=>setOpen(false)}/>}</>);};

/* ═══════════════════════════════════════════════════
   HOME PAGE (with improved text contrast)
═══════════════════════════════════════════════════ */
const HomePage=()=>{
  const{addToast}=useApp();
  const navigate=useNavigate();
  const[tiIdx,setTiIdx]=useState(0);
  const[cnt,setCnt]=useState({w:0,j:0,c:0,r:'0.0'});
  useEffect(()=>{const iv=setInterval(()=>setTiIdx(p=>(p+1)%TESTIMONIALS.length),4000);return()=>clearInterval(iv);},[]);
  useEffect(()=>{
    let fr;const start=Date.now();
    const go=()=>{const el=Math.min((Date.now()-start)/1700,1),e2=1-Math.pow(1-el,3);setCnt({w:Math.floor(105*e2),j:Math.floor(1240*e2),c:Math.floor(10*e2),r:(4.8*e2).toFixed(1)});if(el<1)fr=requestAnimationFrame(go);};
    fr=requestAnimationFrame(go);return()=>cancelAnimationFrame(fr);
  },[]);

  const PROF_GRID = [
    {img:'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=900&q=80&auto=format&fit=crop',label:'Electrician',spanTall:true},
    {img:'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80&auto=format&fit=crop',label:'Cleaning'},
    {img:'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80&auto=format&fit=crop',label:'Carpentry'},
    {img:'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&q=80&auto=format&fit=crop',label:'Chef Services'},
    {img:'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&q=80&auto=format&fit=crop',label:'Plumbing'},
  ];

  return(
    <PageWrapper>
      <div className="hero">
        <div className="hero-bg"/><div className="hero-city"/><div className="hero-mist"/>
        <Particles/>
        <div className="hero-content">
          <div className="hero-eyebrow"><span>🌊</span><span>Trusted by 10,000+ Families Across Pakistan</span></div>
          <h1 className="hero-title">Find Your<br/><span className="grad">Perfect Service</span><br/>Partner</h1>
          <p className="hero-sub">Connect with verified, trusted professionals who treat your home with the care it deserves.</p>
          <div className="hero-btns">
            <button className="btn btn-jade btn-lg" onClick={()=>navigate('/signup')}>✦ Get Started Free</button>
            <button className="btn btn-outline btn-lg" onClick={()=>navigate('/workers')}>Browse Workers 🌊</button>
            <button className="btn btn-ghost btn-lg" onClick={()=>navigate('/emergency')} style={{borderColor:'rgba(255,126,182,0.4)',color:'var(--rose)'}}>🚨 Emergency</button>
          </div>
          <div className="hero-stats">
            {[[cnt.w+'+','Verified Workers'],[cnt.j+'+','Jobs Completed'],[cnt.c+'+','Cities'],[cnt.r+'⭐','Avg Rating']].map(([n,l])=>(
              <div key={l}><div className="hstat-num">{n}</div><div className="hstat-label">{l}</div></div>
            ))}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="profession-grid" style={{maxWidth:'100%',margin:'0 auto'}}>
          {PROF_GRID.map((item,i)=>(
            <div key={i} className={`profession-grid-item${item.spanTall?' span-tall':''}`} style={item.spanTall?{gridRow:'1/3'}:{}} onClick={()=>navigate('/categories')}>
              <img src={item.img} alt={item.label} onError={e=>imgFallback(e)}/>
              <div className="overlay"/>
              <div className="label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section" style={{paddingTop:'0rem'}}>
        <div className="sec-head"><div className="sec-divider">✦</div><span className="sec-eyebrow">What can we help with?</span><h2>Our Services</h2><p>From emergency repairs to everyday home maintenance.</p></div>
        <div className="srv-grid" style={{maxWidth:'100%',margin:'0 auto'}}>
          {SERVICES.map(s=>(<button key={s.label} className="srv-btn" onClick={()=>navigate('/categories')}><span className="si">{s.icon}</span>{s.label}</button>))}
        </div>
      </div>

      <div className="section" style={{paddingTop:'0rem'}}>
        <div className="sec-head"><div className="sec-divider">✦</div><span className="sec-eyebrow">Handpicked for you</span><h2>Top Rated Professionals</h2><p>Our highest-rated verified experts, ready to serve.</p></div>
        <div className="g4" style={{maxWidth:'100%',margin:'0 auto'}}>
          {WORKERS.sort((a,b)=>b.rating-a.rating).slice(0,8).map(w=>(<WorkerCard key={w.id} worker={w}/>))}
        </div>
        <div className="text-center mt-4"><button className="btn btn-outline btn-lg" onClick={()=>navigate('/workers')}>View All 105 Workers →</button></div>
      </div>

      <div style={{background:'rgba(92,224,200,0.05)',borderTop:'1px solid var(--border2)',borderBottom:'1px solid var(--border2)',padding:'clamp(3rem,6vw,5rem) 0'}}>
        <div className="container-safe" style={{maxWidth:1300,margin:'0 auto'}}>
          <div className="sec-head"><div className="sec-divider">✦</div><span className="sec-eyebrow">Simple & effortless</span><h2>How Servire Works</h2></div>
          <div className="steps" style={{maxWidth:'100%'}}>
            {[{n:1,ic:'🔍',t:'Search & Filter',d:'Browse 100+ verified professionals by skill, city, rating, and price range.'},{n:2,ic:'💖',t:'Compare & Choose',d:'View detailed profiles, genuine reviews, portfolios, and transparent pricing.'},{n:3,ic:'🎉',t:'Book & Relax',d:'Confirm in seconds. Your professional arrives on time, every time — guaranteed.'}].map(s=>(
              <div key={s.n} className="step-card card"><div className="step-num">{s.n}</div><div style={{fontSize:'2.6rem',margin:'0.7rem 0'}}>{s.ic}</div><div className="step-title">{s.t}</div><div className="step-desc">{s.d}</div></div>
            ))}
          </div>
        </div>
      </div>

      <div style={{padding:'clamp(2.5rem,5vw,4rem) 0'}}>
        <div className="container-safe" style={{maxWidth:1300,margin:'0 auto'}}>
          <div className="stats-strip">
            {[['105+','Verified Workers'],['1,240+','Jobs Completed'],['4.8 ⭐','Avg Rating'],['10+','Cities Covered']].map(([n,l])=>(<div key={l}><div className="ss-num">{n}</div><div className="ss-label">{l}</div></div>))}
          </div>
        </div>
      </div>

      <div className="section" style={{paddingTop:'0rem'}}>
        <div className="sec-head"><div className="sec-divider">✦</div><span className="sec-eyebrow">Customer voices</span><h2>What Our Clients Say</h2></div>
        <div className="g2" style={{maxWidth:'100%',margin:'0 auto'}}>
          {TESTIMONIALS.map((t,i)=>(
            <div key={i} className="testi card" style={{opacity:i===tiIdx||i===(tiIdx+1)%4?1:0.52,transform:i===tiIdx?'scale(1.025)':'scale(1)',transition:'all 0.5s var(--ease)'}}>
              <div className="stars">{'⭐'.repeat(t.r)}</div>
              <p className="testi-quote mt-2">{t.text}</p>
              <div className="flex items-center gap-3">
                <img src={t.av} alt={t.name} className="testi-av" onError={e=>imgFallback(e,FALLBACK_AVATAR_F(i))}/>
                <div><div className="testi-name">{t.name}</div><div className="testi-loc">📍 {t.loc}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-safe" style={{maxWidth:1300,margin:'0 auto 4rem auto'}}>
        <div style={{background:'linear-gradient(135deg,rgba(92,224,200,0.1),rgba(168,218,255,0.07))',border:'1px solid rgba(92,224,200,0.22)',borderRadius:'var(--r-xl)',padding:'clamp(2rem,4vw,3.5rem) clamp(1.25rem,4vw,2.5rem)',textAlign:'center',backdropFilter:'blur(16px)'}}>
          <h2 style={{fontFamily:'var(--serif)',fontSize:'clamp(1.5rem,4vw,2rem)',fontWeight:700,color:'var(--text)',marginBottom:'0.5rem',letterSpacing:'0.05em'}}>Stay in the Current 🌊</h2>
          <p style={{color:'var(--text2)',marginBottom:'1.75rem',fontSize:'0.93rem',fontFamily:'var(--serif2)',fontStyle:'italic'}}>Updates on new professionals, special offers, and home care tips.</p>
          <div className="nl-wrap" style={{justifyContent:'center'}}>
            <input className="nl-input" type="email" placeholder="your@email.com"/>
            <button className="btn btn-jade" onClick={()=>addToast('Subscribed! 🌊','success')}>Subscribe ✦</button>
          </div>
        </div>
      </div>
      <Footer/>
    </PageWrapper>
  );
};

/* ═══════════════════════════════════════════════════
   WORKERS DIRECTORY (updated spacing)
═══════════════════════════════════════════════════ */
const WorkersDirectory=()=>{
  const navigate=useNavigate();
  const[search,setSearch]=useState('');
  const[fSkill,setFSkill]=useState('');
  const[fCity,setFCity]=useState('');
  const[fRating,setFRating]=useState(0);
  const[fVerified,setFVerified]=useState(false);
  const[fAvail,setFAvail]=useState('');
  const[sort,setSort]=useState('rating');
  const[cp,setCp]=useState(1);
  const[loading,setLoading]=useState(true);
  const[error,setError]=useState(null);
  const[workers,setWorkers]=useState([]);
  const PER=12;
  const deb=useDebounce(search,300);

  const load=useCallback(async()=>{
    setLoading(true);setError(null);
    try{await new Promise(r=>setTimeout(r,700));setWorkers(WORKERS);}
    catch(e){setError(e.message);}
    finally{setLoading(false);}
  },[]);
  useEffect(()=>{load();},[load]);

  const filtered=workers.filter(w=>{
    if(deb&&!w.name.toLowerCase().includes(deb.toLowerCase())&&!w.skill.toLowerCase().includes(deb.toLowerCase()))return false;
    if(fSkill&&w.skill!==fSkill)return false;
    if(fCity&&w.city!==fCity)return false;
    if(fRating&&w.rating<fRating)return false;
    if(fVerified&&!w.verified)return false;
    if(fAvail&&w.availability!==fAvail)return false;
    return true;
  }).sort((a,b)=>sort==='rating'?b.rating-a.rating:sort==='price_asc'?a.price-b.price:sort==='price_desc'?b.price-a.price:b.completedJobs-a.completedJobs);
  const pages=Math.ceil(filtered.length/PER);
  const paged=filtered.slice((cp-1)*PER,cp*PER);
  const reset=()=>{setFSkill('');setFCity('');setFRating(0);setFVerified(false);setFAvail('');setSearch('');setCp(1);};

  if(error)return <ErrorState error={error} onRetry={load}/>;

  return(
    <PageWrapper>
      <div className="dir-page">
        <div className="dir-header">
          <div className="container-safe" style={{width:'100%',padding:'0'}}>
            <button className="back-btn" onClick={()=>navigate('/')}>← Back to Home</button>
            <h1 style={{fontFamily:'var(--serif)',fontSize:'clamp(1.6rem,4vw,2.2rem)',fontWeight:700,letterSpacing:'0.04em',color:'var(--text)',marginBottom:'0.2rem',marginTop:'0.5rem'}}>Find Your Professional 🌊</h1>
            <p style={{color:'var(--text2)',fontSize:'0.88rem',fontFamily:'var(--serif2)',fontStyle:'italic'}}>Verified experts ready to serve you across Pakistan</p>
          </div>
        </div>
        <div className="dir-controls">
          <div className="search-wrap" style={{flex:1}}><span className="search-ico">🔍</span><input className="input" value={search} onChange={e=>{setSearch(e.target.value);setCp(1);}} placeholder="Search by name or skill..."/></div>
          <select className="input" style={{width:'auto'}} value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="rating">Top Rated</option><option value="price_asc">Price: Low–High</option><option value="price_desc">Price: High–Low</option><option value="jobs">Most Jobs</option>
          </select>
          <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',alignItems:'center'}}>
            {['Gujrat','Lahore','Karachi','Islamabad','Faisalabad'].map(c=>(<button key={c} className={`f-chip ${fCity===c?'active':''}`} onClick={()=>{setFCity(fCity===c?'':c);setCp(1);}}>{c}</button>))}
            <button className="f-chip" onClick={reset}>Clear ✕</button>
          </div>
        </div>
        <div className="dir-body">
          <aside className="fsidebar">
            <div className="card" style={{padding:'1.3rem'}}>
              <div style={{fontFamily:'var(--serif)',fontSize:'0.9rem',fontWeight:700,color:'var(--jade)',marginBottom:'1rem',letterSpacing:'0.08em'}}>FILTERS</div>
              <div><div className="fs-title">Category</div>{SKILLS.map(s=>(<label key={s} className="fs-opt"><input type="radio" name="skill" checked={fSkill===s} onChange={()=>{setFSkill(fSkill===s?'':s);setCp(1);}}/>{s}</label>))}</div>
              <div className="sep"/>
              <div><div className="fs-title">Min Rating</div><input type="range" min={0} max={5} step={0.5} value={fRating} onChange={e=>{setFRating(+e.target.value);setCp(1);}}/><div style={{fontSize:'0.75rem',color:'var(--jade)',fontWeight:700,marginTop:4}}>{fRating>0?`⭐ ${fRating}+`:'All Ratings'}</div></div>
              <div className="sep"/>
              <div><div className="fs-title">City</div>{CITIES.slice(0,6).map(c=>(<label key={c} className="fs-opt"><input type="radio" name="city" checked={fCity===c} onChange={()=>{setFCity(fCity===c?'':c);setCp(1);}}/>{c}</label>))}</div>
              <div className="sep"/>
              <div><div className="fs-title">Availability</div>{[['available','Available Now'],['busy','Busy']].map(([v,l])=>(<label key={v} className="fs-opt"><input type="radio" name="avail" checked={fAvail===v} onChange={()=>{setFAvail(fAvail===v?'':v);setCp(1);}}/>{l}</label>))}</div>
              <div className="sep"/>
              <label className="fs-opt"><input type="checkbox" checked={fVerified} onChange={e=>{setFVerified(e.target.checked);setCp(1);}}/> Verified Only ✦</label>
              <button className="btn btn-outline w-full mt-4" onClick={reset} style={{justifyContent:'center'}}>Reset Filters</button>
            </div>
          </aside>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:'0.78rem',color:'var(--text3)',marginBottom:'1rem'}}>{loading?'Loading...':`${filtered.length} professionals found`}</div>
            {loading?(
              <div className="g3">{Array.from({length:6}).map((_,i)=><SkeletonCard key={i}/>)}</div>
            ):paged.length>0?(
              <div className="g3">{paged.map(w=><WorkerCard key={w.id} worker={w}/>)}</div>
            ):(
              <div className="empty-state"><div className="empty-icon">🌊</div><div className="empty-title">No professionals found</div><div className="empty-desc">Try adjusting your filters or search terms</div><button className="btn btn-jade mt-4" onClick={reset} style={{justifyContent:'center'}}>Clear Filters</button></div>
            )}
            {!loading&&<div className="pagination">{Array.from({length:Math.min(pages,8)},(_,i)=>(<button key={i+1} className={`pbtn ${cp===i+1?'active':''}`} onClick={()=>setCp(i+1)}>{i+1}</button>))}{pages>8&&<button className="pbtn">…</button>}</div>}
          </div>
        </div>
        <Footer/>
      </div>
    </PageWrapper>
  );
};

/* ═══════════════════════════════════════════════════
   BOOKING MODAL (unchanged)
═══════════════════════════════════════════════════ */
const BookingModal=({worker:w,onClose,onConfirm})=>{
  const[date,setDate]=useState('');
  const[time,setTime]=useState('');
  const[addr,setAddr]=useState('');
  const[notes,setNotes]=useState('');
  const[emerg,setEmerg]=useState(false);
  const[errs,setErrs]=useState({});
  const SLOTS=['9:00 AM','10:00 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM'];
  const fee=emerg?Math.round(w.price*0.5):0;
  const total=w.price+fee;
  const today=new Date().toISOString().split('T')[0];
  const validate=()=>{const e={};if(!date)e.date='Please select a date';if(!time)e.time='Please select a time slot';if(!addr.trim())e.addr='Address is required';setErrs(e);return!Object.keys(e).length;};
  return(
    <div className="modal-ov" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal-box">
        <div className="modal-header"><div><div className="modal-title">Book Service ✦</div><div style={{fontSize:'0.75rem',color:'var(--text2)',marginTop:2}}>with {w.name} · {w.skill}</div></div><button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button></div>
        <div className="modal-body">
          <div className="form-group"><label className="form-label">Select Date</label><input className={`input ${errs.date?'err':date?'ok':''}`} type="date" min={today} value={date} onChange={e=>setDate(e.target.value)}/>{errs.date&&<div className="form-error">📅 {errs.date}</div>}</div>
          <div className="form-group"><label className="form-label">Select Time</label><div className="time-slots">{SLOTS.map(t=><button key={t} className={`tslot ${time===t?'sel':''}`} onClick={()=>setTime(t)}>{t}</button>)}</div>{errs.time&&<div className="form-error mt-2">⏰ {errs.time}</div>}</div>
          <div className="form-group mt-3"><label className="form-label">Your Address</label><input className={`input ${errs.addr?'err':addr?'ok':''}`} placeholder="House #, Street, Area, City" value={addr} onChange={e=>setAddr(e.target.value)}/>{errs.addr&&<div className="form-error">📍 {errs.addr}</div>}</div>
          <div className="form-group"><label className="form-label">Special Instructions (optional)</label><textarea className="input" style={{minHeight:70}} placeholder="Any special requirements..." value={notes} onChange={e=>setNotes(e.target.value)}/></div>
          {w.emergencyAvailable&&(<div className="form-group"><label className="fs-opt" style={{cursor:'pointer'}}><input type="checkbox" checked={emerg} onChange={e=>setEmerg(e.target.checked)}/> 🚨 Emergency Priority (+50% fee)</label></div>)}
          <div className="price-box">
            <div className="price-row"><span>Base Price</span><span>Rs. {w.price.toLocaleString()}</span></div>
            {emerg&&<div className="price-row"><span>Emergency Fee</span><span>Rs. {fee.toLocaleString()}</span></div>}
            <div className="price-row price-total"><span>Total</span><span>Rs. {total.toLocaleString()}</span></div>
          </div>
          <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid var(--border2)',borderRadius:10,padding:'0.7rem',fontSize:'0.72rem',color:'var(--text3)',marginBottom:'1rem'}}>⚠️ Demo mode — no real booking is processed.</div>
          <div style={{display:'flex',gap:'0.7rem'}}>
            <button className="btn btn-ghost w-full" onClick={onClose} style={{justifyContent:'center'}}>Cancel</button>
            <button className="btn btn-jade w-full" onClick={()=>validate()&&onConfirm({date,time,addr,notes,emerg,total})} style={{justifyContent:'center'}}>✦ Confirm Booking</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   CONFIRM PAGE (unchanged)
═══════════════════════════════════════════════════ */
const ConfirmPage=({worker,booking})=>{
  const navigate=useNavigate();
  const[showConf,setShowConf]=useState(true);
  const bkId=`SRV_${Date.now().toString(36).toUpperCase()}`;
  useEffect(()=>{const t=setTimeout(()=>setShowConf(false),4800);return()=>clearTimeout(t);},[]);
  return(
    <div className="confirm-page">
      <Confetti show={showConf}/>
      <div className="confirm-box card">
        <div className="confirm-icon">🎉</div>
        <div className="confirm-title">Booking Confirmed!</div>
        <p style={{color:'var(--text2)',fontSize:'0.88rem',marginBottom:'0.5rem'}}>Your booking with <strong style={{color:'var(--jade)'}}>{worker.name}</strong> is set.</p>
        <div className="confirm-detail">
          {[['Booking ID',bkId],['Worker',`${worker.name} (${worker.skill})`],['Date',booking.date],['Time',booking.time],['Address',booking.addr],['Total',`Rs. ${booking.total.toLocaleString()}`],['Type',booking.emerg?'🚨 Emergency':'✦ Standard']].map(([l,v])=>(
            <div key={l} className="confirm-row"><span className="cr-label">{l}</span><span className="cr-val">{v}</span></div>
          ))}
        </div>
        <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap'}}>
          <button className="btn btn-jade" style={{flex:1,justifyContent:'center'}} onClick={()=>navigate('/')}>🏠 Home</button>
          <button className="btn btn-ghost" style={{flex:1,justifyContent:'center'}} onClick={()=>navigate('/dashboard')}>📋 My Bookings</button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   WORKER DETAIL (updated spacing)
═══════════════════════════════════════════════════ */
const WorkerDetail=()=>{
  const{id}=useParams();
  const navigate=useNavigate();
  const{favorites,toggleFavorite,addToast}=useApp();
  const[worker,setWorker]=useState(null);
  const[loading,setLoading]=useState(true);
  const[error,setError]=useState(null);
  const[showBook,setShowBook]=useState(false);
  const[bookData,setBookData]=useState(null);
  const[skillsVisible,setSkillsVisible]=useState(false);

  const load=useCallback(async()=>{
    setLoading(true);setError(null);
    try{
      await new Promise(r=>setTimeout(r,500));
      const found=WORKERS.find(w=>w.id===parseInt(id));
      if(!found)throw new Error('Worker not found. They may have left the platform.');
      setWorker(found);
    }catch(e){setError(e.message);}
    finally{setLoading(false);}
  },[id]);

  useEffect(()=>{load();},[load]);
  useEffect(()=>{if(worker){const t=setTimeout(()=>setSkillsVisible(true),400);return()=>clearTimeout(t);}},[worker]);

  if(loading)return <LoadingSpinner message="Loading worker profile..." sub="Fetching details and portfolio ✨"/>;
  if(error)return <ErrorState error={error} onRetry={load}/>;
  if(!worker)return <ErrorState error="Worker not found"/>;
  if(bookData)return <ConfirmPage worker={worker} booking={bookData}/>;

  const liked=favorites.includes(worker.id);
  const profImgs=PROFESSION_IMAGES[worker.skill]||PROFESSION_IMAGES['Electrician'];

  return(
    <PageWrapper>
      {showBook&&<BookingModal worker={worker} onClose={()=>setShowBook(false)} onConfirm={d=>{setShowBook(false);setBookData(d);}}/>}
      <div className="detail-page">
        <div className="detail-cover">
          <img src={profImgs.cover} alt="cover" className="img-cover" onError={e=>imgFallback(e)}/>
          <div className="detail-cover-ov"/>
          <div style={{position:'absolute',bottom:20,right:20,zIndex:4,background:'rgba(6,13,24,0.82)',backdropFilter:'blur(12px)',border:'1px solid rgba(92,224,200,0.3)',borderRadius:'var(--r-lg)',padding:'0.6rem 1.1rem',display:'flex',alignItems:'center',gap:'0.6rem'}}>
            <span style={{fontSize:'1.5rem'}}>{SERVICES.find(s=>s.label===worker.skill||s.label.includes(worker.skill.split(' ')[0]))?.icon||'👷'}</span>
            <div><div style={{fontFamily:'var(--serif)',fontSize:'0.9rem',fontWeight:700,color:'var(--text)',letterSpacing:'0.05em'}}>{worker.skill}</div><div style={{fontSize:'0.68rem',color:'var(--jade)'}}>{worker.experience}+ years experience</div></div>
          </div>
        </div>
        <div className="detail-wrap">
          <div className="container-safe" style={{width:'100%',padding:'0'}}>
            <button className="back-btn mt-2" onClick={()=>navigate('/workers')}>← Back to Workers</button>
          </div>
          <div className="detail-profile" style={{paddingLeft:'clamp(1rem, 5vw, 3rem)',paddingRight:'clamp(1rem, 5vw, 3rem)'}}>
            <img src={worker.avatar} alt={worker.name} className="detail-avatar" onError={e=>imgFallback(e, worker.id%2===0?FALLBACK_AVATAR_F(worker.id):FALLBACK_AVATAR_M(worker.id))}/>
            <div style={{flex:1,minWidth:0}}>
              <div className="detail-name">{worker.name}</div>
              <span className="detail-badge">{worker.skill}</span>
              <div style={{display:'flex',gap:'0.7rem',alignItems:'center',flexWrap:'wrap',marginBottom:'0.5rem'}}>
                <span style={{color:'var(--gold)'}}>{'⭐'.repeat(Math.floor(worker.rating))}</span>
                <span style={{fontSize:'0.8rem',color:'var(--text2)'}}>{worker.rating} ({worker.totalReviews} reviews)</span>
                {worker.verified&&<span style={{background:'rgba(92,224,200,0.15)',color:'var(--jade)',padding:'2px 10px',borderRadius:99,fontSize:'0.68rem',fontWeight:700}}>✦ Verified</span>}
              </div>
              <div style={{fontSize:'0.8rem',color:'var(--text2)'}}>📍 {worker.zone}, {worker.city}</div>
            </div>
            <div style={{display:'flex',gap:'0.65rem',flexWrap:'wrap',alignSelf:'flex-end'}}>
              <button className="btn btn-jade btn-lg" onClick={()=>setShowBook(true)}>📅 Book Now</button>
              <button className="btn btn-ghost" onClick={()=>{const a=toggleFavorite(worker.id);addToast(a?'Saved! 💖':'Removed','');}}>{liked?'❤️ Saved':'🤍 Save'}</button>
              <button className="btn btn-ghost" onClick={()=>addToast('Link copied! 🔗','')}>🔗 Share</button>
            </div>
          </div>
          <div className="dstat-grid" style={{paddingLeft:'clamp(1rem, 5vw, 3rem)',paddingRight:'clamp(1rem, 5vw, 3rem)'}}>
            {[[`${worker.experience}+ yrs`,'Experience'],[`${worker.completedJobs}`,'Jobs Done'],[`${worker.rating} ⭐`,'Rating'],['<30 min','Response']].map(([n,l])=>(
              <div key={l} className="dstat card"><div className="dstat-num">{n}</div><div className="dstat-label">{l}</div></div>
            ))}
          </div>
          <div className="g2" style={{gap:'2.5rem',alignItems:'start',paddingLeft:'clamp(1rem, 5vw, 3rem)',paddingRight:'clamp(1rem, 5vw, 3rem)'}}>
            <div>
              <div className="sec-title">About</div>
              <p style={{fontSize:'0.88rem',color:'var(--text2)',lineHeight:1.9,whiteSpace:'pre-line'}}>{worker.bio}</p>
              <div className="mt-4">
                <div className="sec-title">Skill Assessment</div>
                {worker.skillBars.map(s=>(<div key={s.name} className="skill-bar-wrap"><div className="skill-bar-label"><span>{s.name}</span><span style={{color:'var(--jade)',fontWeight:700}}>{s.pct}%</span></div><div className="skill-bar-track"><div className="skill-bar-fill" style={{width:skillsVisible?`${s.pct}%`:'0%'}}/></div></div>))}
              </div>
              <div className="mt-4"><div className="sec-title">Tags</div><div className="skill-tags">{[worker.skill,...worker.subSkills].map(s=><span key={s} className="stag">{s}</span>)}</div></div>
              <div className="mt-4"><div className="sec-title">Languages</div><div className="skill-tags">{worker.languages.map(l=><span key={l} className="stag">{l}</span>)}</div></div>
              <div className="mt-4">
                <div className="sec-title">Details</div>
                <div style={{fontSize:'0.84rem',color:'var(--text2)',lineHeight:2.1}}>
                  <div>💰 Rs. {worker.price.toLocaleString()}/service</div>
                  <div>📅 Member since {worker.joinDate}</div>
                  <div>{worker.emergencyAvailable?'🚨 Emergency available':'⏰ Standard booking only'}</div>
                  <div>📞 {worker.phone}</div>
                </div>
              </div>
            </div>
            <div>
              <div className="sec-title">Work Portfolio</div>
              <div className="port-grid">
                {profImgs.portfolio.map((img,pi)=>(
                  <div key={pi} className="port-img">
                    <img src={img} alt={`Work ${pi+1}`} onError={e=>imgFallback(e)}/>
                    <div className="port-img-overlay"/>
                  </div>
                ))}
              </div>
              <div style={{marginTop:'1.2rem'}}>
                <div style={{fontFamily:'var(--serif)',fontSize:'0.9rem',fontWeight:700,color:'var(--text)',marginBottom:'0.6rem',letterSpacing:'0.04em'}}>Before & After</div>
                <BeforeAfterSlider before={profImgs.portfolio[0]} after={profImgs.portfolio[1]}/>
                <div style={{fontSize:'0.7rem',color:'var(--text3)',textAlign:'center',marginTop:'0.4rem'}}>Drag to compare</div>
              </div>
            </div>
          </div>
          <div className="sep mt-4" style={{marginLeft:'clamp(1rem, 5vw, 3rem)',marginRight:'clamp(1rem, 5vw, 3rem)'}}/>
          <div className="sec-title" style={{paddingLeft:'clamp(1rem, 5vw, 3rem)',paddingRight:'clamp(1rem, 5vw, 3rem)'}}>Customer Reviews ({worker.totalReviews})</div>
          {worker.reviews.map(r=>(
            <div key={r.id} className="rev-card card" style={{marginLeft:'clamp(1rem, 5vw, 3rem)',marginRight:'clamp(1rem, 5vw, 3rem)'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.25rem'}}>
                <div><span className="rev-name">{r.userName}</span>{r.verified&&<span style={{background:'rgba(92,224,200,0.15)',color:'var(--jade)',fontSize:'0.65rem',fontWeight:700,padding:'1px 8px',borderRadius:99,marginLeft:8}}>✦</span>}</div>
                <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{color:'var(--gold)',fontSize:'0.75rem'}}>{'⭐'.repeat(r.rating)}</span><span className="rev-date">{r.date}</span></div>
              </div>
              <p className="rev-text">{r.text}</p>
            </div>
          ))}
        </div>
        <Footer/>
      </div>
    </PageWrapper>
  );
};

/* ═══════════════════════════════════════════════════
   CATEGORIES PAGE (updated spacing)
═══════════════════════════════════════════════════ */
const CategoriesPage=()=>{
  const navigate=useNavigate();
  const cats=SKILLS.map(skill=>{const prof=PROFESSION_IMAGES[skill]||PROFESSION_IMAGES['Electrician'];const svc=SERVICES.find(s=>s.label===skill||s.label.includes(skill.split(' ')[0]));const count=WORKERS.filter(w=>w.skill===skill).length;return{skill,img:prof.categoryImg,icon:svc?.icon||'👷',count};});
  return(
    <PageWrapper>
      <div className="cat-page">
        <div className="hero" style={{minHeight:'45vh'}}>
          <div className="hero-city" style={{filter:'brightness(0.5)'}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(6,13,24,0.88),rgba(6,13,24,0.65))',zIndex:2}}/>
          <Particles/>
          <div className="hero-content">
            <div className="hero-eyebrow"><span>🌿</span><span>All Professions</span></div>
            <h1 className="hero-title">Browse by <span className="grad">Category</span></h1>
            <p className="hero-sub">Explore our full range of verified service categories.</p>
          </div>
        </div>
        <div className="section">
          <div className="cat-hero-grid" style={{maxWidth:'100%',margin:'0 auto'}}>
            {cats.map(c=>(
              <div key={c.skill} className="cat-card" onClick={()=>navigate('/workers')}>
                <img src={c.img} alt={c.skill} className="img-cover" onError={e=>imgFallback(e)}/>
                <div className="cat-card-ov"/>
                <div className="cat-card-content"><div className="cat-card-icon">{c.icon}</div><div className="cat-card-title">{c.skill}</div><div className="cat-card-count">{c.count} verified professionals</div></div>
                <div className="cat-card-border"/>
              </div>
            ))}
          </div>
        </div>
        <Footer/>
      </div>
    </PageWrapper>
  );
};

/* ═══════════════════════════════════════════════════
   PORTFOLIO PAGE (updated spacing)
═══════════════════════════════════════════════════ */
const PortfolioPage=()=>{
  const navigate=useNavigate();
  const[filter,setFilter]=useState('All');
  const topWorkers=WORKERS.sort((a,b)=>b.rating-a.rating).slice(0,12);
  const allImages=[];
  Object.entries(PROFESSION_IMAGES).forEach(([skill,data])=>{data.portfolio.forEach(img=>allImages.push({img,skill,label:skill}));});
  return(
    <PageWrapper>
      <div className="port-page">
        <div className="hero" style={{minHeight:'42vh'}}>
          <div className="hero-city" style={{filter:'brightness(0.45)'}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(6,13,24,0.9),rgba(6,13,24,0.6))',zIndex:2}}/>
          <Particles/>
          <div className="hero-content">
            <div className="hero-eyebrow"><span>📸</span><span>Real Work Gallery</span></div>
            <h1 className="hero-title">Professional <span className="grad">Portfolio</span></h1>
            <p className="hero-sub">Browse authentic work from our verified professionals.</p>
          </div>
        </div>
        <div className="section">
          <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',marginBottom:'2rem',justifyContent:'center'}}>
            {['All',...SKILLS.slice(0,7)].map(s=>(<button key={s} className={`f-chip ${filter===s?'active':''}`} onClick={()=>setFilter(s)}>{s}</button>))}
          </div>
          <div className="port-masonry" style={{maxWidth:'100%',margin:'0 auto'}}>
            {allImages.filter(a=>filter==='All'||a.skill===filter).map((item,i)=>(
              <div key={i} className="port-masonry-item" onClick={()=>navigate('/workers')}>
                <img src={item.img} alt={item.label} onError={e=>imgFallback(e)}/>
                <div className="port-masonry-ov"><div><div style={{fontFamily:'var(--serif)',color:'var(--text)',fontSize:'0.85rem',fontWeight:700}}>{item.label}</div><div style={{fontSize:'0.7rem',color:'var(--jade)'}}>View professionals →</div></div></div>
              </div>
            ))}
          </div>
          <div style={{marginTop:'5rem'}}>
            <div className="sec-head"><div className="sec-divider">✦</div><span className="sec-eyebrow">See the difference</span><h2>Before & After</h2></div>
            <div className="g2" style={{alignItems:'start',gap:'2rem'}}>
              <div><BeforeAfterSlider before={PROFESSION_IMAGES['Electrician'].portfolio[0]} after={PROFESSION_IMAGES['Electrician'].portfolio[1]}/><div style={{textAlign:'center',marginTop:'0.75rem',fontSize:'0.78rem',color:'var(--text3)'}}>Electrical Panel — Before & After</div></div>
              <div><BeforeAfterSlider before="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=60&auto=format&fit=crop" after="https://images.unsplash.com/photo-1527515545081-5db817172677?w=600&q=80&auto=format&fit=crop"/><div style={{textAlign:'center',marginTop:'0.75rem',fontSize:'0.78rem',color:'var(--text3)'}}>Home Cleaning — Before & After</div></div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    </PageWrapper>
  );
};

/* ═══════════════════════════════════════════════════
   EMERGENCY PAGE (updated spacing)
═══════════════════════════════════════════════════ */
const EmergencyPage=()=>{
  const{addToast}=useApp();
  const[activeEmrg,setActiveEmrg]=useState(null);
  const[scanning,setScanning]=useState(false);
  const[found,setFound]=useState(false);
  const[dispatchedId,setDispatchedId]=useState(null);
  const EXTENDED=[{name:'Ali Khan',skill:'Electrician',eta:'2 min',rating:4.9,jobs:312,img:'https://randomuser.me/api/portraits/men/11.jpg',available:true,price:800},{name:'Bilal Ahmed',skill:'Plumber',eta:'4 min',rating:4.8,jobs:245,img:'https://randomuser.me/api/portraits/men/22.jpg',available:true,price:700},{name:'Usman Ali',skill:'AC Tech',eta:'8 min',rating:4.7,jobs:189,img:'https://randomuser.me/api/portraits/men/33.jpg',available:false,price:1200},{name:'Hamza Butt',skill:'Mechanic',eta:'11 min',rating:4.6,jobs:156,img:'https://randomuser.me/api/portraits/men/44.jpg',available:true,price:900}];
  const activate=cat=>{setActiveEmrg(cat);setScanning(true);setFound(false);setDispatchedId(null);setTimeout(()=>{setScanning(false);setFound(true);},3500);};
  return(
    <PageWrapper>
      <div className="emrg-live-page">
        <div style={{position:'relative',overflow:'hidden'}}>
          <div style={{height:'40vh',background:'linear-gradient(to bottom,rgba(255,79,163,0.08),transparent)',borderBottom:'1px solid rgba(255,79,163,0.15)',display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',paddingTop:'var(--nav-height)'}}>
            <Particles/>
            <div className="hero-content">
              <div className="hero-eyebrow" style={{background:'rgba(255,79,163,0.1)',borderColor:'rgba(255,79,163,0.3)',color:'var(--rose)',animation:'none',display:'inline-flex'}}><span>🚨</span><span>24/7 Emergency Response</span></div>
              <h1 style={{fontFamily:'var(--serif)',fontSize:'clamp(2rem,6vw,4rem)',fontWeight:700,color:'var(--text)',letterSpacing:'0.04em',marginBottom:'0.8rem'}}>Emergency <span style={{background:'linear-gradient(90deg,var(--rose),var(--lav))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Response</span></h1>
              <p style={{color:'var(--text2)',fontFamily:'var(--serif2)',fontSize:'1.1rem'}}>Select your emergency type and get help within minutes.</p>
            </div>
          </div>
        </div>
        <div className="section">
          <div className="container-safe" style={{maxWidth:'100%'}}>
            <div className="emrg-alert-banner"><div className="live-dot"/><div style={{flex:1}}><div style={{fontWeight:700,color:'var(--rose)',fontSize:'0.85rem'}}>Live Emergency System Active</div><div style={{fontSize:'0.75rem',color:'var(--text3)'}}>3 professionals available right now</div></div><div style={{fontSize:'0.75rem',color:'var(--text2)',fontFamily:'var(--serif2)',fontStyle:'italic'}}>Avg response: 4 min</div></div>
            <div className="g2" style={{alignItems:'start',gap:'2.5rem'}}>
              <div>
                <div className="sec-title">Select Emergency Type</div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'0.7rem',marginBottom:'1.5rem'}}>
                  {EMRG_CATS.map(c=>(<div key={c.label} className={`emrg-cat ${activeEmrg===c.label?'sel':''}`} onClick={()=>activate(c.label)} style={{padding:'1.4rem 0.5rem'}}><span style={{fontSize:'2rem'}}>{c.icon}</span><div style={{fontWeight:700}}>{c.label}</div></div>))}
                </div>
              </div>
              <div>
                <div className="sec-title">Nearby Professionals</div>
                {!activeEmrg&&(<div style={{textAlign:'center',padding:'3rem 1.5rem',background:'var(--surface)',border:'1px solid var(--border2)',borderRadius:'var(--r-xl)'}}><div style={{fontSize:'3rem',marginBottom:'1rem'}}>📡</div><div style={{fontFamily:'var(--serif)',color:'var(--text)',marginBottom:'0.5rem'}}>No Active Emergency</div><p style={{fontSize:'0.82rem',color:'var(--text2)'}}>Select an emergency type to activate scanning</p></div>)}
                {activeEmrg&&scanning&&(
                  <div style={{textAlign:'center',padding:'2.5rem 1.5rem',background:'rgba(255,79,163,0.05)',border:'1px solid rgba(255,79,163,0.2)',borderRadius:'var(--r-xl)',position:'relative',overflow:'hidden'}}>
                    <div className="scan-line"/>
                    <div className="radar-wrap"><div className="radar-ring" style={{width:58,height:58,transform:'translate(-50%,-50%)'}}/><div className="radar-ring" style={{width:90,height:90,transform:'translate(-50%,-50%)'}}/><div className="radar-pulse" style={{width:58,height:58}}/><div className="radar-pulse" style={{width:58,height:58,animationDelay:'0.9s'}}/><div className="radar-dot"/></div>
                    <div style={{fontFamily:'var(--serif)',color:'var(--rose)',letterSpacing:'0.04em'}}>Scanning for {activeEmrg} help...</div>
                  </div>
                )}
                {activeEmrg&&found&&(
                  <div>
                    <div style={{background:'rgba(92,224,200,0.08)',border:'1px solid rgba(92,224,200,0.25)',borderRadius:'var(--r-md)',padding:'0.75rem 1rem',marginBottom:'1rem',fontSize:'0.8rem',color:'var(--jade)',display:'flex',gap:'0.5rem',alignItems:'center'}}>✅ {EXTENDED.filter(w=>w.available).length} professionals found nearby</div>
                    {EXTENDED.map(w=>(<div key={w.name} className="emrg-worker-card card" style={{border:`1px solid ${dispatchedId===w.name?'var(--jade)':'var(--border2)'}`,background:dispatchedId===w.name?'rgba(92,224,200,0.08)':'var(--surface)'}}>
                      <img src={w.img} alt={w.name} className="emrg-avatar" onError={e=>imgFallback(e,FALLBACK_AVATAR_M())}/>
                      <div style={{flex:1}}><div style={{fontWeight:700,color:'var(--text)',fontSize:'0.88rem'}}>{w.name}</div><div style={{fontSize:'0.72rem',color:'var(--text3)'}}>{w.skill} · ⭐ {w.rating} · {w.jobs} jobs</div></div>
                      <div style={{textAlign:'right'}}><div className="emrg-eta">{w.eta}</div><div style={{fontSize:'0.65rem',color:w.available?'var(--jade)':'#FFAD6B',marginBottom:'0.4rem'}}>{w.available?'🟢 Available':'🟡 Busy'}</div>{dispatchedId===w.name?<span style={{fontSize:'0.7rem',color:'var(--jade)',fontWeight:700}}>✅ Dispatched</span>:<button className="btn btn-sm" style={{background:'linear-gradient(135deg,rgba(255,126,182,0.2),rgba(196,170,255,0.15))',color:'var(--rose)',border:'1px solid rgba(255,126,182,0.35)'}} onClick={()=>{setDispatchedId(w.name);addToast(`🚨 ${w.name} dispatched! ETA ${w.eta}`,'success');}} disabled={!w.available}>{w.available?'Dispatch':'Busy'}</button>}</div>
                    </div>))}
                    <button className="btn btn-rose w-full mt-4" style={{justifyContent:'center'}} onClick={()=>addToast('Emergency SOS broadcast sent! 🚨','success')}>🚨 Broadcast SOS to All Nearby</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    </PageWrapper>
  );
};

/* ═══════════════════════════════════════════════════
   SMART CITY PAGE (updated spacing)
═══════════════════════════════════════════════════ */
const SmartCityPage=()=>{
  const[tick,setTick]=useState(0);
  useEffect(()=>{const iv=setInterval(()=>setTick(p=>p+1),2000);return()=>clearInterval(iv);},[]);
  const CITY_DATA=CITIES.map((c,i)=>({city:c,workers:8+i*3,bookings:Math.round(50+i*22+Math.sin(tick+i)*8),activeNow:Math.floor(3+i*1.5),rating:4.4+i*0.05}));
  const HEATMAP=Array.from({length:7},()=>Array.from({length:10},()=>({active:Math.random()>0.3,intensity:Math.random()})));
  const LIVE_ACTIVITY=['⚡ Ali Khan completed an electrical job in Lahore','🔧 Sara Ahmed booked a plumber in Gujrat','🌟 Fatima Ali got a 5-star review in Islamabad','🚨 Emergency AC repair dispatched in Karachi','✅ Bilal Ahmed completed 50th job milestone','💖 New worker verified: Hina (Beautician, Lahore)'];
  const SKILL_DIST=SKILLS.map((s,i)=>({skill:s,count:8+i*2,pct:20+i*5}));
  return(
    <PageWrapper>
      <div className="smart-page">
        <div style={{background:'linear-gradient(135deg,rgba(92,224,200,0.06),rgba(168,218,255,0.04))',borderBottom:'1px solid var(--border2)',padding:'clamp(3rem,6vw,5rem) 0',paddingTop:'calc(var(--nav-height) + clamp(2rem,4vw,3rem))',textAlign:'center',position:'relative',overflow:'hidden'}}>
          <Particles/>
          <div className="hero-content">
            <div className="hero-eyebrow" style={{animation:'none',display:'inline-flex'}}><span className="live-dot" style={{marginRight:'0.5rem'}}/><span>Live Platform Data</span></div>
            <h1 style={{fontFamily:'var(--serif)',fontSize:'clamp(2rem,6vw,4.5rem)',fontWeight:700,color:'var(--text)',letterSpacing:'0.04em',marginBottom:'0.8rem'}}>Smart City <span style={{background:'linear-gradient(90deg,var(--jade),var(--mist))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Analytics</span></h1>
            <p style={{color:'var(--text2)',fontFamily:'var(--serif2)',fontSize:'1.1rem',maxWidth:500,margin:'0 auto'}}>Real-time platform intelligence across all cities.</p>
          </div>
        </div>
        <div className="section">
          <div className="container-safe" style={{maxWidth:'100%'}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'1rem',marginBottom:'3rem'}}>
              {[['👷','105','Total Workers'],['📅','1,240','Jobs Done'],['🏙️','10','Cities'],['⚡','23','Active Now'],['⭐','4.8','Avg Rating']].map(([ic,n,l])=>(<div key={l} className="city-widget card" style={{textAlign:'center'}}><div style={{fontSize:'1.6rem',marginBottom:'0.4rem'}}>{ic}</div><div style={{fontFamily:'var(--serif)',fontSize:'1.8rem',fontWeight:700,color:'var(--jade)'}}>{n}</div><div style={{fontSize:'0.68rem',color:'var(--text3)',letterSpacing:'0.08em',textTransform:'uppercase',marginTop:3}}>{l}</div></div>))}
            </div>
            <div className="g2" style={{alignItems:'start',gap:'2rem',marginBottom:'2rem'}}>
              <div className="card" style={{padding:'1.5rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.2rem'}}><div style={{fontFamily:'var(--serif)',fontSize:'1rem',fontWeight:700,color:'var(--text)'}}>City Performance</div><div style={{fontSize:'0.7rem',color:'var(--jade)',display:'flex',alignItems:'center',gap:'0.3rem'}}><span className="live-dot"/>Live</div></div>
                {CITY_DATA.slice(0,6).map(c=>(<div key={c.city} style={{marginBottom:'1rem'}}><div style={{display:'flex',justifyContent:'space-between',fontSize:'0.8rem',marginBottom:5}}><span style={{color:'var(--text)',fontWeight:600}}>{c.city}</span><div style={{display:'flex',gap:'1rem',color:'var(--text2)'}}><span>{c.workers} workers</span><span style={{color:'var(--jade)',fontWeight:700}}>{c.activeNow} active</span></div></div><div className="bar-bg"><div className="bar-fill" style={{width:`${(c.workers/30)*100}%`}}/></div></div>))}
              </div>
              <div className="card" style={{padding:'1.5rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.2rem'}}><div style={{fontFamily:'var(--serif)',fontSize:'1rem',fontWeight:700,color:'var(--text)'}}>Live Activity Feed</div><div style={{fontSize:'0.7rem',color:'var(--rose)',display:'flex',alignItems:'center',gap:'0.3rem'}}><span className="live-dot" style={{background:'var(--rose)',boxShadow:'0 0 8px rgba(255,79,163,0.9)'}}/>Real-time</div></div>
                {LIVE_ACTIVITY.map((a,i)=>(<div key={i} style={{padding:'0.6rem 0',borderBottom:'1px solid var(--border2)',fontSize:'0.78rem',color:'var(--text2)',lineHeight:1.5}}>{a}</div>))}
              </div>
            </div>
            <div className="card city-widget" style={{padding:'1.8rem',marginBottom:'2rem'}}>
              <div style={{fontFamily:'var(--serif)',fontSize:'1rem',fontWeight:700,color:'var(--text)',marginBottom:'1rem'}}>Activity Heatmap — Pakistan</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(10,1fr)',gap:'6px'}}>
                {HEATMAP.flat().map((cell,i)=>(<div key={i} className="heatmap-cell" style={{aspectRatio:'1',borderRadius:4,background:cell.active?`rgba(92,224,200,${0.15+cell.intensity*0.75})`:'rgba(255,255,255,0.04)',border:`1px solid ${cell.active?`rgba(92,224,200,${0.2+cell.intensity*0.4})`:'var(--border2)'}`,boxShadow:cell.active&&cell.intensity>0.7?`0 0 8px rgba(92,224,200,${cell.intensity*0.6})`:'none'}}/>))}
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    </PageWrapper>
  );
};

/* ═══════════════════════════════════════════════════
   AUTH PAGES (unchanged)
═══════════════════════════════════════════════════ */
const pwdStr=p=>{if(!p)return{s:0,label:'',color:'var(--border2)',pct:0};let s=0;if(p.length>=8)s++;if(/[A-Z]/.test(p))s++;if(/\d/.test(p))s++;if(/[@$!%*?&]/.test(p))s++;return{s,label:['','Weak 🔓','Fair 🔑','Good 🔒','Strong 🛡️'][s],color:['','#FF6B8A','#FFAD6B','#5CE0C8','#E8C96A'][s],pct:(s/4)*100};};

const LoginPage = () => {
  const { setUser, addToast } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [errs, setErrs] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const validate = () => {
    const e = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      e.email = 'Valid email required';
    }
    if (pwd.length < 6) {
      e.pwd = 'Minimum 6 characters';
    }
    setErrs(e);
    return !Object.keys(e).length;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      // Call login API - passing email and password as separate arguments
      const result = await API.post('/auth/login', { email, password });
      
      if (result.success) {
        // Set user in context
        setUser(result.data.user);
        
        // Store token if your API returns one
        if (result.data.token) {
          localStorage.setItem('token', result.data.token);
        }
        
        addToast(`Welcome back, ${result.data.user.name}! 🌊`, 'success');
        
        // Redirect based on role
        if (result.data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        addToast(result.message || 'Login failed. Please check your credentials.', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMsg = 'Login failed. Please try again.';
      
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      addToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <PageWrapper>
      <div className="auth-page">
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 40%,rgba(92,224,200,0.08),transparent 60%)', zIndex: 0 }} />
        <Particles />
        <div className="auth-box">
          <div className="auth-logo">
            <span>✦ SERVIRE</span>
          </div>
          <div className="auth-title">Welcome Back</div>
          <div className="auth-sub">Sign in to continue</div>
          
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              className={`input ${errs.email ? 'err' : email ? 'ok' : ''}`} 
              type="email" 
              placeholder="you@example.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              autoComplete="email"
            />
            {errs.email && <div className="form-error">{errs.email}</div>}
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                className={`input ${errs.pwd ? 'err' : ''}`} 
                type={showPwd ? 'text' : 'password'} 
                placeholder="••••••••" 
                value={pwd} 
                onChange={e => setPwd(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{ paddingRight: '2.8rem' }}
                autoComplete="current-password"
              />
              <button 
                onClick={() => setShowPwd(!showPwd)} 
                style={{ 
                  position: 'absolute', 
                  right: '0.9rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '1rem' 
                }}
                type="button"
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
                {showPwd ? '🙈' : '👁️'}
              </button>
            </div>
            {errs.pwd && <div className="form-error">{errs.pwd}</div>}
          </div>
          
          <button 
            className="btn btn-jade w-full mb-3" 
            onClick={handleLogin} 
            disabled={loading} 
            style={{ justifyContent: 'center' }}
          >
            {loading ? (
              <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
            ) : (
              '✦ Sign In'
            )}
          </button>
          
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text2)' }}>
            No account? 
            <span 
              style={{ color: 'var(--jade)', fontWeight: 700, cursor: 'pointer', marginLeft: '0.25rem' }} 
              onClick={() => navigate('/signup')}
            >
              Sign up ✦
            </span>
          </p>
          
          <p style={{ textAlign: 'center', fontSize: '0.68rem', color: 'var(--text3)', marginTop: '0.5rem' }}>
            Demo: user@example.com / any password (min 6 chars)
          </p>
          
          {/* Optional: Forgot Password link */}
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <span 
              style={{ fontSize: '0.7rem', color: 'var(--text3)', cursor: 'pointer' }}
              onClick={() => addToast('Password reset link sent to your email!', 'info')}
            >
              Forgot Password?
            </span>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};


const SignupPage = () => {
  const { setUser, addToast } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', skill: '', experience: '', bio: '' });
  const [errs, setErrs] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const str = pwdStr(form.password);
  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const TOTAL = role === 'worker' ? 4 : 3;

  const val = () => {
    const e = {};
    if (step === 1 && !role) e.role = 'Choose an account type';
    if (step === 2) {
      if (!/^[A-Za-z\s]{2,50}$/.test(form.name)) e.name = 'Valid name required (2-50 letters)';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) e.email = 'Valid email required';
      if (form.phone && !/^(\+92|0)?[3-9][0-9]{9}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Valid phone number required (e.g., +92 300 1234567)';
    }
    if (step === 3) {
      if (form.password.length < 8) e.password = '8+ characters required';
      if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    }
    if (step === 4 && role === 'worker' && !form.skill) e.skill = 'Select your primary skill';
    setErrs(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async () => {
    if (!val()) return;
    setLoading(true);
    try {
      // Prepare user data for API
      const userData = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        phone: form.phone || '',
        city: 'Lahore',
        role: role === 'worker' ? 'worker' : 'user',
      };
      
      // Add worker-specific fields
      if (role === 'worker') {
        userData.skill = form.skill;
        userData.experience = parseInt(form.experience) || 1;
        userData.bio = form.bio || '';
      }
      
      // Call registration API
      const result = await API.post('/auth/register', userData);
      
      if (result.success) {
        // Auto-login after successful registration
        // Fix: pass email and password as separate arguments, not as object
        const loginResult = await apiLogin(userData.email, form.password);
        
        if (loginResult.success && loginResult.user) {
          setUser(loginResult.user);
          // Store token if needed
          if (loginResult.token) {
            localStorage.setItem('token', loginResult.token);
          }
        }
        
        setDone(true);
        addToast(`Welcome to Servire, ${form.name}! 🌊 Your account has been created.`, 'success');
        setTimeout(() => navigate('/dashboard'), 2500);
      } else {
        addToast(result.message || 'Registration failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      let errorMsg = 'Registration failed. Please check your details and try again.';
      
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors from backend
        const validationErrors = Object.values(error.response.data.errors).flat();
        errorMsg = validationErrors.join(', ');
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      addToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (val()) setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  return (
    <PageWrapper>
      <div className="auth-page">
        <Particles />
        <div className="auth-box">
          <div className="auth-logo"><span>✦ SERVIRE</span></div>
          {done ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem', animation: 'scaleIn 0.6s var(--bounce)' }}>🎉</div>
              <div className="auth-title">Welcome, {form.name}!</div>
              <p style={{ color: 'var(--text2)', marginTop: '0.5rem', fontSize: '0.86rem' }}>Your account has been created. Redirecting to dashboard...</p>
              <div className="dot-loader mt-4"><span /><span /><span /></div>
            </div>
          ) : (
            <>
              <div className="step-dots">
                {Array.from({ length: TOTAL + 1 }, (_, i) => (
                  <div key={i} className={`sdot-step ${i + 1 < step ? 'done' : i + 1 === step ? 'active' : ''}`} />
                ))}
              </div>
              <div className="auth-title" style={{ fontSize: '1.4rem' }}>
                {['', 'Choose Role', 'Personal Info', 'Security', 'Worker Info'][step]}
              </div>
              <div className="auth-sub mb-4">Step {step} of {TOTAL + 1}</div>

              {/* Step 1: Choose Role */}
              {step === 1 && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
                    {[
                      ['user', '👤', 'User', 'Hire services, book professionals'],
                      ['worker', '👷', 'Worker', 'Offer services, earn money']
                    ].map(([v, ic, l, d]) => (
                      <div
                        key={v}
                        onClick={() => setRole(v)}
                        style={{
                          cursor: 'pointer',
                          padding: '1.5rem 0.85rem',
                          textAlign: 'center',
                          borderRadius: 18,
                          border: `1.5px solid ${role === v ? 'var(--jade)' : 'var(--border2)'}`,
                          background: role === v ? 'rgba(92,224,200,0.1)' : 'var(--surface)',
                          transition: 'all 0.3s var(--bounce)',
                          boxShadow: role === v ? 'var(--glow-jade)' : 'none'
                        }}
                      >
                        <div style={{ fontSize: '2.2rem', marginBottom: '0.45rem' }}>{ic}</div>
                        <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.2rem', fontSize: '0.9rem' }}>{l}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>{d}</div>
                      </div>
                    ))}
                  </div>
                  {errs.role && <div className="form-error mb-3">{errs.role}</div>}
                  <button className="btn btn-jade w-full" style={{ justifyContent: 'center' }} onClick={nextStep} disabled={!role}>
                    Continue →
                  </button>
                </>
              )}

              {/* Step 2: Personal Info */}
              {step === 2 && (
                <>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input 
                      className={`input ${errs.name ? 'err' : form.name ? 'ok' : ''}`} 
                      type="text" 
                      placeholder="e.g., Aisha Khan" 
                      value={form.name} 
                      onChange={e => upd('name', e.target.value)}
                    />
                    {errs.name && <div className="form-error">{errs.name}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input 
                      className={`input ${errs.email ? 'err' : form.email ? 'ok' : ''}`} 
                      type="email" 
                      placeholder="aisha@example.com" 
                      value={form.email} 
                      onChange={e => upd('email', e.target.value)}
                    />
                    {errs.email && <div className="form-error">{errs.email}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input 
                      className={`input ${errs.phone ? 'err' : form.phone ? 'ok' : ''}`} 
                      type="tel" 
                      placeholder="+92 300 1234567" 
                      value={form.phone} 
                      onChange={e => upd('phone', e.target.value)}
                    />
                    {errs.phone && <div className="form-error">{errs.phone}</div>}
                    <div style={{ fontSize: '0.65rem', color: 'var(--text3)', marginTop: '0.25rem' }}>
                      Optional, but recommended for faster communication
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.65rem' }}>
                    <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={prevStep}>
                      ← Back
                    </button>
                    <button className="btn btn-jade" style={{ flex: 2, justifyContent: 'center' }} onClick={nextStep}>
                      Continue →
                    </button>
                  </div>
                </>
              )}

              {/* Step 3: Security (Password) */}
              {step === 3 && (
                <>
                  <div className="form-group">
                    <label className="form-label">Password *</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        className={`input ${errs.password ? 'err' : form.password ? 'ok' : ''}`} 
                        type={showPwd ? 'text' : 'password'} 
                        placeholder="Minimum 8 characters" 
                        value={form.password} 
                        onChange={e => upd('password', e.target.value)}
                        style={{ paddingRight: '2.8rem' }}
                      />
                      <button 
                        onClick={() => setShowPwd(!showPwd)} 
                        style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
                        type="button"
                      >
                        {showPwd ? '🙈' : '👁️'}
                      </button>
                    </div>
                    {form.password && (
                      <>
                        <div className="pwd-bar mt-2">
                          <div className="pwd-fill" style={{ width: `${str.pct}%`, background: str.color }} />
                        </div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: str.color, marginTop: 4 }}>{str.label}</div>
                      </>
                    )}
                    {errs.password && <div className="form-error">{errs.password}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm Password *</label>
                    <input 
                      className={`input ${errs.confirm ? 'err' : form.confirm && form.confirm === form.password ? 'ok' : ''}`} 
                      type="password" 
                      placeholder="••••••••" 
                      value={form.confirm} 
                      onChange={e => upd('confirm', e.target.value)}
                    />
                    {errs.confirm && <div className="form-error">{errs.confirm}</div>}
                  </div>
                  <div style={{ display: 'flex', gap: '0.65rem' }}>
                    <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={prevStep}>
                      ← Back
                    </button>
                    <button 
                      className="btn btn-jade" 
                      style={{ flex: 2, justifyContent: 'center' }} 
                      onClick={role === 'worker' ? nextStep : handleSubmit}
                      disabled={loading}
                    >
                      {loading ? '⏳ Creating Account...' : (role === 'worker' ? 'Continue →' : '✦ Create Account')}
                    </button>
                  </div>
                </>
              )}

              {/* Step 4: Worker Info (only for workers) */}
              {step === 4 && role === 'worker' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Primary Skill *</label>
                    <select 
                      className={`input ${errs.skill ? 'err' : form.skill ? 'ok' : ''}`} 
                      value={form.skill} 
                      onChange={e => upd('skill', e.target.value)}
                    >
                      <option value="">Select your primary skill...</option>
                      {SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errs.skill && <div className="form-error">{errs.skill}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Years of Experience</label>
                    <select 
                      className="input" 
                      value={form.experience} 
                      onChange={e => upd('experience', e.target.value)}
                    >
                      <option value="1">Less than 1 year</option>
                      <option value="2">1–2 years</option>
                      <option value="3">3–5 years</option>
                      <option value="6">6–10 years</option>
                      <option value="11">10+ years</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Professional Bio</label>
                    <textarea 
                      className="input" 
                      style={{ minHeight: 80, resize: 'vertical' }} 
                      placeholder="Tell clients about your expertise, experience, and what makes you special..." 
                      value={form.bio} 
                      onChange={e => upd('bio', e.target.value)}
                    />
                    <div style={{ fontSize: '0.65rem', color: 'var(--text3)', marginTop: '0.25rem' }}>
                      {form.bio.length}/500 characters
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.65rem' }}>
                    <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={prevStep}>
                      ← Back
                    </button>
                    <button 
                      className="btn btn-jade" 
                      style={{ flex: 2, justifyContent: 'center' }} 
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? '⏳ Creating Account...' : '✦ Join Servire as a Worker'}
                    </button>
                  </div>
                </>
              )}

              <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text2)', marginTop: '1rem' }}>
                Already have an account? <span style={{ color: 'var(--jade)', fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate('/login')}>Sign in →</span>
              </p>
              <p style={{ textAlign: 'center', fontSize: '0.68rem', color: 'var(--text3)', marginTop: '0.5rem' }}>
                By signing up, you agree to our Terms of Service and Privacy Policy.
              </p>
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

/* ═══════════════════════════════════════════════════
   DASHBOARD (unchanged)
═══════════════════════════════════════════════════ */
const UserDashboard=()=>{
  const{user,setUser,favorites}=useApp();
  const navigate=useNavigate();
  const[tab,setTab]=useState('bookings');
  const saved=WORKERS.filter(w=>favorites.includes(w.id));
  return(
    <PageWrapper>
      <div className="dash-page">
        <aside className="dash-sidebar">
          <div style={{marginBottom:'1.5rem',padding:'0 0.5rem'}}>
            <div style={{width:54,height:54,borderRadius:'50%',background:'linear-gradient(135deg,var(--jade),var(--mist))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.4rem',marginBottom:'0.5rem',boxShadow:'var(--glow-jade)'}}>👤</div>
            <div style={{fontWeight:700,color:'var(--text)',fontSize:'0.88rem'}}>{user?.name}</div>
            <div style={{fontSize:'0.72rem',color:'var(--text3)'}}>{user?.email}</div>
          </div>
          {[['bookings','📅','My Bookings'],['saved','💖','Saved'],['settings','⚙️','Settings']].map(([v,ic,l])=>(<button key={v} className={`dnav-item ${tab===v?'active':''}`} onClick={()=>setTab(v)}>{ic} {l}</button>))}
          <button className="dnav-item" style={{marginTop:'2rem'}} onClick={()=>{setUser(null);navigate('/');}}>🚪 Logout</button>
        </aside>
        <main className="dash-main">
          <div className="dash-title">Hello, {user?.name?.split(' ')[0]} 🌊</div>
          <div className="dash-sub">Welcome back to Servire</div>
          <div className="g4 mb-4">
            {[['📅',MOCK_BOOKINGS.length,'Bookings'],['💖',favorites.length,'Saved'],['✅',2,'Completed'],['⏳',1,'Pending']].map(([ic,n,l])=>(<div key={l} className="kpi card"><div className="kpi-ic">{ic}</div><div className="kpi-num">{n}</div><div className="kpi-lbl">{l}</div></div>))}
          </div>
          <div className="tabs mb-4" style={{maxWidth:360}}>
            {[['bookings','📅 Bookings'],['saved','💖 Saved'],['settings','⚙️ Settings']].map(([v,l])=>(<button key={v} className={`tab ${tab===v?'active':''}`} onClick={()=>setTab(v)}>{l}</button>))}
          </div>
          {tab==='bookings'&&(<div><div className="sec-title">My Bookings</div>{MOCK_BOOKINGS.map(b=>(<div key={b.id} className="bk-item"><div className="bk-dot" style={{background:b.status==='confirmed'?'var(--jade)':b.status==='pending'?'#FFAD6B':'var(--lav)'}}/><div style={{flex:1}}><div className="bk-name">{b.name} — {b.skill}</div><div className="bk-detail">📅 {b.date} · ⏰ {b.time} · Rs. {b.price.toLocaleString()}</div></div><span className={`bk-status st-${b.status}`}>{b.status}</span></div>))}</div>)}
          {tab==='saved'&&(saved.length>0?(<div className="g3">{saved.map(w=><WorkerCard key={w.id} worker={w}/>)}</div>):(<div className="empty-state"><div className="empty-icon">🌊</div><div className="empty-title">No saved workers yet</div><button className="btn btn-jade mt-4" onClick={()=>navigate('/workers')} style={{justifyContent:'center'}}>Browse Workers →</button></div>))}
          {tab==='settings'&&(<div style={{maxWidth:460}}><div className="sec-title">Account Settings</div><div className="card" style={{padding:'1.5rem'}}>{[['Full Name',user?.name],['Email',user?.email],['Phone','+92 300 0000000'],['City','Lahore']].map(([l,v])=>(<div key={l} className="form-group"><label className="form-label">{l}</label><input className="input" defaultValue={v}/></div>))}<button className="btn btn-jade" style={{justifyContent:'center'}}>Save Changes ✦</button></div></div>)}
        </main>
      </div>
    </PageWrapper>
  );
};

/* ═══════════════════════════════════════════════════
   ADMIN DASHBOARD (unchanged)
═══════════════════════════════════════════════════ */
const AdminDashboard=()=>{
  const{setUser}=useApp();
  const navigate=useNavigate();
  const[tab,setTab]=useState('employees');
  const[search,setSearch]=useState('');
  const[pg,setPg]=useState(1);
  const PER=20;
  const filtered=EMPLOYEES.filter(e=>!search||e.name.toLowerCase().includes(search.toLowerCase()));
  const paged=filtered.slice((pg-1)*PER,pg*PER);
  const pages=Math.ceil(filtered.length/PER);
  return(
    <PageWrapper>
      <div className="dash-page">
        <aside className="dash-sidebar">
          <div style={{marginBottom:'1.5rem',padding:'0 0.5rem'}}>
            <div style={{width:54,height:54,borderRadius:'50%',background:'linear-gradient(135deg,var(--gold),var(--jade))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.4rem',marginBottom:'0.5rem'}}>👑</div>
            <div style={{fontWeight:700,color:'var(--text)',fontSize:'0.88rem'}}>Admin Panel</div>
          </div>
          {[['employees','👥','Employees'],['workers','👷','Workers'],['analytics','📊','Analytics']].map(([v,ic,l])=>(<button key={v} className={`dnav-item ${tab===v?'active':''}`} onClick={()=>{setTab(v);setPg(1);}}>{ic} {l}</button>))}
          <button className="dnav-item" style={{marginTop:'2rem'}} onClick={()=>{setUser(null);navigate('/');}}>🚪 Logout</button>
        </aside>
        <main className="dash-main">
          <div className="dash-title">Admin Dashboard 👑</div>
          <div className="g4 mb-4">{[['👥','105','Employees'],['👷','105','Workers'],['📅','1,240','Bookings'],['💰','Rs. 4.2M','Revenue']].map(([ic,n,l])=>(<div key={l} className="kpi card"><div className="kpi-ic">{ic}</div><div className="kpi-num" style={{fontSize:'1.5rem'}}>{n}</div><div className="kpi-lbl">{l}</div></div>))}</div>
          <div className="tabs mb-4" style={{maxWidth:480}}>{[['employees','👥 Employees'],['workers','👷 Workers'],['analytics','📊 Analytics']].map(([v,l])=>(<button key={v} className={`tab ${tab===v?'active':''}`} onClick={()=>{setTab(v);setPg(1);}}>{l}</button>))}</div>
          {(tab==='employees'||tab==='workers')&&(<><div style={{marginBottom:'1rem'}}><input className="input" style={{maxWidth:280}} placeholder="🔍 Search…" value={search} onChange={e=>{setSearch(e.target.value);setPg(1);}}/></div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'1rem'}}>
            {(tab==='employees'?paged:WORKERS.slice((pg-1)*PER,pg*PER)).map(e=>(<div key={e.id} className="card" style={{textAlign:'center',padding:'1.2rem 0.7rem'}}>
              <img src={e.avatar} alt={e.name} style={{width:60,height:60,borderRadius:'50%',objectFit:'cover',objectPosition:'center top',border:'1.5px solid rgba(92,224,200,0.4)',margin:'0 auto 0.5rem',display:'block',background:'var(--ink3)'}} onError={e2=>imgFallback(e2, e.id%2===0?FALLBACK_AVATAR_F(e.id):FALLBACK_AVATAR_M(e.id))}/>
              <div style={{fontWeight:700,fontSize:'0.76rem',color:'var(--text)'}}>{e.name}</div>
              <div style={{fontSize:'0.67rem',color:'var(--jade)',marginTop:2}}>{e.role||e.skill}</div>
              <div style={{color:'var(--gold)',fontSize:'0.65rem',marginTop:3}}>{'⭐'.repeat(Math.floor(e.rating||4.5))}</div>
            </div>))}
          </div>
          <div className="pagination">{Array.from({length:Math.min(pages,8)},(_,i)=>(<button key={i+1} className={`pbtn ${pg===i+1?'active':''}`} onClick={()=>setPg(i+1)}>{i+1}</button>))}</div></>)}
          {tab==='analytics'&&(<div className="g2"><div className="card" style={{padding:'1.5rem'}}><div className="sec-title">Workers by City</div>{CITIES.slice(0,6).map((c,i)=>(<div key={c} style={{marginBottom:'0.85rem'}}><div style={{display:'flex',justifyContent:'space-between',fontSize:'0.79rem',marginBottom:4}}><span style={{color:'var(--text)'}}>{c}</span><span style={{color:'var(--jade)',fontWeight:700}}>{10+i*3} workers</span></div><div className="bar-bg"><div className="bar-fill" style={{width:`${30+i*10}%`}}/></div></div>))}</div><div className="card" style={{padding:'1.5rem'}}><div className="sec-title">Services Distribution</div>{SKILLS.slice(0,6).map((s,i)=>(<div key={s} style={{marginBottom:'0.85rem'}}><div style={{display:'flex',justifyContent:'space-between',fontSize:'0.79rem',marginBottom:4}}><span style={{color:'var(--text)'}}>{s}</span><span style={{color:'var(--lav)',fontWeight:700}}>{8+i*2} workers</span></div><div className="bar-bg"><div className="bar-fill" style={{width:`${20+i*12}%`,background:'linear-gradient(90deg,var(--lav),var(--mist))'}}/></div></div>))}</div></div>)}
        </main>
      </div>
    </PageWrapper>
  );
};

/* ═══════════════════════════════════════════════════
   FAVORITES PAGE (unchanged)
═══════════════════════════════════════════════════ */
const FavoritesPage=()=>{
  const{favorites}=useApp();
  const navigate=useNavigate();
  const saved=WORKERS.filter(w=>favorites.includes(w.id));
  return(
    <PageWrapper>
      <div style={{paddingTop:'var(--nav-height)',minHeight:'100vh'}}>
        <div className="section">
          <div className="container-safe" style={{maxWidth:'100%'}}>
            <button className="back-btn" onClick={()=>navigate('/workers')}>← Back to Workers</button>
            <div style={{marginBottom:'2rem',marginTop:'0.5rem'}}>
              <h2 style={{fontFamily:'var(--serif)',fontSize:'clamp(1.5rem,4vw,2rem)',fontWeight:700,letterSpacing:'0.04em',color:'var(--text)'}}>Saved Professionals 💖</h2>
              <p style={{color:'var(--text2)',marginTop:'0.25rem',fontSize:'0.85rem',fontFamily:'var(--serif2)',fontStyle:'italic'}}>{saved.length} worker{saved.length!==1?'s':''} saved</p>
            </div>
            {saved.length>0?(<div className="g3">{saved.map(w=><WorkerCard key={w.id} worker={w}/>)}</div>):(<div className="empty-state"><div className="empty-icon">🌊</div><div className="empty-title">No favorites yet</div><div className="empty-desc">Browse workers and tap 🤍 to save them here</div><button className="btn btn-jade mt-4" onClick={()=>navigate('/workers')} style={{justifyContent:'center'}}>Browse Workers →</button></div>)}
          </div>
        </div>
        <Footer/>
      </div>
    </PageWrapper>
  );
};

/* ═══════════════════════════════════════════════════
   ABOUT PAGE (unchanged)
═══════════════════════════════════════════════════ */
const AboutPage=()=>{
  const team=[...F_NAMES,...M_NAMES].slice(0,8);
  const roles=['CEO & Founder','CTO','Head of Operations','Marketing Director','Customer Success','Lead Designer','Senior Engineer','HR Manager'];
  return(
    <PageWrapper>
      <div className="about-page">
        <div className="hero" style={{minHeight:'52vh'}}>
          <div className="hero-city" style={{filter:'brightness(0.55)'}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(6,13,24,0.82),rgba(6,13,24,0.65))',zIndex:2}}/>
          <Particles/>
          <div className="hero-content">
            <div className="hero-eyebrow"><span>🌊</span><span>Our Story</span></div>
            <h1 className="hero-title">About <span className="grad">Servire</span></h1>
            <p className="hero-sub">We're building the most trusted network of home service professionals in Pakistan.</p>
          </div>
        </div>
        <div className="section" style={{textAlign:'center'}}>
          <div className="container-safe" style={{maxWidth:800,margin:'0 auto'}}><p style={{fontSize:'1.05rem',color:'var(--text2)',lineHeight:1.9,fontFamily:'var(--serif2)'}}>Servire began with a simple idea — every home deserves reliable, professional service without the hassle of endless phone calls. Today, we're proud to have 105+ verified professionals across 10+ cities completing thousands of jobs with excellence. Our mission is to empower local talent while giving families peace of mind.</p></div>
        </div>
        <div className="section" style={{paddingTop:0}}>
          <div className="team-grid" style={{maxWidth:'100%',margin:'0 auto'}}>
            {team.slice(0,8).map((n,i)=>(<div key={i} className="team-card card"><img src={i%2===0?FALLBACK_AVATAR_F(i):FALLBACK_AVATAR_M(i)} alt={n} className="team-av" onError={e=>imgFallback(e,i%2===0?FALLBACK_AVATAR_F(i):FALLBACK_AVATAR_M(i))}/><div className="team-name">{n}</div><div className="team-role">{roles[i%roles.length]}</div></div>))}
          </div>
        </div>
        <div className="section">
          <div className="tl" style={{maxWidth:'100%',margin:'0 auto'}}>
            {[{y:'2021',t:'Foundation',d:'Servire launched in Gujrat with 12 professionals and 20 families in the pilot.'},{y:'2022',t:'City Expansion',d:'Expanded to Lahore, Islamabad, and Karachi. Grew to 200+ professionals.'},{y:'2023',t:'Verification Hub',d:'Introduced rigorous ID verification, skill testing, and background checks.'},{y:'2024',t:'Smart City',d:'Launched real-time analytics, emergency dispatch, and before/after portfolios.'},{y:'2025',t:'National Reach',d:'Reached 10+ cities, 1,240+ jobs, and industry-leading 4.8⭐ rating.'}].map((m,i)=>(<div key={i} className="tl-item"><div className="tl-dot">🌊</div><div className="tl-content"><div className="tl-year">{m.y}</div><div className="tl-title">{m.t}</div><div className="tl-desc">{m.d}</div></div></div>))}
          </div>
        </div>
        <Footer/>
      </div>
    </PageWrapper>
  );
};

/* ═══════════════════════════════════════════════════
   CONTACT PAGE (unchanged)
═══════════════════════════════════════════════════ */
const ContactPage=()=>{
  const{addToast}=useApp();
  const[faq,setFaq]=useState(null);
  const FAQS=[{q:'How do I book a professional?',a:'Simply browse the Workers page, select a profile, and click "Book Now". Choose your date, time, and confirm!'},{q:'Are all professionals verified?',a:'Yes, every professional undergoes ID verification, skill assessment, and background screening.'},{q:'What payment methods are accepted?',a:'Cash, JazzCash, and Easypaisa — paid directly to the professional after service completion.'},{q:'Can I cancel my booking?',a:'Yes, cancel free of charge up to 2 hours before appointment. Late cancellations may incur a small fee.'},{q:'How do I become a worker?',a:'Click Sign Up, choose "Worker", complete the profile, and our team will verify you within 48 hours.'}];
  return(
    <PageWrapper>
      <div className="contact-page">
        <div className="hero" style={{minHeight:'48vh'}}>
          <div className="hero-city" style={{filter:'brightness(0.55)'}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(6,13,24,0.85),rgba(6,13,24,0.65))',zIndex:2}}/>
          <Particles/>
          <div className="hero-content">
            <div className="hero-eyebrow"><span>💬</span><span>Get in touch</span></div>
            <h1 className="hero-title">We're <span className="grad">listening</span></h1>
            <p className="hero-sub">Questions, feedback, or partnership ideas? Reach out anytime.</p>
          </div>
        </div>
        <div className="section">
          <div className="container-safe" style={{maxWidth:'100%'}}>
            <div className="g2" style={{alignItems:'start',gap:'2.5rem'}}>
              <div>
                <div className="sec-title">Send a Message</div>
                <div className="card" style={{padding:'1.6rem'}}>
                  <div className="form-group"><label className="form-label">Full Name</label><input className="input" placeholder="Your name"/></div>
                  <div className="form-group"><label className="form-label">Email</label><input className="input" type="email" placeholder="you@example.com"/></div>
                  <div className="form-group"><label className="form-label">Subject</label><input className="input" placeholder="What's this about?"/></div>
                  <div className="form-group"><label className="form-label">Message</label><textarea className="input" rows={4} placeholder="Tell us everything…"/></div>
                  <button className="btn btn-jade w-full" style={{justifyContent:'center'}} onClick={()=>addToast('Message sent! We\'ll reply within 24h 🌊','success')}>Send Message ✦</button>
                </div>
              </div>
              <div>
                <div className="sec-title">FAQ</div>
                {FAQS.map((f,i)=>(<div key={i} className="faq-item"><div className="faq-q" onClick={()=>setFaq(faq===i?null:i)}>{f.q}<span style={{fontSize:'1.1rem'}}>{faq===i?'−':'+'}</span></div>{faq===i&&<div className="faq-a">{f.a}</div>}</div>))}
                <div className="card mt-4" style={{padding:'1.8rem',textAlign:'center'}}><div style={{fontSize:'2rem',marginBottom:'0.75rem'}}>🌊</div><div className="sec-title" style={{fontSize:'1.1rem'}}>hello@servire.pk</div><p style={{fontSize:'0.85rem',color:'var(--text2)'}}>📞 +92 300 123 4567<br/>📍 Gujrat, Punjab, Pakistan</p></div>
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    </PageWrapper>
  );
};

/* ═══════════════════════════════════════════════════
   404 PAGE (unchanged)
═══════════════════════════════════════════════════ */
const NotFoundPage=()=>{
  const navigate=useNavigate();
  return(
    <PageWrapper>
      <div className="notfound-page">
        <div className="notfound-num">404</div>
        <div className="notfound-title">Page Not Found</div>
        <div className="notfound-desc">The page you're looking for doesn't exist or has been moved.</div>
        <div className="hero-btns"><button className="btn btn-jade" onClick={()=>navigate('/')}>🏠 Go Home</button><button className="btn btn-ghost" onClick={()=>navigate(-1)}>← Go Back</button></div>
        <Particles/>
      </div>
    </PageWrapper>
  );
};

/* ═══════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════ */
function App() {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState(()=>{try{return JSON.parse(localStorage.getItem('srv_fav')||'[]');}catch{return[];}});
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((msg, type='')=>{
    const id=Date.now();
    setToasts(p=>[...p,{id,msg,type}]);
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),3800);
  },[]);
  useEffect(()=>{localStorage.setItem('srv_fav',JSON.stringify(favorites));},[favorites]);
  const toggleFavorite = useCallback((id)=>{
    let n;
    if(favorites.includes(id)){n=favorites.filter(f=>f!==id);addToast('Removed from favorites','');}
    else{n=[...favorites,id];addToast('Added to favorites ✨','');}
    setFavorites(n);
    return n.includes(id);
  },[favorites,addToast]);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUser(user);
    }
  }, []);

  const value = {user,setUser,favorites,toggleFavorite,addToast};
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppCtx.Provider value={value}>
          <BrowserRouter>
            <GlobalStyle />
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/workers" element={<WorkersDirectory />} />
              <Route path="/worker/:id" element={<WorkerDetail />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/emergency" element={<EmergencyPage />} />
              <Route path="/smartcity" element={<SmartCityPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <ThemeToggleBtn />
            <HooriBot />
            <EmergencyFloat />
            <Toast toasts={toasts} />
          </BrowserRouter>
        </AppCtx.Provider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
export default App;
