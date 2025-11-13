import { TagIcon } from "@heroicons/react/24/outline";

interface TagChipProps {
  label: string;
}

export const TagChip = ({ label}: TagChipProps) => {
  return (
    <div className="flex items-center bg-[#262626] text-primary-100 px-2 py-1 rounded-full text-xs gap-1 border border-primary-100">
      <TagIcon className="h-4 w-4 text-primary-100" />
      <span>{label}</span>
    </div>
  );
};
