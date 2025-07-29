import { UserCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";

interface UserBoardProps {
  name: string;
  onRemove?: () => void;
}

export const UserBoard = ({ name, onRemove }: UserBoardProps) => {
  return (
    <div className="flex items-center bg-[#262626] text-white px-3 py-2 rounded-md gap-2">
      <UserCircleIcon className="h-5 w-5 text-blue-400" />
      <span>{name}</span>
      {onRemove && (
        <button onClick={onRemove}>
          <XMarkIcon className="h-4 w-4 text-gray-400 hover:text-white" />
        </button>
      )}
    </div>
  );
};
