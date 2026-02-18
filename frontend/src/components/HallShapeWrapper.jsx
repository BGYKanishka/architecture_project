import React from "react";

const HallShapeWrapper = ({ hallName, children }) => {
  const getShapeStyle = () => {
    switch (hallName) {
      case "Hall A":
      case "Hall B":
        return {
          type: "octagon",
          clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
          backgroundColor: "#f0fdf4",
          borderColor: "#22c55e", // Green-500
          borderWidth: "2px",
          aspectRatio: "1/1",
          position: "relative",
        };
      case "Hall C":
        return {
          borderRadius: "5px",
          borderBottomLeftRadius: "40%",
          backgroundColor: "#f0fdf4",
          minHeight: "700px",
          padding: "40px",
          border: "2px solid #22c55e", // Green-500
        };
      case "Hall D":
        return {
          borderRadius: "5px",
          borderBottomRightRadius: "40%",
          backgroundColor: "#f0fdf4",
          minHeight: "700px",
          padding: "40px",
          border: "2px solid #22c55e", // Green-500
        };
      case "Hall F":
      case "Hall G":
      case "Hall E":
        return {
          borderRadius: "20px",
          backgroundColor: "#f0fdf4",
          minHeight: "700px",
          padding: "40px",
          border: "2px solid #22c55e", // Green-500
        };

      default:
        return { borderRadius: "20px", padding: "40px", backgroundColor: "#f1f5f9", border: "2px solid #e2e8f0" };
    }
  };

  const shapeStyle = getShapeStyle();

  return (
    <div className="w-full flex justify-center py-10 animate-fade-in">
      {shapeStyle.type === "octagon" ? (
        // Octagon with "Fake" Border via Nesting
        <div
          className="relative transition-all duration-500 flex items-center justify-center"
          style={{
            width: "100%",
            maxWidth: "800px",
            aspectRatio: shapeStyle.aspectRatio,
            clipPath: shapeStyle.clipPath,
            backgroundColor: shapeStyle.borderColor, // Outer color is border
            padding: shapeStyle.borderWidth, // Padding acts as border width
          }}
        >
          <div
            className="w-full h-full relative"
            style={{
              clipPath: shapeStyle.clipPath,
              backgroundColor: shapeStyle.backgroundColor // Inner color
            }}
          >
            {/* Background Letter */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
              <span className="text-[150px] font-black text-green-900 select-none">
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
          className="relative transition-all duration-500"
          style={{
            width: "100%",
            maxWidth: "800px",
            height: "auto",
            aspectRatio: "1/1",

            ...shapeStyle
          }}
        >

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
            <span className="text-[150px] font-black text-green-900 select-none">
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