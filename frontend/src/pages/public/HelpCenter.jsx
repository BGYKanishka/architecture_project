import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    QuestionMarkCircleIcon,
    ChevronDownIcon,
    TicketIcon,
    MapIcon,
    UserGroupIcon,
    EnvelopeIcon,
    ArrowLeftIcon
} from "@heroicons/react/24/outline";

const HelpCenter = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("general");
    const [openFaq, setOpenFaq] = useState(null);

    const faqs = {
        general: [
            {
                q: "How many stalls can I reserve?",
                a: "Per the Sri Lanka Book Publishers’ Association guidelines, each registered publisher account can reserve a maximum of 3 stalls to ensure equitable access across all exhibitors."
            },
            {
                q: "How do I access my gate entrance pass?",
                a: "Once your reservation is confirmed, a digital pass with a cryptographic QR code is generated. This is accessible in your dashboard under 'My Bookings' and is also sent to your registered email."
            },
            {
                q: "What are the exhibition dates and opening hours?",
                a: "CIBF 2026 takes place from September 18 to 27, 2026. The fair is open daily from 9:00 AM to 7:00 PM at BMICH, Bauddhaloka Mawatha, Colombo 07."
            }
        ],
        reservations: [
            {
                q: "Can I cancel a reservation?",
                a: "Yes. Reservations can be cancelled directly through the 'My Bookings' tab prior to the fair commencement deadline."
            },
            {
                q: "Why are some stalls marked as SOLD on the floor map?",
                a: "Stalls marked as SOLD have been booked by other publishers or are held during active checkout. Available stalls are colored green (Small), cyan (Medium), or violet (Large)."
            },
            {
                q: "What payment settlement methods are supported?",
                a: "We currently support cash settlement upon arrival ('Cash on Date') at the BMICH fair secretariat desk, as well as electronic card payment."
            }
        ]
    };

    return (
        <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans py-16 pb-20">
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">Exhibitor Support</p>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Frequently Asked Questions</h1>
                    <p className="text-slate-400 mt-2 text-sm sm:text-base">Guidelines and assistance for CIBF 2026 exhibitors</p>
                </div>

                {/* Support Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                    <SupportCard
                        icon={<TicketIcon className="w-5 h-5 text-indigo-400" />}
                        title="QR Gate Passes"
                        desc="Instructions on digital credentials, badge allocation, and entrance check-in."
                    />
                    <SupportCard
                        icon={<MapIcon className="w-5 h-5 text-indigo-400" />}
                        title="Stall Specifications"
                        desc="Details on dimensions, shell scheme fittings, and power socket allocation."
                    />
                    <SupportCard
                        icon={<UserGroupIcon className="w-5 h-5 text-indigo-400" />}
                        title="Publisher Registration"
                        desc="Guidelines on updating publishing imprint titles, contacts, and genre tags."
                    />
                </div>

                {/* FAQ Section */}
                <div className="bg-[#0f1422] rounded-xl border border-slate-800 overflow-hidden">
                    <div className="flex border-b border-slate-800">
                        <TabBtn active={activeTab === "general"} label="General Guidelines" onClick={() => setActiveTab("general")} />
                        <TabBtn active={activeTab === "reservations"} label="Stall Reservations" onClick={() => setActiveTab("reservations")} />
                    </div>

                    <div className="p-6 space-y-3">
                        {faqs[activeTab].map((faq, idx) => (
                            <div key={idx} className="rounded-lg border border-slate-800 bg-[#0b0f19] overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-850"
                                >
                                    <span className="font-medium text-white text-sm">{faq.q}</span>
                                    <ChevronDownIcon className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                                </button>
                                {openFaq === idx && (
                                    <div className="px-4 pb-4 pt-1 text-slate-400 text-xs sm:text-sm leading-relaxed border-t border-slate-800">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Banner */}
                <div className="mt-12 bg-[#0f1422] border border-slate-800 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-white">Need more assistance?</h2>
                        <p className="text-slate-400 text-xs sm:text-sm mt-0.5">The CIBF Secretariat team is available for direct inquiries.</p>
                    </div>
                    <a
                        href="mailto:srilankabookpublishers@gmail.com?subject=CIBF%20Support%20Request"
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition shadow-sm shrink-0"
                    >
                        <EnvelopeIcon className="w-4 h-4" />
                        <span>Email Support</span>
                    </a>
                </div>

                <div className="mt-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
                    >
                        <ArrowLeftIcon className="w-3.5 h-3.5" />
                        <span>Back</span>
                    </button>
                </div>
            </main>
        </div>
    );
};

const SupportCard = ({ icon, title, desc }) => (
    <div className="bg-[#0f1422] p-5 rounded-xl border border-slate-800">
        <div className="w-9 h-9 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center mb-3">
            {icon}
        </div>
        <h3 className="font-semibold text-white text-sm mb-1">{title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
    </div>
);

const TabBtn = ({ active, label, onClick }) => (
    <button
        onClick={onClick}
        className={`flex-1 py-3 text-xs sm:text-sm font-medium transition ${
            active 
                ? "text-white border-b-2 border-indigo-500 bg-[#0b0f19]" 
                : "text-slate-400 hover:text-white"
        }`}
    >
        {label}
    </button>
);

export default HelpCenter;
