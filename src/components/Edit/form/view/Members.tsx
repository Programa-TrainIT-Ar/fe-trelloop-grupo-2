"use client";
import Image from "next/image";
import { useMemberSearch } from "../controllers/useMemberSearch";
import MemberSearchResult from "./MemberSearchResult";

const DEFAULT_IMAGE_URL =
  "https://res.cloudinary.com/djw3lkdam/image/upload/v1754147240/samples/cloudinary-icon.png";

type Member = {
  id: string;
  name: string;
  username: string;
  img: string;
};

type MembersProps = {
  members: Member[];
  onDelete: (id: string) => void;
  onAdd: (member: Member) => void;
};

const Members = ({ members, onDelete, onAdd }: MembersProps) => {
  const { query, setQuery, results, loading } = useMemberSearch();

  const handleSelect = (member: Member) => {
    const alreadyExists = members.some((m) => m.id === member.id);
    if (!alreadyExists) {
      onAdd(member);
    }
    setQuery("");
  };

  return (
    <div className="space-y-2">
      <label className="block text-white font-medium pt-1">
        Miembros
      </label>

      <div className="relative w-[575px]">
        <input
          type="text"
          placeholder="Buscar por nombre o @usuario..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-[41px] bg-[#1e1e1e] text-white placeholder-[#797676] rounded-xl pl-2 pr-10 border border-[#3c3c3c] outline-none focus:ring-1 focus:ring-[#6a5fff] focus:border-[#6a5fff] transition-all duration-200"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>

        {query && results.length > 0 && (
          <div className="absolute top-[46px] left-0 w-full bg-[#1e1e1e] border border-[#3a3a3a] rounded-[10px] mt-1 z-10">
            {results.map((user) => {
              const transformedUser = {
                id: String(user.id),
                name: `${user.name} ${user.last_name}`.trim(),
                username: user.email?.split("@")[0] || "usuario",
                img: user.avatar_url || DEFAULT_IMAGE_URL,
              };

              return (
                <MemberSearchResult
                  key={transformedUser.id}
                  user={transformedUser}
                  onSelect={handleSelect}
                />
              );
            })}
          </div>
        )}

        {loading && (
          <div className="text-sm text-white mt-1 absolute top-[46px] bg-[#1e1e1e] p-2 rounded">
            Cargando...
          </div>
        )}
      </div>

      <div className="flex mt-[5px] flex-wrap">
        {members.map((member) => (
          <div
            className="flex items-center mr-[15px] mt-[8px]"
            key={member.id}
          >
            <Image
              src={member.img || DEFAULT_IMAGE_URL}
              alt="member-img"
              width={28}
              height={28}
              className="rounded-2xl mr-[5px]"
            />
            <div className="text-white text-sm">
              <div>{member.name}</div>
              <div className="text-xs text-gray-400">@{member.username}</div>
            </div>
            <button
              className="text-white ml-[25px]"
              onClick={() => onDelete(member.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Members;


