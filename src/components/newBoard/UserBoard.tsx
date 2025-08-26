import Image from "next/image";

interface UserBoardProps {
  name: string;
  username: string;
  img: string;
}

export const UserBoard = ({ name, username, img }: UserBoardProps) => {
  return (
    <div className="member flex items-center mr-[15px] mt-[8px]">
      <div className="member-img mr-[5px]">
        <Image
          src={img}
          alt="member-img"
          width={28}
          height={28}
          className="rounded-2xl mr-[5px]"
        />
      </div>

      <div className="member-data">
        <div className="member-name text-white text-sm">{name}</div>
        <div className="member-username text-gray-400 text-xs">@{username}</div>
      </div>

    </div>
  );
};
