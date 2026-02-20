import React from "react";

const MapBlock = ({ name, height = "h-full", status, onClick }) => {
    const isAvailable = status === "available";
    const color = isAvailable ? "bg-green-50 dark:bg-slate-800 border-green-500 dark:border-slate-600 text-green-900 dark:text-blue-300 hover:bg-green-100 dark:hover:bg-slate-700 hover:shadow-md cursor-pointer"
        : status === "full" ? "bg-gray-200 dark:bg-slate-700 border-gray-400 dark:border-slate-600 text-gray-500 dark:text-slate-400 cursor-not-allowed opacity-80"
            : "bg-gray-50 dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-400 dark:text-slate-500";

    return (
        <div onClick={onClick}
            className={`w-full ${height} border-2 rounded-lg flex items-center justify-center text-center font-bold text-xs md:text-xl transition-all duration-200 ${color}`}>
            {name}
        </div>
    );
};

const Octagon = ({ name, status, onClick }) => {
    const isAvailable = status === "available";

    const borderColor = isAvailable ? "bg-green-500 dark:bg-slate-600" : status === "full" ? "bg-gray-400 dark:bg-slate-600" : "bg-gray-300 dark:bg-slate-700";

    const innerColor = isAvailable
        ? "bg-green-50 dark:bg-slate-800 text-green-900 dark:text-blue-300 hover:bg-green-100 dark:hover:bg-slate-700"
        : status === "full"
            ? "bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400"
            : "bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-slate-500";

    return (
        <div onClick={onClick}
            className={`w-full h-full flex items-center justify-center shadow-lg transition hover:scale-105 cursor-pointer ${borderColor}`}
            style={{
                clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                padding: "1.5px"
            }}>
            <div className={`w-full h-full flex items-center justify-center font-bold text-lg md:text-2xl ${innerColor}`}
                style={{ clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)" }}>
                {name}
            </div>
        </div>
    );
};

const Wing = ({ name, type, status, onClick }) => {
    const isAvailable = status === "available";
    //  gray for full
    const color = isAvailable ? "bg-green-50 dark:bg-slate-800 border-green-500 dark:border-slate-600 text-green-900 dark:text-blue-300 hover:bg-green-100 dark:hover:bg-slate-700 hover:shadow-md cursor-pointer"
        : status === "full" ? "bg-gray-200 dark:bg-slate-700 border-gray-400 dark:border-slate-600 text-gray-500 dark:text-slate-400 cursor-not-allowed opacity-80"
            : "bg-gray-50 dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-400 dark:text-slate-500";
    const round = type === "left" ? "rounded-bl-[5rem]" : "rounded-br-[5rem]";

    return (
        <div onClick={onClick}
            className={`w-full h-full border-2 flex items-center justify-center font-bold text-xs md:text-xl transition hover:scale-[1.02] ${color} ${round}`}>
            {name}
        </div>
    );
};

const HallMap = ({ getHallStatus, onHallClick }) => {
    return (
        <div className="w-full max-w-[95%] mx-auto">

            {/*  LEGEND */}
            <div className="flex justify-center gap-6 mb-8 bg-white dark:bg-slate-900 py-3 px-8 rounded-full shadow-md w-fit mx-auto border border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-green-100 border-2 border-green-500 rounded"></div>
                    <span className="text-sm font-bold text-gray-700 dark:text-slate-300">Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gray-200 dark:bg-gray-600 border-2 border-gray-400 rounded"></div>
                    <span className="text-sm font-bold text-gray-700 dark:text-slate-300">Full</span>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xl border-4 border-gray-200 dark:border-slate-700 relative min-h-[500px] transition-colors duration-300">
                {console.log("Rendering HallMap grid...")}
                <div className="grid grid-cols-12 grid-rows-10 gap-4 w-full max-w-4xl aspect-[12/10] mx-auto bg-white dark:bg-slate-900 rounded-2xl p-6">


                    <div className="col-start-5 col-span-4 row-start-1 row-span-4 z-10">
                        <Octagon name="Hall A" status={getHallStatus("Hall A")} onClick={() => onHallClick("Hall A")} />
                    </div>
                    <div className="col-start-10 col-span-3 row-start-2 row-span-3 z-10">
                        <Octagon name="Hall B" status={getHallStatus("Hall B")} onClick={() => onHallClick("Hall B")} />
                    </div>


                    <div className="col-start-1 col-span-2 row-start-1 row-span-5">
                        <MapBlock name="Hall G" height="h-full" status={getHallStatus("Hall G")} onClick={() => onHallClick("Hall G")} />
                    </div>
                    <div className="col-start-3 col-span-2 row-start-1 row-span-5">
                        <MapBlock name="Hall F" height="h-full" status={getHallStatus("Hall F")} onClick={() => onHallClick("Hall F")} />
                    </div>
                    <div className="col-start-6 col-span-3 row-start-5 row-span-6">
                        <Wing name="Hall C" type="left" status={getHallStatus("Hall C")} onClick={() => onHallClick("Hall C")} />
                    </div>
                    <div className="col-start-10 col-span-3 row-start-5 row-span-6">
                        <Wing name="Hall D" type="right" status={getHallStatus("Hall D")} onClick={() => onHallClick("Hall D")} />
                    </div>

                    <div className="col-start-1 col-span-3 row-start-7 row-span-3 z-0">
                        <div className="w-full h-full bg-slate-600 text-white flex flex-col items-center justify-center font-bold text-center shadow-2xl p-4 leading-tight"
                            style={{ clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)" }}>
                            <span className="text-xs md:text-xl">BMICH</span>
                            <span className="text-[10px] md:text-lg mt-1">MAIN BUILDING</span>
                        </div>
                    </div>

                    <div className="col-start-4 col-span-2 row-start-7 row-span-3">
                        <MapBlock name="Hall E" height="h-full" status={getHallStatus("Hall E")} onClick={() => onHallClick("Hall E")} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HallMap;
