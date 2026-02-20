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
import ConfirmationModal from "../components/common/ConfirmationModal";

const genres = [
    { id: "Fiction", label: "Fiction", icon: <BookOpenIcon className="w-8 h-8" />, color: "bg-purple-100 border-purple-200 text-purple-600 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-400" },
    { id: "Non-Fiction", label: "Non-Fiction", icon: <GlobeAltIcon className="w-8 h-8" />, color: "bg-blue-100 border-blue-200 text-blue-600 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400" },
    { id: "Academic & Education", label: "Academic & Education", icon: <AcademicCapIcon className="w-8 h-8" />, color: "bg-emerald-100 border-emerald-200 text-emerald-600 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400" },
    { id: "Children's Books", label: "Children's Books", icon: <SparklesIcon className="w-8 h-8" />, color: "bg-yellow-100 border-yellow-200 text-yellow-600 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-400" },
    { id: "Art & Photography", label: "Art & Photography", icon: <PaintBrushIcon className="w-8 h-8" />, color: "bg-pink-100 border-pink-200 text-pink-600 dark:bg-pink-900/30 dark:border-pink-800 dark:text-pink-400" },
    { id: "Romance", label: "Romance", icon: <HeartIcon className="w-8 h-8" />, color: "bg-rose-100 border-rose-200 text-rose-600 dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-400" },
    { id: "Sci-Fi & Fantasy", label: "Sci-Fi & Fantasy", icon: <RocketLaunchIcon className="w-8 h-8" />, color: "bg-indigo-100 border-indigo-200 text-indigo-600 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-400" },
    { id: "Biography", label: "Biography", icon: <MicrophoneIcon className="w-8 h-8" />, color: "bg-orange-100 border-orange-200 text-orange-600 dark:bg-orange-900/30 dark:border-orange-800 dark:text-orange-400" }
];

const GenreSelection = () => {
    const navigate = useNavigate();
    const [selectedGenres, setSelectedGenres] = useState([]);

    // Alert Modal State
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        title: "",
        message: ""
    });

    const showAlert = (title, message) => {
        setAlertConfig({ isOpen: true, title, message });
    };

    const toggleGenre = (id) => {
        if (selectedGenres.includes(id)) {
            setSelectedGenres(selectedGenres.filter((d) => d !== id));
        } else {
            setSelectedGenres([...selectedGenres, id]);
        }
    };

    const handleContinue = () => {
        if (selectedGenres.length === 0) {
            return showAlert("Selection Required", "Please select at least one genre.");
        }


        UserService.updateProfile({ genres: selectedGenres })
            .then(() => {
                navigate("/dashboard");
            })
            .catch((err) => {
                console.error("Error saving genres:", err);
                showAlert("Save Failed", "Failed to save genres. Please try again.");
            });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight mb-4">
                        What do you publish?
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        Select the literary genres you will be displaying at your stall. This helps visitors find you easier on the map.
                    </p>
                </div>

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
                                        ? `border-blue-600 bg-white dark:bg-slate-800 shadow-xl scale-105 ring-4 ring-blue-50 dark:ring-blue-900/30`
                                        : `bg-white dark:bg-slate-900 border-transparent shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700`
                                    }
                `}
                            >
                                {isSelected && (
                                    <div className="absolute top-3 right-3 text-blue-600 dark:text-blue-400 animate-in zoom-in duration-200">
                                        <CheckCircleIcon className="w-6 h-6" />
                                    </div>
                                )}

                                <div className={`
                  w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors
                  ${isSelected ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : genre.color}
                `}>
                                    {genre.icon}
                                </div>

                                <h3 className={`font-bold text-lg leading-tight ${isSelected ? 'text-blue-900 dark:text-blue-300' : 'text-slate-700 dark:text-slate-200'}`}>
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
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                            }
            `}
                    >
                        Save & Continue to Dashboard
                    </button>
                </div>

            </div>

            <ConfirmationModal
                isOpen={alertConfig.isOpen}
                onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
                title={alertConfig.title}
                message={alertConfig.message}
                confirmText="Got it"
                isAlert={true}
            />
        </div>
    );
};

export default GenreSelection;