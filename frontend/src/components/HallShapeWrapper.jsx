import React from "react";

const HallShapeWrapper = ({ hallName, children }) => {
  const getShapeStyle = () => {
    switch (hallName) {
      case "Hall A":
      case "Hall B":
        return {
          type: "octagon",
          clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
          backgroundColor: "#0b0f19",
          borderColor: "#334155",
          borderWidth: "1.5px",
          aspectRatio: "1/1",
          position: "relative",
        };
      case "Hall C":
        return {
          borderRadius: "16px",
          borderBottomLeftRadius: "64px",
          backgroundColor: "#0b0f19",
          minHeight: "650px",
          padding: "36px",
          border: "1px solid #1e293b",
        };
      case "Hall D":
        return {
          borderRadius: "16px",
          borderBottomRightRadius: "64px",
          backgroundColor: "#0b0f19",
          minHeight: "650px",
          padding: "36px",
          border: "1px solid #1e293b",
        };
      case "Hall F":
      case "Hall G":
      case "Hall E":
        return {
          borderRadius: "16px",
          backgroundColor: "#0b0f19",
          minHeight: "650px",
          padding: "36px",
          border: "1px solid #1e293b",
        };

      default:
        return { borderRadius: "16px", padding: "36px", backgroundColor: "#0b0f19", border: "1px solid #1e293b" };
    }
  };

  const shapeStyle = getShapeStyle();

  return (
    <div className="w-full flex justify-center py-6">
      {shapeStyle.type === "octagon" ? (
        // Octagon with Fake Border via Nesting
        <div
          className="relative flex items-center justify-center shadow-2xl"
          style={{
            width: "100%",
            maxWidth: "800px",
            aspectRatio: shapeStyle.aspectRatio,
            clipPath: shapeStyle.clipPath,
            backgroundColor: shapeStyle.borderColor,
            padding: shapeStyle.borderWidth,
          }}
        >
          <div
            className="w-full h-full relative"
            style={{
              clipPath: shapeStyle.clipPath,
              backgroundColor: shapeStyle.backgroundColor
            }}
          >
            {/* Background Watermark Letter */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <span className="text-[160px] font-black text-slate-700 select-none">
                {hallName.replace("Hall ", "")}
              </span>
            </div>

            {/* Content */}
            <div className="relative w-full h-full">
              {children}
            </div>
          </div>
        </div>
      ) : (
        <div
          className="relative shadow-2xl"
          style={{
            width: "100%",
            maxWidth: "800px",
            height: "auto",
            aspectRatio: "1/1",
            ...shapeStyle
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <span className="text-[160px] font-black text-slate-700 select-none">
              {hallName.replace("Hall ", "")}
            </span>
          </div>
          <div className="relative w-full h-full">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default HallShapeWrapper;
