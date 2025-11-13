
export type Visibility = 'PRIVATE' | 'PUBLIC';

export type Tag = string;

export interface Member {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}
export interface BoardFormState {
  name: string;
  description: string;
  boardImageUrl: string;
  members: Member[];
  tags: Tag[];
  status: Visibility;
}
export interface BoardInfoProps {
  name: string;
  description: string;
  imageUrl: string | File; 
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onImageUrlChange: (value: string | File) => void; 
}

export interface MembersProps {
  members: Member[];
  onAdd: (member: Member) => void;
  onDelete: (id: string) => void;
}

export interface TagsProps {
  tags: any[];
  onAdd: (newTag: string) => void;
  onDelete: (tagIdToRemove: number) => void;
}

export interface VisibilityProps {
  value: Visibility;
  onChange: (value: Visibility) => void;
}

export interface ActionsProps {
  onCancel: () => void;
  onSave: () => void;
}

export interface User {
  id: string;
  name: string;
  username: string;
  img: string;
  email: string;
}

export interface MemberSearchResultProps {
  user: User;
  onSelect: (user: User) => void;
}

