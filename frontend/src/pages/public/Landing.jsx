import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";
import {
  MapPinIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  QrCodeIcon,
  TicketIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

const BookFairIllustration = () => (
  <svg
    viewBox="0 0 620 540"
    className="h-auto w-full overflow-visible"
    role="img"
    aria-labelledby="book-fair-illustration-title"
  >
    <title id="book-fair-illustration-title">A floating open book above a stack of books</title>
    <defs>
      <radialGradient id="book-glow">
        <stop offset="0" stopColor="#4f46e5" stopOpacity="0.34" />
        <stop offset="1" stopColor="#4f46e5" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="page-left" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#cbd5e1" />
      </linearGradient>
      <linearGradient id="page-right" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f8fafc" />
        <stop offset="1" stopColor="#dbeafe" />
      </linearGradient>
      <linearGradient id="cover-teal" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#22d3ee" />
        <stop offset="1" stopColor="#4f46e5" />
      </linearGradient>
      <filter id="book-shadow" x="-30%" y="-30%" width="160%" height="180%">
        <feDropShadow dx="0" dy="18" stdDeviation="15" floodColor="#020617" floodOpacity="0.48" />
      </filter>
    </defs>

    <ellipse cx="314" cy="278" rx="270" ry="250" fill="url(#book-glow)" />
    <circle cx="130" cy="185" r="3" fill="#a5b4fc" className="book-sparkle book-sparkle-one" />
    <circle cx="500" cy="180" r="4" fill="#67e8f9" className="book-sparkle book-sparkle-two" />
    <path d="M102 285h22m-11-11v22M496 302h18m-9-9v18" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" opacity=".7" />
    <ellipse cx="314" cy="443" rx="205" ry="35" fill="#020617" opacity=".42" />

    <g className="book-stack-float" filter="url(#book-shadow)">
      {/* Bottom book */}
      <path d="m119 376 278-26 86 39-279 31z" fill="#f1f5f9" />
      <path d="m204 420 279-31v42l-279 32z" fill="#d84967" />
      <path d="m119 376 85 44v43l-85-46z" fill="#a92f52" />
      <path d="m217 426 245-28" stroke="#fda4af" strokeWidth="2" opacity=".65" />

      {/* Middle book */}
      <path d="m145 329 270-25 74 34-269 30z" fill="#f8fafc" />
      <path d="m220 368 269-30v38l-269 31z" fill="#0f766e" />
      <path d="m145 329 75 39v38l-75-41z" fill="#115e59" />
      <path d="m233 374 235-26" stroke="#99f6e4" strokeWidth="2" opacity=".7" />

      {/* Top book */}
      <path d="m181 285 244-23 66 31-245 28z" fill="#f8fafc" />
      <path d="m246 321 245-28v34l-245 29z" fill="#4f46e5" />
      <path d="m181 285 65 36v35l-65-38z" fill="#3730a3" />
      <path d="m259 326 216-24" stroke="#c7d2fe" strokeWidth="2" opacity=".8" />
    </g>

    <g className="open-book-float" filter="url(#book-shadow)">
      {/* Cover and page edges */}
      <path d="M162 216c60-22 112-10 158 31 47-41 99-53 158-31l-18 93c-53-18-98-8-140 27-42-35-87-45-140-27z" fill="url(#cover-teal)" />
      <path d="M174 211c55-19 103-7 146 31v82c-43-32-88-41-132-25z" fill="#cbd5e1" />
      <path d="M450 211c-55-19-103-7-146 31v82c43-32 88-41 132-25z" fill="#cbd5e1" />

      {/* Pages */}
      <g className="book-page-left">
        <path d="M310 232c-40-34-91-49-151-38l17 89c51-9 94 1 134 31z" fill="url(#page-left)" stroke="#fff" strokeWidth="2" />
        <path d="M185 220c39-4 77 7 108 26M190 238c36-2 70 8 100 25M194 256c33 0 63 9 91 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" opacity=".7" />
      </g>
      <g className="book-page-right">
        <path d="M310 232c40-34 91-49 151-38l-17 89c-51-9-94 1-134 31z" fill="url(#page-right)" stroke="#fff" strokeWidth="2" />
        <path d="M435 220c-39-4-77 7-108 26M430 238c-36-2-70 8-100 25M426 256c-33 0-63 9-91 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" opacity=".7" />
      </g>
      <path d="M310 232v83" stroke="#818cf8" strokeWidth="5" strokeLinecap="round" />
      <path d="M310 232c-3 33-3 58 0 83" stroke="#4338ca" strokeWidth="2" opacity=".7" />
    </g>
  </svg>
);

const Landing = () => {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();
  const roles = Array.isArray(currentUser?.roles) ? currentUser.roles : [];
  const roleUpper = String(currentUser?.role || "").toUpperCase();
  const isAdmin = roles.includes("ROLE_ADMIN") || roleUpper === "ADMIN" || roleUpper === "ROLE_ADMIN";
  const isEmployee = roles.includes("ROLE_EMPLOYEE") || roleUpper === "EMPLOYEE" || roleUpper === "ROLE_EMPLOYEE";

  let portalLink = "/dashboard";
  let portalLabel = "Go to Dashboard";
  if (isAdmin) {
    portalLink = "/admin/dashboard";
    portalLabel = "Admin Panel";
  } else if (isEmployee) {
    portalLink = "/employee/floor-plan";
    portalLabel = "Staff Portal";
  }

  const stallTiers = [
    {
      size: "Small Stall",
      dimensions: "10 ft × 10 ft (100 sq.ft)",
      price: "Rs. 5,000",
      description: "Designed for independent authors, boutique imprints, and specialized book distributors.",
      features: [
        "1 Standard display counter + 2 chairs",
        "5A Single phase power outlet",
        "1 Official exhibitor gate pass",
        "Listed in official event directory",
        "Standard hall aisle placement"
      ],
      popular: false
    },
    {
      size: "Medium Stall",
      dimensions: "15 ft × 15 ft (225 sq.ft)",
      price: "Rs. 7,500",
      description: "Our most popular package. Ample shelving and floor display capacity for active publishing houses.",
      features: [
        "2 Display counters + 4 chairs",
        "Dual 5A power hookups + spotlight",
        "2 Official exhibitor gate passes",
        "Featured directory spotlight",
        "Corner or main-aisle position"
      ],
      popular: true
    },
    {
      size: "Large Pavilion",
      dimensions: "20 ft × 20 ft (400 sq.ft)",
      price: "Rs. 10,000",
      description: "Maximum visibility for flagship publishers, educational groups, and multinational distributors.",
      features: [
        "Customizable modular counter setup",
        "High-capacity power hookups",
        "4 Official exhibitor gate passes",
        "Premium directory & venue map banner",
        "Prime entrance and main concourse access"
      ],
      popular: false
    }
  ];

  const halls = [
    { id: "A", name: "Hall A", theme: "Fiction & International Literature", stalls: "20 Stalls" },
    { id: "B", name: "Hall B", theme: "Non-Fiction & Biographies", stalls: "8 Stalls" },
    { id: "C", name: "Hall C", theme: "Academic, Science & Technology", stalls: "12 Stalls" },
    { id: "D", name: "Hall D", theme: "Children's Literature & Comics", stalls: "12 Stalls" },
    { id: "E", name: "Hall E", theme: "Languages, Translations & Arts", stalls: "5 Stalls" },
    { id: "F", name: "Hall F", theme: "Religious & Cultural Heritage", stalls: "15 Stalls" },
    { id: "G", name: "Hall G", theme: "Educational Imprints & School Texts", stalls: "15 Stalls" },
    { id: "MainBuilding", name: "Main Concourse", theme: "Mega Bookstores & Stationers", stalls: "Prime Stalls" }
  ];

  const highlights = [
    {
      icon: <ShieldCheckIcon className="w-6 h-6 text-indigo-400" />,
      title: "Real-Time Stall Locking",
      description: "Row-level database locks ensure your selected space is held safely during checkout with zero risk of duplicate bookings."
    },
    {
      icon: <QrCodeIcon className="w-6 h-6 text-indigo-400" />,
      title: "Digital QR Gate Passes",
      description: "Instantly generated digital passes with scannable QR tokens for swift exhibitor check-in on event mornings."
    },
    {
      icon: <TicketIcon className="w-6 h-6 text-indigo-400" />,
      title: "Flexible Settlement",
      description: "Lock your reservation online immediately with the choice of instant confirmation or on-site settlement."
    },
    {
      icon: <UserGroupIcon className="w-6 h-6 text-indigo-400" />,
      title: "1M+ Visitors",
      description: "Direct access to over one million avid readers, students, teachers, and literature enthusiasts across 10 exhibition days."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans">

      {/* ── HERO SECTION ── */}
      <section className="border-b border-slate-800/80 py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(21rem,0.85fr)] lg:gap-14">
            <div>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-indigo-400 mb-4">
                September 18–27, 2026 • BMICH Colombo
              </p>

              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
                South Asia’s Premier Book Fair. <br />
                <span className="text-slate-400">Reserve Your Stall Online.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl">
                Connect with over 1,000,000 passionate book buyers, institutions, and distributors. Browse live hall availability, pick your locations on the interactive map, and confirm your space in minutes.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/map"
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-lg text-sm transition shadow-sm"
                >
                  <MapPinIcon className="w-4 h-4" />
                  <span>Explore Floor Plan</span>
                  <ArrowRightIcon className="w-4 h-4 ml-1" />
                </Link>

                {currentUser ? (
                  <Link
                    to={portalLink}
                    className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 font-medium px-6 py-3 rounded-lg text-sm transition"
                  >
                    <BuildingOffice2Icon className="w-4 h-4 text-slate-400" />
                    <span>{portalLabel}</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => AuthService.register()}
                    className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 font-medium px-6 py-3 rounded-lg text-sm transition cursor-pointer"
                  >
                    <span>Publisher Sign Up</span>
                  </button>
                )}
              </div>

            </div>

            <div className="relative mx-auto w-full max-w-[34rem] lg:max-w-none" aria-hidden="true">
              <BookFairIllustration />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 sm:pt-10 mt-14 border-t border-slate-800/80">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white">1,000,000+</p>
              <p className="text-xs text-slate-400 mt-1">Expected Visitors</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white">400+</p>
              <p className="text-xs text-slate-400 mt-1">Publishers & Imprints</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white">8 Halls</p>
              <p className="text-xs text-slate-400 mt-1">BMICH Exhibition Wings</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white">10 Days</p>
              <p className="text-xs text-slate-400 mt-1">Exhibition Duration</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STALL TIERS & PRICING ── */}
      <section className="py-20 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">Transparent Pricing</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Stall Packages
            </h2>
            <p className="text-slate-400 mt-2 text-sm sm:text-base">
              All stall allocations include standard carpeted shell scheme, branded fascia board, electricity connection, and exhibitor credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stallTiers.map((tier) => (
              <div
                key={tier.size}
                className={`rounded-xl p-6 sm:p-8 flex flex-col justify-between transition-all ${tier.popular
                    ? "bg-[#101726] border-2 border-indigo-500/80 shadow-xl"
                    : "bg-[#0f1422] border border-slate-800"
                  }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{tier.size}</h3>
                    {tier.popular && (
                      <span className="text-xs font-semibold text-indigo-400">
                        Popular Choice
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mb-4">{tier.dimensions}</p>

                  <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-slate-800">
                    <span className="text-3xl font-bold text-white">{tier.price}</span>
                    <span className="text-slate-400 text-xs">/ entire 10-day fair</span>
                  </div>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">{tier.description}</p>

                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Included with package:</p>
                  <ul className="space-y-2.5 mb-8">
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckIcon className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/map"
                  className={`w-full py-2.5 rounded-lg text-center font-medium text-xs sm:text-sm transition-colors ${tier.popular
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80"
                    }`}
                >
                  View Available Stalls
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXHIBITION HALLS EXPLORER ── */}
      <section className="py-20 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">Venue Layout</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Exhibition Wings
              </h2>
              <p className="text-slate-400 mt-1 text-sm max-w-xl">
                BMICH offers curated zones catering to specific literary genres and readership profiles.
              </p>
            </div>

            <Link
              to="/map"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition"
            >
              <span>Explore Interactive Map</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {halls.map((hall) => (
              <div
                key={hall.id}
                onClick={() => navigate("/map")}
                className="bg-[#0f1422] rounded-xl p-5 border border-slate-800 hover:border-slate-700 transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base font-bold text-white">{hall.name}</span>
                    <span className="text-[11px] font-medium text-slate-400">{hall.stalls}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{hall.theme}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-indigo-400">
                  <span>Select stalls</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIGITAL ADVANTAGES (NO PILL BADGE FRAMES) ── */}
      <section className="py-20 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">Digital Operations</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Built for Modern Exhibitors
            </h2>
            <p className="text-slate-400 mt-2 text-sm sm:text-base">
              A streamlined digital workflow replacing physical queues and paperwork.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, idx) => (
              <div key={idx} className="bg-[#0f1422] p-6 rounded-xl border border-slate-800">
                <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS: 3 STEPS ── */}
      <section className="py-20 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">Process</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              How Reservation Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-[#0f1422] border border-slate-800">
              <span className="text-xs font-bold text-indigo-400 mb-2 block">Step 01</span>
              <h3 className="text-base font-bold text-white mb-2">Select on Floor Plan</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filter halls, inspect stall dimensions, and choose up to 3 stalls per publisher account directly on the live map.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0f1422] border border-slate-800">
              <span className="text-xs font-bold text-indigo-400 mb-2 block">Step 02</span>
              <h3 className="text-base font-bold text-white mb-2">Review & Reserve</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Review your booking summary, select Cash-on-Date or payment terms, and lock your allocation securely.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0f1422] border border-slate-800">
              <span className="text-xs font-bold text-indigo-400 mb-2 block">Step 03</span>
              <h3 className="text-base font-bold text-white mb-2">Access with Digital Pass</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive instant confirmation with your digital QR credential for swift entry at BMICH exhibition gates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER CALL TO ACTION ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0f1422] border border-slate-800 rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Ready to exhibit at CIBF 2026?
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
                Prime locations are allocated in real time. Reserve early to secure optimal visibility for your titles.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/map"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition"
              >
                Browse Stalls
              </Link>
              <button
                type="button"
                onClick={() => AuthService.login()}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium px-5 py-2.5 rounded-lg text-sm transition cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;
