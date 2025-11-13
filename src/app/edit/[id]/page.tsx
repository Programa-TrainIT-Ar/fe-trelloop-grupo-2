"use client";

import { useParams } from "next/navigation";
import EditBoardView from "../../../components/Edit/EditBoardView";

export default function EditBoardPage() {
  const params = useParams();
  const boardId = params?.id as string;

  if (!boardId) {
    return <div className="text-white p-6">ID de tablero no válido</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-900">
      <EditBoardView boardId={boardId} />
    </div>
  );
}
