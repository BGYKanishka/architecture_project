import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";
import {
  MapPinIcon,
  CalendarDaysIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  QrCodeIcon,
  TicketIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

const Landing = () => {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

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
      <section className="border-b border-slate-800/80 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Clean kicker text (NO pill frame around words) */}
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-indigo-400 mb-4">
              September 18–27, 2026 • BMICH Colombo
            </p>

            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
              South Asia’s Premier Book Fair. <br />
              <span className="text-slate-400">Reserve Your Stall Online.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed">
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
                  to="/dashboard"
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 font-medium px-6 py-3 rounded-lg text-sm transition"
                >
                  <BuildingOffice2Icon className="w-4 h-4 text-slate-400" />
                  <span>Go to Dashboard</span>
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 font-medium px-6 py-3 rounded-lg text-sm transition"
                >
                  <span>Publisher Sign Up</span>
                </Link>
              )}
            </div>

            {/* Scale stats bar - clean and natural */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-12 mt-12 border-t border-slate-800/80">
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
                className={`rounded-xl p-6 sm:p-8 flex flex-col justify-between transition-all ${
                  tier.popular
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
                  className={`w-full py-2.5 rounded-lg text-center font-medium text-xs sm:text-sm transition-colors ${
                    tier.popular
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
              <Link
                to="/login"
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium px-5 py-2.5 rounded-lg text-sm transition"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;
