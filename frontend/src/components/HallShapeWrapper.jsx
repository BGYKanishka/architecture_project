import React from "react";

const HallShapeWrapper = ({ hallName, children }) => {
  const getShapeStyle = () => {
    switch (hallName) {
      case "Hall A":
      case "Hall B":
        return {
          clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
          backgroundColor: "#f0fdf4",
          aspectRatio: "1/1",
          position: "relative",
        }; s
      case "Hall C":
        return {
          borderRadius: "20px",
          borderBottomLeftRadius: "30%",
          backgroundColor: "#f0fdf4",
          minHeight: "600px",
          padding: "40px",

        };
      case "Hall D":
        return {
          borderRadius: "20px",
          borderBottomRightRadius: "30%",
          backgroundColor: "#f0fdf4",
          minHeight: "600px",
          padding: "40px",

        };
      case "Hall F":
      case "Hall G":
      case "Hall E":
        return {
          borderRadius: "20px",
          backgroundColor: "#f0fdf4",
          minHeight: "600px",
          padding: "40px",
        };

      default:
        return { borderRadius: "20px", padding: "40px", backgroundColor: "#f1f5f9" };
    }
  };

  const shapeStyle = getShapeStyle();

  const isOctagon = hallName === "Hall A" || hallName === "Hall B";

  return (
    <div className="w-full flex justify-center py-10 animate-fade-in">
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
    </div>
  );
};

export default HallShapeWrapper;