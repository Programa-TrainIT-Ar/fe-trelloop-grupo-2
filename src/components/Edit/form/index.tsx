'use client';

import { useEffect, useState } from 'react';
import BoardInfo from './view/BoardInfo';
import Members from './view/Members';
import Tags from './view/Tags';
import Visibility from './view/Visibility';
import Actions from './view/Actions';
import { getToken } from '../../../store/authStore';
import { useRouter } from 'next/navigation';
import { useCardTags } from 'hooks/useCardTags';

// URL default de backend
const DEFAULT_CLOUDINARY_URL = "https://res.cloudinary.com/djw3lkdam/image/upload/v1754147240/samples/cloudinary-icon.png";

// Array de avatares por defecto
const AVATAR_IMAGES = [
  "/assets/icons/avatar1.png",
  "/assets/icons/avatar2.png",
  "/assets/icons/avatar3.png",
  "/assets/icons/avatar4.png",
];

// Función para obtener avatar basado en índice
const getAvatarSrc = (index: number) => {
  return AVATAR_IMAGES[index % AVATAR_IMAGES.length];
};

type Props = {
  boardId: string;
};

const Form = ({ boardId }: Props) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState<string | File>('');
  const [members, setMembers] = useState<any[]>([]);
  const [formTags, setFormTags] = useState<{id: number, name: string}[]>([]);
  const [visibility, setVisibility] = useState<'PRIVATE' | 'PUBLIC'>('PRIVATE');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchBoard = async () => {
      const token = getToken();
      if (!token) {
        setError("No estás autenticado.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/boards/${boardId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("No se pudo cargar el tablero.");
        }

        const data = await res.json();

        setName(data.name || '');
        setDescription(data.description || '');
        setImageUrl(data.board_image_url || '');
        setMembers(
          (data.members || []).map((user: any, index: number) => ({
            id: String(user.id),
            name: `${user.name} ${user.last_name}`.trim(),
            username: user.email?.split("@")[0] || "usuario",
            email: user.email,
            img: (user.avatar_url && user.avatar_url !== DEFAULT_CLOUDINARY_URL) ? user.avatar_url : getAvatarSrc(index),
          }))
        );
        setFormTags(data.tags);
        setVisibility(data.status === 'PUBLIC' ? 'PUBLIC' : 'PRIVATE');
      } catch (err: any) {
        setError(err.message || 'Error desconocido.');
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [boardId]);
  const { tags, handleDeleteTag, handleAddTag } = useCardTags(formTags, setFormTags);

  const handleDeleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };


  const handleAddMember = (user: any) => {
    setMembers((prev) => {
      const exists = prev.some((m) => m.id === user.id);
      if (exists) return prev;
      return [...prev, user];
    });
  };

  const handleVisibilityChange = (value: 'PRIVATE' | 'PUBLIC') => {
    setVisibility(value);
  };

  const handleCancel = () => {
    console.log('Cancelando edición...');
    router.push('/home');
  };

  const handleSave = async () => {
    const token = getToken();
    if (!token) {
      alert("No tienes permisos para guardar.");
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("status", visibility);

    // 👇 Añadir imagen solo si es un archivo nuevo
    if (imageUrl instanceof File) {
      formData.append("image", imageUrl); // 👈 este es el campo que espera el backend
    }

    members.forEach((m) => {
      formData.append("members", m.email || m.id); // usa email si existe
    });

    tags.forEach((tag) => {
      formData.append("tags", tag.name);
    });

    try {
      const res = await fetch(`http://localhost:5000/api/boards/${boardId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Error al guardar los cambios");

      router.push('/home');
    } catch (err: any) {
      alert(err.message || "Ocurrió un error inesperado.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-lg">Cargando tablero...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <section>
        <BoardInfo
          name={name}
          description={description}
          imageUrl={imageUrl}
          onNameChange={setName}
          onDescriptionChange={setDescription}
          onImageUrlChange={setImageUrl}
        />
      </section>

      <section>
        <Members
          members={members}
          onDelete={handleDeleteMember}
          onAdd={handleAddMember}
        />
      </section>

      <section>
        <Tags
          tags={tags}
          onAdd={handleAddTag}
          onDelete={handleDeleteTag}
        />
      </section>

      <section>
        <Visibility
          value={visibility}
          onChange={handleVisibilityChange}
        />
      </section>

      <section className="pt-2">
        <Actions
          onCancel={handleCancel}
          onSave={handleSave}
        />
      </section>
    </div>
  );
};

export default Form;