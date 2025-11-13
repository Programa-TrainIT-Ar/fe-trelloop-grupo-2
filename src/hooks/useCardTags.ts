import { useState, useEffect } from 'react';

export function useCardTags(initialTags: any[], setForm: Function) {
  const [tags, setTags] = useState(initialTags);

  useEffect(() => {
    setTags(initialTags);
  }, [initialTags]);

  const handleDeleteTag = (tagIdToRemove: number) => {
    const updatedTags = tags.filter((tag: any) => tag.id !== tagIdToRemove);
    setTags(updatedTags);
    setForm(updatedTags);
  };

  const handleAddTag = (newTagName: string) => {
    const newTag = { id: Date.now(), name: newTagName };
    const updatedTags = [...tags, newTag];
    setTags(updatedTags);
    setForm(updatedTags);
  };

  return {
    tags,
    handleDeleteTag,
    handleAddTag,
  };
}
