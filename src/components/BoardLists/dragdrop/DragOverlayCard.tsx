import React from "react";
import { Card } from "./types";

const DragOverlayCard: React.FC<{ activeCard: Card | null }> = ({ activeCard }) => {
  if (!activeCard) return null;

  return (
    <div className="transform rotate-5 opacity-90">
      <div className="relative bg-[#3a3a3a] w-[240px] h-[101px] rounded-md p-1 border-l-4 border-purple-600 flex flex-col justify-between shadow-2xl">
        <div className="flex items-center justify-between gap-1 flex-wrap">
          <div className="flex gap-1 flex-wrap">
            {activeCard.tags?.slice(0, 2).map((tag, idx) => (
              <div
                key={idx}
                className="rounded-[16px] bg-[#414141] text-[#E5E7EB] text-[11px] font-poppins px-3 py-0.5 w-fit"
              >
                {tag.name.length > 25 ? tag.name.slice(0, 22) + "..." : tag.name}
              </div>
            ))}
          </div>
        </div>

        <div className="ml-1 text-[13px] font-poppins text-[#E5E7EB]">
          {activeCard.title}
        </div>

        <div className="flex justify-between items-center text-gray-400 text-sm">
          <div className="flex -space-x-2">
            {activeCard.assignees?.slice(0, 2).map((user, idx) => (
              <img
                key={idx}
                src={user.avatar_url}
                alt={user.name}
                className="w-6 h-6 rounded-full border-[0.5px] border-black"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DragOverlayCard;
