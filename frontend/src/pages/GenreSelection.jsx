import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import {
    BookOpenIcon,
    GlobeAltIcon,
    AcademicCapIcon,
    SparklesIcon,
    PaintBrushIcon,
    MicrophoneIcon,
    RocketLaunchIcon,
    HeartIcon
} from "@heroicons/react/24/outline";
import UserService from "../services/user.service";

const genres = [
    { id: "fiction", label: "Fiction", icon: <BookOpenIcon className="w-8 h-8" />, color: "bg-purple-100 border-purple-200 text-purple-600" },
    { id: "non-fiction", label: "Non-Fiction", icon: <GlobeAltIcon className="w-8 h-8" />, color: "bg-blue-100 border-blue-200 text-blue-600" },
    { id: "academic", label: "Academic & Education", icon: <AcademicCapIcon className="w-8 h-8" />, color: "bg-emerald-100 border-emerald-200 text-emerald-600" },
    { id: "children", label: "Children's Books", icon: <SparklesIcon className="w-8 h-8" />, color: "bg-yellow-100 border-yellow-200 text-yellow-600" },
    { id: "art", label: "Art & Photography", icon: <PaintBrushIcon className="w-8 h-8" />, color: "bg-pink-100 border-pink-200 text-pink-600" },
    { id: "romance", label: "Romance", icon: <HeartIcon className="w-8 h-8" />, color: "bg-rose-100 border-rose-200 text-rose-600" },
    { id: "scifi", label: "Sci-Fi & Fantasy", icon: <RocketLaunchIcon className="w-8 h-8" />, color: "bg-indigo-100 border-indigo-200 text-indigo-600" },
    { id: "biography", label: "Biography", icon: <MicrophoneIcon className="w-8 h-8" />, color: "bg-orange-100 border-orange-200 text-orange-600" }
];

const GenreSelection = () => {
    const navigate = useNavigate();
    const [selectedGenres, setSelectedGenres] = useState([]);

    const toggleGenre = (id) => {
        if (selectedGenres.includes(id)) {
            setSelectedGenres(selectedGenres.filter((d) => d !== id));
        } else {
            setSelectedGenres([...selectedGenres, id]);
        }
    };

    const handleContinue = () => {
        if (selectedGenres.length === 0) return alert("Please select at least one genre.");

        UserService.updateProfile({ genres: selectedGenres })
            .then(() => {
                navigate("/dashboard");
            })
            .catch((err) => {
                console.error("Error saving genres:", err);
                alert("Failed to save genres. Please try again.");
            });
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-4">
                        What do you publish?
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Select the literary genres you will be displaying at your stall. This helps visitors find you easier on the map.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    {genres.map((genre) => {
                        const isSelected = selectedGenres.includes(genre.id);
                        return (
                            <div
                                key={genre.id}
                                onClick={() => toggleGenre(genre.id)}
                                className={`
                  relative cursor-pointer group rounded-3xl p-6 border-2 transition-all duration-300
                  ${isSelected
                                        ? `border-blue-600 bg-white shadow-xl scale-105 ring-4 ring-blue-50`
                                        : `bg-white border-transparent shadow-sm hover:shadow-md hover:border-slate-200`
                                    }
                `}
                            >
                                {/* Check Icon */}
                                {isSelected && (
                                    <div className="absolute top-3 right-3 text-blue-600 animate-in zoom-in duration-200">
                                        <CheckCircleIcon className="w-6 h-6" />
                                    </div>
                                )}

                                <div className={`
                  w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors
                  ${isSelected ? 'bg-blue-100 text-blue-600' : genre.color}
                `}>
                                    {genre.icon}
                                </div>

                                <h3 className={`font-bold text-lg leading-tight ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
                                    {genre.label}
                                </h3>
                            </div>
                        );
                    })}
                </div>

                {/* Footer Action */}
                <div className="flex justify-center">
                    <button
                        onClick={handleContinue}
                        disabled={selectedGenres.length === 0}
                        className={`
              px-10 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all
              ${selectedGenres.length > 0
                                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 hover:shadow-2xl'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }
            `}
                    >
                        Save & Continue to Dashboard
                    </button>
                </div>

            </div>
        </div>
    );
};

export default GenreSelection;
