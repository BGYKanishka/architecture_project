import React, { useState, useEffect } from 'react';
import { QuestionMarkCircleIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import Header from '../components/Header';
import AuthService from '../services/auth.service';

const HelpCenter = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
    }, []);
    const categories = [
        { title: "Booking Issues", description: "Learn how to resolve common booking problems.", icon: <QuestionMarkCircleIcon className="w-8 h-8 text-blue-600" /> },
        { title: "Account & Login", description: "Manage your account settings and login issues.", icon: <UserHelpIcon className="w-8 h-8 text-green-600" /> },
        { title: "Payments & Refunds", description: "Understand payment methods and refund policies.", icon: <PaymentIcon className="w-8 h-8 text-purple-600" /> },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <Header user={user} />
            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
                            How can we help you?
                        </h1>
                        <p className="mt-4 text-xl text-slate-600">
                            Search or browse for answers to your questions.
                        </p>

                        <div className="mt-8 max-w-xl mx-auto relative">
                            <input
                                type="text"
                                placeholder="Type keywords to find answers..."
                                className="w-full px-6 py-4 rounded-full border border-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg"
                            />
                            <button className="absolute right-2 top-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>

                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {categories.map((cat, index) => (
                            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer border border-slate-100">
                                <div className="mb-4 bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                                    {cat.icon}
                                </div>
                                <h3 className="text-xl font-bold text-center text-slate-800 mb-2">{cat.title}</h3>
                                <p className="text-slate-600 text-center text-sm">{cat.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-blue-800 rounded-3xl p-8 text-white text-center shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
                        <p className="mb-6 opacity-90">Our support team is available 24/7 to assist you.</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">

                            <a href="mailto:srilankabookpublishers@gmail.com" className="flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition border border-blue-500">
                                <EnvelopeIcon className="w-5 h-5" /> Email Us
                            </a>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Simple icon components for placeholders
const UserHelpIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
);

const PaymentIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
    </svg>
);

export default HelpCenter;
