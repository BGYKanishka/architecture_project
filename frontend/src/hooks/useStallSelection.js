import { useState, useEffect } from "react";

const useStallSelection = (maxSelection = 3) => {
    const [selectedStalls, setSelectedStalls] = useState(() => {
        const saved = localStorage.getItem("selectedStalls");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("selectedStalls", JSON.stringify(selectedStalls));
        window.dispatchEvent(new Event("selectedStallsUpdated"));
    }, [selectedStalls]);

    const toggleSelection = (stall, paidReservations, cancelledReservations) => {
        const isActuallyReserved = stall.reserved && !cancelledReservations.includes(stall.id);
        const isPaid = paidReservations.some(item => (typeof item === 'object' && item !== null ? item.id : item) === stall.id);

        if (isActuallyReserved || isPaid) return;

        if (selectedStalls.includes(stall.id)) {
            setSelectedStalls(selectedStalls.filter((id) => id !== stall.id));
        } else {
            if (selectedStalls.length >= maxSelection) {
                alert(`Max ${maxSelection} stalls!`);
                return;
            }
            setSelectedStalls([...selectedStalls, stall.id]);
        }
    };

    const clearSelection = () => {
        setSelectedStalls([]);
    };

    return { selectedStalls, setSelectedStalls, toggleSelection, clearSelection };
};

export default useStallSelection;
