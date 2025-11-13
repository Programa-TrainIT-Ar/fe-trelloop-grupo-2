import React from "react";

const GridOverlay = () => {
  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <div className="h-full mx-auto w-full max-w-[1366px] px-[24px] grid grid-cols-12 gap-x-[24px]">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bg-[#FF00001A] h-full" />
        ))}
      </div>
    </div>
  );
};

export default GridOverlay;
