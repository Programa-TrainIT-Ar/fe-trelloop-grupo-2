"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";

interface DroppableListProps {
  children: React.ReactNode;
  listId: number;
}

const DroppableList: React.FC<DroppableListProps> = ({ children, listId }) => {
  const { setNodeRef } = useDroppable({
    id: `list-${listId}`,
  });

  return (
    <div ref={setNodeRef}>
      {children}
    </div>
  );
};

export default React.memo(DroppableList);
