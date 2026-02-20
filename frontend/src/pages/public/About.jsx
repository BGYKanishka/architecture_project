import React from 'react';
import { BookOpenIcon, UserGroupIcon, CalendarDaysIcon, MapPinIcon } from '@heroicons/react/24/outline';

const About = () => {
    return (
        <div className="bg-slate-50 min-h-screen pt-12 pb-24 font-sans text-slate-800">

            {/* Hero Section */}
            <div className="bg-blue-800 text-white rounded-3xl mx-4 md:mx-auto max-w-5xl px-8 py-6 md:py-10 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden">
                {/* Abstract Background Shapes */}
                <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-700 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-indigo-600 rounded-full blur-3xl opacity-50"></div>

                <div className="relative z-10 bg-white/10 p-3 rounded-2xl mb-4 backdrop-blur-sm shadow-inner border border-white/10">
                    <BookOpenIcon className="w-8 h-8 text-white" />
                </div>
                <h1 className="relative z-10 text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
                    About
                </h1>
                <p className="relative z-10 text-lg text-blue-100 max-w-2xl mt-2 font-medium">
                    Celebrating a legacy of literature, knowledge, and culture at the Colombo International Book Fair.
                </p>
            </div>

            <div className="max-w-5xl mx-auto px-6 mt-16 space-y-20">

                {/* Section 1: Legacy */}
                <section className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="md:w-1/2 order-2 md:order-1 flex justify-center">
                        <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-white p-8 flex flex-col justify-center items-center text-center">
                            <div className="bg-yellow-50 text-yellow-600 rounded-full p-6 mb-6">
                                <UserGroupIcon className="w-16 h-16" />
                            </div>
                            <h3 className="text-3xl font-bold text-slate-800 mb-2">25 Years</h3>
                            <p className="text-slate-500 font-medium">Of literary excellence</p>
                        </div>
                    </div>
                    <div className="md:w-1/2 order-1 md:order-2">
                        <h2 className="text-3xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                            A Legacy Of
                        </h2>
                        <p className="text-lg leading-relaxed text-slate-600">
                            In 2024, the Colombo International Book Fair marked its 25th anniversary with a silver-jubilee edition that paid tribute to the initiators and past presidents who first envisioned a dedicated stage for Sri Lanka’s publishing industry and reading public. The ceremonial opening, graced by these founders, transformed the occasion into both a celebration of achievement and a moment of gratitude for the leadership that shaped the fair’s enduring character.
                        </p>
                    </div>
                </section>

                {/* Section 2: Scale and Spirit */}
                <section className="flex flex-col md:flex-row gap-12 items-center bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-bold text-blue-900 mb-6">
                            CIBF 2025 : Scale and Spirit
                        </h2>
                        <p className="text-lg leading-relaxed text-slate-600 mb-6">
                            The 26th edition, CIBF 2025, carried this momentum into ten vibrant days in September, transforming BMICH into a bustling city of books within its 4,500 square meters.
                        </p>
                        <p className="text-lg leading-relaxed text-slate-600">
                            Encompassing 12 halls and hosting 450 booths, the fair featured 70 leading local publishers, alongside 32 international publishers represented through local distributors. The event was powered by 18 publishing sponsors and 8 non-publishing partners, all contributing to the success of this major cultural gathering.
                        </p>
                    </div>
                    <div className="md:w-1/2 flex justify-center">
                        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                            <div className="bg-blue-50 rounded-2xl p-6 text-center border border-blue-100">
                                <h4 className="text-4xl font-extrabold text-blue-700">12</h4>
                                <p className="text-blue-900/70 font-medium mt-1">Halls</p>
                            </div>
                            <div className="bg-indigo-50 rounded-2xl p-6 text-center border border-indigo-100">
                                <h4 className="text-4xl font-extrabold text-indigo-700">450</h4>
                                <p className="text-indigo-900/70 font-medium mt-1">Booths</p>
                            </div>
                            <div className="bg-emerald-50 rounded-2xl p-6 text-center border border-emerald-100">
                                <h4 className="text-4xl font-extrabold text-emerald-700">70</h4>
                                <p className="text-emerald-900/70 font-medium mt-1">Local Publishers</p>
                            </div>
                            <div className="bg-purple-50 rounded-2xl p-6 text-center border border-purple-100">
                                <h4 className="text-4xl font-extrabold text-purple-700">10</h4>
                                <p className="text-purple-900/70 font-medium mt-1">Vibrant Days</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: Looking Ahead */}
                <section className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-8 md:p-16 text-white text-center shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400"></div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-8">Looking ahead to CIBF 2026</h2>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 mb-10">
                        <div className="flex items-center gap-4 bg-white/10 px-6 py-4 rounded-xl backdrop-blur-sm border border-white/20">
                            <CalendarDaysIcon className="w-8 h-8 text-blue-300" />
                            <div className="text-left">
                                <p className="text-blue-100 text-sm font-medium">Mark your calendar</p>
                                <p className="font-semibold text-lg">25th Sep - 4th Oct 2026</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-white/10 px-6 py-4 rounded-xl backdrop-blur-sm border border-white/20">
                            <MapPinIcon className="w-8 h-8 text-indigo-300" />
                            <div className="text-left">
                                <p className="text-indigo-100 text-sm font-medium">Location</p>
                                <p className="font-semibold text-lg">BMICH, Colombo 7</p>
                            </div>
                        </div>
                    </div>

                    <p className="max-w-3xl mx-auto text-lg md:text-xl text-blue-50 leading-relaxed font-light">
                        The journey continues with CIBF 2026. Visitors and exhibitors are invited to reserve these dates, not only to engage in the bustling atmosphere of the exhibition, but also to experience their profession and passion in a refreshed environment that encourages networking, discovery, and collaboration.
                    </p>
                </section>

            </div>
        </div>
    );
};

export default About;
