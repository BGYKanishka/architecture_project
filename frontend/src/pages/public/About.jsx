import React from 'react';
import { BookOpenIcon, UserGroupIcon, CalendarDaysIcon, MapPinIcon } from '@heroicons/react/24/outline';

const About = () => {
    return (
        <div className="bg-[#0b0f19] min-h-screen py-16 font-sans text-slate-100">

            {/* Hero Section */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">
                    Event Overview
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
                    About Colombo International Book Fair
                </h1>
                <p className="text-base text-slate-300 max-w-2xl leading-relaxed">
                    Celebrating over a quarter-century of literature, education, and cultural exchange at South Asia's flagship literary gathering.
                </p>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

                {/* Legacy Section */}
                <section className="bg-[#0f1422] rounded-xl p-8 border border-slate-800 flex flex-col md:flex-row gap-8 items-center">
                    <div className="md:w-1/3 text-center md:text-left">
                        <span className="text-4xl font-bold text-white block">25+ Years</span>
                        <span className="text-xs text-slate-400 mt-1 block">Of continuous literary service in Sri Lanka</span>
                    </div>
                    <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-8">
                        <h2 className="text-xl font-bold text-white mb-3">
                            A Quarter-Century of Cultural Impact
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            The Colombo International Book Fair was founded to create a dedicated platform for Sri Lanka’s publishing industry and reading community. Over the past 25 years, it has transformed into the island's premier annual cultural event, uniting international authors, academic presses, and over one million readers.
                        </p>
                    </div>
                </section>

                {/* Scale and Footprint */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#0f1422] rounded-xl p-6 border border-slate-800">
                        <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-indigo-400">
                            <MapPinIcon className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-bold text-white mb-2">BMICH Colombo</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Hosted across 8 expansive exhibition wings at the Bandaranaike Memorial International Conference Hall.
                        </p>
                    </div>

                    <div className="bg-[#0f1422] rounded-xl p-6 border border-slate-800">
                        <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-indigo-400">
                            <UserGroupIcon className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-bold text-white mb-2">1,000,000+ Footfall</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Attracting a diverse audience of school groups, university students, academics, and general readers across 10 days.
                        </p>
                    </div>

                    <div className="bg-[#0f1422] rounded-xl p-6 border border-slate-800">
                        <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-indigo-400">
                            <CalendarDaysIcon className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-bold text-white mb-2">September 18–27, 2026</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            10 consecutive exhibition days open daily from 9:00 AM to 7:00 PM for the public.
                        </p>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default About;
