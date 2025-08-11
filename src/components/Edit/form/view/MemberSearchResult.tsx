"use client";
import Image from "next/image";
import { MemberSearchResultProps } from '../types';

const MemberSearchResult = ({ user, onSelect }: MemberSearchResultProps) => {
  return (
    <div
      className="flex items-center px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer transition"
      onClick={() => onSelect(user)}
    >
      <Image
        src={user.img}
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
