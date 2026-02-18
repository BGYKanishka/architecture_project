import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
                a: "Per the Sri Lanka Book Publishers’ Association rules, each registered business or vendor is allowed to reserve a maximum of 3 stalls to ensure fair distribution."
            },
            {
                q: "How do I get my entrance pass?",
                a: "Once your reservation is confirmed, a unique QR code is generated. This acts as your official pass and will be sent to your registered email address."
            }
        ],
        reservations: [
            {
                q: "Can I cancel a reservation?",
                a: "Reservations can be managed through the 'My Reservations' tab in your dashboard. Cancellations are subject to the terms and conditions of the CIBF committee."
            },
            {
                q: "Why are some stalls grayed out?",
                a: "Stalls displayed in gray are already reserved by other publishers. Only green/available stalls can be selected for booking."
            }
        ]
    };

    return (
        <div className="min-h-screen bg-slate-50">


            <main className="max-w-5xl mx-auto px-4 py-12">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl text-blue-600 mb-4">
                        <QuestionMarkCircleIcon className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">How can we help?</h1>
                    <p className="text-slate-500 mt-2 text-lg">Support for the Colombo International Book Fair Reservation System</p>
                </div>

                {/* Support Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <SupportCard
                        icon={<TicketIcon className="w-6 h-6" />}
                        title="QR Pass Issues"
                        desc="Didn't receive your QR code? Check your spam or resend it here."
                    />
                    <SupportCard
                        icon={<MapIcon className="w-6 h-6" />}
                        title="Stall Mapping"
                        desc="Detailed guide on hall dimensions and stall categorization."
                    />
                    <SupportCard
                        icon={<UserGroupIcon className="w-6 h-6" />}
                        title="Business Registration"
                        desc="Updating your publisher details or literary genre lists."
                    />
                </div>

                {/* FAQ Section */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="flex border-b border-slate-100">
                        <TabBtn active={activeTab === "general"} label="General" onClick={() => setActiveTab("general")} />
                        <TabBtn active={activeTab === "reservations"} label="Reservations" onClick={() => setActiveTab("reservations")} />
                    </div>

                    <div className="p-8">
                        {faqs[activeTab].map((faq, idx) => (
                            <div key={idx} className="mb-4 last:mb-0">
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full flex items-center justify-between p-5 rounded-2xl bg-slate-50 hover:bg-slate-100 transition text-left"
                                >
                                    <span className="font-bold text-slate-700">{faq.q}</span>
                                    <ChevronDownIcon className={`w-5 h-5 text-slate-400 transition ${openFaq === idx ? 'rotate-180' : ''}`} />
                                </button>
                                {openFaq === idx && (
                                    <div className="p-5 text-slate-600 leading-relaxed animate-in slide-in-from-top-2">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Footer */}
                <div className="mt-16 bg-blue-600 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between">
                    <div className="mb-6 md:mb-0 text-center md:text-left">
                        <h3 className="text-2xl font-bold">Still have questions?</h3>
                        <p className="text-blue-100 opacity-80">Our support team is available for publishers 24/7.</p>
                    </div>
                    <a
                        href="mailto:srilankabookpublishers@gmail.com?subject=CIBF%20Reservation%20Support%20Request"
                        className="flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold shadow-xl hover:bg-blue-50 transition no-underline"
                    >
                        <EnvelopeIcon className="w-6 h-6" />
                        Contact Support
                    </a>
                </div>

                <button
                    onClick={() => navigate(-1)}
                    className="mt-8 flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800 shadow-md transition mx-auto"
                >
                    <ArrowLeftIcon className="w-5 h-5" /> Go Back
                </button>
            </main>
        </div>
    );
};

const SupportCard = ({ icon, title, desc }) => (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group">
        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition mb-6">
            {icon}
        </div>
        <h4 className="font-bold text-slate-800 mb-2">{title}</h4>
        <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
);

const TabBtn = ({ active, label, onClick }) => (
    <button
        onClick={onClick}
        className={`flex-1 py-4 font-bold text-sm transition ${active ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-400 hover:text-slate-600"}`}
    >
        {label}
    </button>
);

export default HelpCenter;