import { TagIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface TagChipProps {
  label: string;
  onRemove?: () => void;
}

export const TagChip = ({ label, onRemove }: TagChipProps) => {
  return (
    <div className="flex items-center bg-[#262626] text-white px-2 py-1 rounded-full text-sm gap-1">
      <TagIcon className="h-4 w-4 text-purple-400" />
      <span>{label}</span>
      {onRemove && (
        <button onClick={onRemove}>
          <XMarkIcon className="h-4 w-4 text-gray-400 hover:text-white" />
        </button>
      )}
    </div>
  );
};

