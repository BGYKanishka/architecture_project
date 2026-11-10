import React, { useState } from "react";

/**
 * Modern, architectural vector floor plan for the BMICH Exhibition Complex.
 * Fully responsive, strictly bounded inside the container, with clear status indicators.
 */
const HallMap = ({ getHallStatus, onHallClick }) => {
    const [hoveredHall, setHoveredHall] = useState(null);

    const halls = [
        {
            id: "Hall A",
            name: "Hall A",
            subtitle: "Main Plenary Hall",
            center: { x: 490, y: 125 },
            type: "octagon",
            path: "M 410 40 L 570 40 L 620 90 L 620 160 L 570 210 L 410 210 L 360 160 L 360 90 Z",
            door: { x: 490, y: 210, label: "Entrance" }
        },
        {
            id: "Hall B",
            name: "Hall B",
            subtitle: "Exhibition Hall",
            center: { x: 800, y: 125 },
            type: "octagon",
            path: "M 730 45 L 870 45 L 915 95 L 915 155 L 870 205 L 730 205 L 685 155 L 685 95 Z",
            door: { x: 800, y: 205, label: "Entrance" }
        },
        {
            id: "Hall C",
            name: "Hall C",
            subtitle: "West Exhibition Wing",
            center: { x: 490, y: 395 },
            type: "wing-left",
            // Strictly contained: starts y=260, ends y=530 (leaves 70px bottom padding)
            path: "M 400 260 H 580 V 530 H 470 A 70 70 0 0 1 400 460 Z",
            door: { x: 490, y: 260, label: "Main Concourse" }
        },
        {
            id: "Hall D",
            name: "Hall D",
            subtitle: "East Exhibition Wing",
            center: { x: 800, y: 395 },
            type: "wing-right",
            // Strictly contained: starts y=260, ends y=530 (leaves 70px bottom padding)
            path: "M 710 260 H 890 V 460 A 70 70 0 0 1 820 530 H 710 Z",
            door: { x: 800, y: 260, label: "Main Concourse" }
        },
        {
            id: "Hall G",
            name: "Hall G",
            subtitle: "Pavilion G",
            center: { x: 105, y: 140 },
            type: "rect",
            rect: { x: 45, y: 40, width: 120, height: 200, rx: 10 },
            door: { x: 105, y: 240, label: "Entry" }
        },
        {
            id: "Hall F",
            name: "Hall F",
            subtitle: "Pavilion F",
            center: { x: 245, y: 140 },
            type: "rect",
            rect: { x: 185, y: 40, width: 120, height: 200, rx: 10 },
            door: { x: 245, y: 240, label: "Entry" }
        },
        {
            id: "Hall E",
            name: "Hall E",
            subtitle: "Annex Hall",
            center: { x: 265, y: 415 },
            type: "rect",
            rect: { x: 215, y: 320, width: 100, height: 190, rx: 10 },
            door: { x: 265, y: 320, label: "Entry" }
        }
    ];

    const getStatusStyle = (hallId) => {
        const status = getHallStatus ? getHallStatus(hallId) : "available";
        const isHovered = hoveredHall === hallId;

        if (status === "available") {
            return {
                fill: isHovered ? "#093828" : "#07261c",
                stroke: isHovered ? "#34d399" : "#10b981",
                strokeWidth: isHovered ? 2.5 : 1.5,
                textColor: "#ffffff",
                badgeBg: "#064e3b",
                badgeBorder: "#059669",
                badgeText: "#6ee7b7",
                statusLabel: "Available",
                cursor: "pointer",
            };
        } else if (status === "full") {
            return {
                fill: isHovered ? "#1b253b" : "#111827",
                stroke: isHovered ? "#64748b" : "#334155",
                strokeWidth: 1.5,
                textColor: "#94a3b8",
                badgeBg: "#1e293b",
                badgeBorder: "#475569",
                badgeText: "#94a3b8",
                statusLabel: "Fully Booked",
                cursor: "not-allowed",
            };
        } else {
            return {
                fill: "#0f172a",
                stroke: "#334155",
                strokeWidth: 1.5,
                textColor: "#94a3b8",
                badgeBg: "#1e293b",
                badgeBorder: "#334155",
                badgeText: "#94a3b8",
                statusLabel: "Reserved",
                cursor: "default",
            };
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full my-2 font-sans select-none">
            {/* Legend & Instructions Bar */}
            <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-4 mb-4 px-2 text-xs">
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-[#07261c] border border-emerald-500"></span>
                        <span className="text-slate-300 font-medium">Available Wings</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-[#111827] border border-slate-700"></span>
                        <span className="text-slate-400 font-medium">Fully Booked</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-slate-900 border border-slate-700"></span>
                        <span className="text-slate-500 font-medium">Main Complex</span>
                    </div>
                </div>

                <div className="text-[11px] text-slate-400 hidden sm:block">
                    Click any wing to view live stall inventory
                </div>
            </div>

            {/* Map Canvas Card - strictly bounded, overflow-hidden */}
            <div className="w-full max-w-4xl bg-[#0b0f19] rounded-xl border border-slate-800 p-3 sm:p-5 shadow-2xl overflow-hidden relative">

                {/* Subtle Grid / Floor Blueprint Texture */}
                <svg
                    viewBox="0 0 1000 600"
                    className="w-full h-auto block"
                    style={{ maxHeight: "580px" }}
                >
                    <defs>
                        {/* Blueprint Dot Pattern */}
                        <pattern id="floor-dots" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="1" fill="#1e293b" opacity="0.4" />
                        </pattern>

                        {/* Drop shadow filter for interactive hovered elements */}
                        <filter id="hover-glow" x="-10%" y="-10%" width="120%" height="120%">
                            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#10b981" floodOpacity="0.25" />
                        </filter>
                    </defs>

                    {/* Canvas Background Grid */}
                    <rect width="1000" height="600" fill="#0b0f19" />
                    <rect width="1000" height="600" fill="url(#floor-dots)" />

                    {/* Outer Boundary Guideline */}
                    <rect
                        x="15"
                        y="15"
                        width="970"
                        height="570"
                        rx="12"
                        fill="none"
                        stroke="#1e293b"
                        strokeWidth="1"
                        strokeDasharray="4 6"
                        opacity="0.5"
                    />

                    {/* Campus North Compass Indicator */}
                    <g transform="translate(940, 45)" opacity="0.6">
                        <circle cx="0" cy="0" r="14" fill="#0f1422" stroke="#334155" strokeWidth="1" />
                        <path d="M 0 -10 L 4 2 L 0 0 L -4 2 Z" fill="#818cf8" />
                        <path d="M 0 10 L 4 2 L 0 0 L -4 2 Z" fill="#475569" />
                        <text x="0" y="-14" fill="#818cf8" fontSize="8" fontWeight="bold" textAnchor="middle">N</text>
                    </g>

                    {/* Connecting Courtyard / Concourse Walkways */}
                    <g opacity="0.4">
                        {/* Corridor between Hall A & Hall C */}
                        <line x1="490" y1="210" x2="490" y2="260" stroke="#334155" strokeWidth="6" strokeDasharray="4 4" />
                        {/* Corridor between Hall B & Hall D */}
                        <line x1="800" y1="205" x2="800" y2="260" stroke="#334155" strokeWidth="6" strokeDasharray="4 4" />
                        {/* Cross concourse between Hall A and Hall B */}
                        <line x1="620" y1="125" x2="685" y2="125" stroke="#334155" strokeWidth="4" strokeDasharray="4 4" />
                        {/* Walkway between Hall F and Hall A */}
                        <line x1="305" y1="140" x2="360" y2="140" stroke="#334155" strokeWidth="3" strokeDasharray="3 3" />
                        {/* Walkway between BMICH and Hall E */}
                        <line x1="190" y1="415" x2="215" y2="415" stroke="#334155" strokeWidth="3" strokeDasharray="3 3" />
                        {/* Walkway between Hall E and Hall C */}
                        <line x1="315" y1="415" x2="400" y2="415" stroke="#334155" strokeWidth="3" strokeDasharray="3 3" />
                    </g>

                    {/* ── BMICH MAIN BUILDING (Iconic Octagonal Convention Anchor) ── */}
                    <g className="cursor-default">
                        {/* Outer Octagon */}
                        <polygon
                            points="70,340 170,340 210,380 210,450 170,490 70,490 30,450 30,380"
                            fill="#0d1424"
                            stroke="#334155"
                            strokeWidth="1.5"
                        />
                        {/* Inner Architectural Ring */}
                        <polygon
                            points="80,355 160,355 195,390 195,440 160,475 80,475 45,440 45,390"
                            fill="#090e1a"
                            stroke="#1e293b"
                            strokeWidth="1"
                        />
                        <text x="120" y="410" fill="#e2e8f0" fontSize="13" fontWeight="bold" textAnchor="middle">
                            BMICH
                        </text>
                        <text x="120" y="425" fill="#64748b" fontSize="8" fontWeight="bold" letterSpacing="0.08em" textAnchor="middle">
                            MAIN BUILDING
                        </text>
                        <text x="120" y="440" fill="#475569" fontSize="7.5" textAnchor="middle">
                            Convention Center
                        </text>
                    </g>

                    {/* ── INTERACTIVE EXHIBITION HALLS ── */}
                    {halls.map((hall) => {
                        const style = getStatusStyle(hall.id);
                        const isHovered = hoveredHall === hall.id;

                        return (
                            <g
                                key={hall.id}
                                onClick={() => onHallClick && onHallClick(hall.name)}
                                onMouseEnter={() => setHoveredHall(hall.id)}
                                onMouseLeave={() => setHoveredHall(null)}
                                className="transition-all duration-200"
                                style={{ cursor: style.cursor }}
                                filter={isHovered ? "url(#hover-glow)" : undefined}
                            >
                                {/* Shape Geometry */}
                                {hall.type === "rect" ? (
                                    <rect
                                        x={hall.rect.x}
                                        y={hall.rect.y}
                                        width={hall.rect.width}
                                        height={hall.rect.height}
                                        rx={hall.rect.rx}
                                        fill={style.fill}
                                        stroke={style.stroke}
                                        strokeWidth={style.strokeWidth}
                                        className="transition-colors duration-200"
                                    />
                                ) : (
                                    <path
                                        d={hall.path}
                                        fill={style.fill}
                                        stroke={style.stroke}
                                        strokeWidth={style.strokeWidth}
                                        className="transition-colors duration-200"
                                    />
                                )}

                                {/* Hall Title */}
                                <text
                                    x={hall.center.x}
                                    y={hall.center.y - 10}
                                    fill={style.textColor}
                                    fontSize="16"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                    className="pointer-events-none"
                                >
                                    {hall.name}
                                </text>

                                {/* Hall Subtitle */}
                                <text
                                    x={hall.center.x}
                                    y={hall.center.y + 6}
                                    fill="#94a3b8"
                                    fontSize="9.5"
                                    fontWeight="medium"
                                    textAnchor="middle"
                                    className="pointer-events-none"
                                >
                                    {hall.subtitle}
                                </text>

                                {/* Status Pill Badge */}
                                <g transform={`translate(${hall.center.x - 35}, ${hall.center.y + 16})`} className="pointer-events-none">
                                    <rect
                                        width="70"
                                        height="16"
                                        rx="4"
                                        fill={style.badgeBg}
                                        stroke={style.badgeBorder}
                                        strokeWidth="0.8"
                                    />
                                    <text
                                        x="35"
                                        y="11.5"
                                        fill={style.badgeText}
                                        fontSize="8"
                                        fontWeight="bold"
                                        textAnchor="middle"
                                        letterSpacing="0.02em"
                                    >
                                        {style.statusLabel}
                                    </text>
                                </g>

                                {/* Entrance Indicator Mark */}
                                {hall.door && (
                                    <g transform={`translate(${hall.door.x}, ${hall.door.y})`} className="pointer-events-none opacity-80">
                                        <rect
                                            x="-18"
                                            y="-6"
                                            width="36"
                                            height="12"
                                            rx="2"
                                            fill="#0f172a"
                                            stroke="#475569"
                                            strokeWidth="0.8"
                                        />
                                        <text x="0" y="2.5" fill="#94a3b8" fontSize="6.5" fontWeight="semibold" textAnchor="middle">
                                            {hall.door.label}
                                        </text>
                                    </g>
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* Bottom Context Bar */}
                <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 px-1">
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        {hoveredHall ? (
                            <span>
                                Hovering: <strong className="text-white">{hoveredHall}</strong> — Click to inspect stall layout
                            </span>
                        ) : (
                            <span>Hover over any exhibition wing for details</span>
                        )}
                    </span>
                    <span className="text-slate-500">Sirimavo Bandaranaike Memorial Exhibition Centre</span>
                </div>
            </div>
        </div>
    );
};

export default HallMap;
