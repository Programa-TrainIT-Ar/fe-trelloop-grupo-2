import Image from "next/image";

const DEFAULT_CLOUDINARY_URL = "https://res.cloudinary.com/djw3lkdam/image/upload/v1754147240/samples/cloudinary-icon.png";

interface UserBoardProps {
  name: string;
  username: string;
  img: string;
}

export const UserBoard = ({ name, username, img }: UserBoardProps) => {
  // Fallback si img es vacío o default Cloudinary
  const resolvedImg = (img && img !== DEFAULT_CLOUDINARY_URL) ? img : "/assets/icons/avatar1.png"; // O usa cycling si pasas index

  return (
    <div className="member flex items-center mr-[15px] mt-[8px]">
      <div className="member-img mr-[5px]">
        <Image
          src={resolvedImg}
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