import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
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
import UserService from "../../services/user.service";
import ConfirmationModal from "../../components/common/ConfirmationModal";

const genres = [
    { id: "Fiction", label: "Fiction", icon: <BookOpenIcon className="w-7 h-7" />, color: "bg-purple-950/70 border-purple-800/60 text-purple-400" },
    { id: "Non-Fiction", label: "Non-Fiction", icon: <GlobeAltIcon className="w-7 h-7" />, color: "bg-blue-950/70 border-blue-800/60 text-blue-400" },
    { id: "Academic & Education", label: "Academic & Education", icon: <AcademicCapIcon className="w-7 h-7" />, color: "bg-emerald-950/70 border-emerald-800/60 text-emerald-400" },
    { id: "Children's Books", label: "Children's Books", icon: <SparklesIcon className="w-7 h-7" />, color: "bg-amber-950/70 border-amber-800/60 text-amber-400" },
    { id: "Art & Photography", label: "Art & Photography", icon: <PaintBrushIcon className="w-7 h-7" />, color: "bg-pink-950/70 border-pink-800/60 text-pink-400" },
    { id: "Romance", label: "Romance", icon: <HeartIcon className="w-7 h-7" />, color: "bg-rose-950/70 border-rose-800/60 text-rose-400" },
    { id: "Sci-Fi & Fantasy", label: "Sci-Fi & Fantasy", icon: <RocketLaunchIcon className="w-7 h-7" />, color: "bg-indigo-950/70 border-indigo-800/60 text-indigo-400" },
    { id: "Biography", label: "Biography", icon: <MicrophoneIcon className="w-7 h-7" />, color: "bg-cyan-950/70 border-cyan-800/60 text-cyan-400" }
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
            return showAlert("Selection Required", "Please select at least one genre to help visitors discover your titles.");
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
        <div className="min-h-screen bg-[#0b0f19] py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-100">
            <div className="max-w-4xl mx-auto">

                <div className="text-center mb-10">
                    <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">Category Selection</p>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
                        What Literary Genres Do You Publish?
                    </h1>
                    <p className="text-sm text-slate-400 max-w-lg mx-auto">
                        Tag the categories of literature displayed at your stall. These appear on the interactive floor map.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {genres.map((genre) => {
                        const isSelected = selectedGenres.includes(genre.id);
                        return (
                            <div
                                key={genre.id}
                                onClick={() => toggleGenre(genre.id)}
                                className={`
                                    relative cursor-pointer rounded-xl p-5 border transition-colors
                                    ${isSelected
                                        ? `border-indigo-500 bg-[#0f1422] ring-1 ring-indigo-500/40`
                                        : `bg-[#0f1422] border-slate-800 hover:border-slate-700`
                                    }
                                `}
                            >
                                {isSelected && (
                                    <div className="absolute top-3 right-3 text-indigo-400">
                                        <CheckCircleIcon className="w-5 h-5" />
                                    </div>
                                )}

                                <div className={`
                                    w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-colors border
                                    ${isSelected ? 'bg-indigo-600 border-indigo-400 text-white' : genre.color}
                                `}>
                                    {genre.icon}
                                </div>

                                <h3 className={`font-medium text-sm leading-snug ${isSelected ? 'text-white' : 'text-slate-300'}`}>
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
                            px-6 py-2.5 rounded-lg font-medium text-sm transition-colors
                            ${selectedGenres.length > 0
                                ? 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer'
                                : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
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
