import React from "react";

const MapBlock = ({ name, height = "h-full", status, onClick }) => {
    const isAvailable = status === "available";
    const color = isAvailable 
        ? "bg-emerald-950/70 border-emerald-500/80 text-emerald-300 hover:bg-emerald-900/80 hover:shadow-lg hover:shadow-emerald-950/50 cursor-pointer"
        : status === "full" 
            ? "bg-slate-900 border-slate-700 text-slate-500 cursor-not-allowed opacity-75"
            : "bg-slate-900/60 border-slate-800 text-slate-400";

    return (
        <div onClick={onClick}
            className={`w-full ${height} border-2 rounded-xl flex items-center justify-center text-center font-bold text-xs md:text-xl transition-all duration-200 ${color}`}>
            {name}
        </div>
    );
};

const Octagon = ({ name, status, onClick }) => {
    const isAvailable = status === "available";

    const borderColor = isAvailable ? "bg-emerald-500" : status === "full" ? "bg-slate-700" : "bg-slate-800";

    const innerColor = isAvailable
        ? "bg-emerald-950/90 text-emerald-300 hover:bg-emerald-900"
        : status === "full"
            ? "bg-slate-900 text-slate-500"
            : "bg-slate-900/80 text-slate-400";

    return (
        <div onClick={onClick}
            className={`w-full h-full flex items-center justify-center shadow-lg transition hover:scale-105 cursor-pointer ${borderColor}`}
            style={{
                clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                padding: "2px"
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
    const color = isAvailable 
        ? "bg-emerald-950/70 border-emerald-500/80 text-emerald-300 hover:bg-emerald-900/80 hover:shadow-lg hover:shadow-emerald-950/50 cursor-pointer"
        : status === "full" 
            ? "bg-slate-900 border-slate-700 text-slate-500 cursor-not-allowed opacity-75"
            : "bg-slate-900/60 border-slate-800 text-slate-400";
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
        <div className="flex flex-col items-center justify-center w-full my-4">
            {/* Legend */}
            <div className="flex gap-6 mb-8 text-xs font-semibold">
                <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded bg-emerald-950 border border-emerald-500"></span>
                    <span className="text-slate-300">Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded bg-slate-900 border border-slate-700"></span>
                    <span className="text-slate-500">Fully Booked</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded bg-slate-800 border border-slate-700"></span>
                    <span className="text-slate-400">Main Complex</span>
                </div>
            </div>

            {/* Grid Container */}
            <div className="w-full max-w-4xl aspect-[4/3] p-4 sm:p-6 bg-[#0b0f19] rounded-xl border border-slate-800 shadow-inner">
                <div className="grid grid-cols-12 grid-rows-10 gap-2 sm:gap-3 w-full h-full">

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
                        <div className="w-full h-full bg-slate-800 border border-slate-700 text-slate-300 flex flex-col items-center justify-center font-bold text-center shadow-xl p-4 leading-tight rounded-xl"
                            style={{ clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)" }}>
                            <span className="text-xs md:text-lg">BMICH</span>
                            <span className="text-[10px] md:text-sm mt-0.5 text-slate-400 font-medium">MAIN BUILDING</span>
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
