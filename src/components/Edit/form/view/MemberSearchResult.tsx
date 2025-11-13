"use client";
import Image from "next/image";
import { MemberSearchResultProps } from '../types';

const DEFAULT_CLOUDINARY_URL = "https://res.cloudinary.com/djw3lkdam/image/upload/v1757691992/cloudinary-icon-_f32b9t.png";

const MemberSearchResult = ({ user, onSelect }: MemberSearchResultProps) => {
  // Fallback si img es vacío o default Cloudinary
  const resolvedImg = (user.img && user.img !== DEFAULT_CLOUDINARY_URL) ? user.img : "/assets/icons/avatar1.png"; // O cycling si pasas index

  return (
    <div
      className="flex items-center px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer transition"
      onClick={() => onSelect(user)}
    >
      <Image
        src={resolvedImg}
        alt={user.name}
        width={32}
        height={32}
        className="rounded-full mr-3"
      />
      <div className="text-white">
        <div className="text-sm font-medium">{user.name}</div>
        <div className="text-xs text-gray-400">@{user.username}</div>
      </div>
    </div>
  );
};

export default MemberSearchResult;