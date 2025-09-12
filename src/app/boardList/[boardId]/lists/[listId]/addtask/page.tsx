"use client";

import DashboardSidebar from "components/home/DashboardSidebar";
import UserNavbar from "components/home/UserNavbar";
import CloseButton from "components/ui/CloseButton";
import { useRouter, useParams } from "next/navigation";
import React, { useState } from "react";
import { getToken } from "store/authStore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "styles/datepicker.css";
import { es } from "date-fns/locale";
import { isValid, parseISO, format, isAfter } from "date-fns";
import ReminderSelect from "components/Edit/form/view/ReminderSelect";
import Tags from "components/Edit/form/view/Tags";
import Responsible from "components/EditCard/Responsible";
import { useCardTags } from "hooks/useCardTags";


export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";


export default function AddTask() {

    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("low");
    const [status, setStatus] = useState("pending");
    const [assignees, setAssignees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [formTags, setFormTags] = useState<{ id: number, name: string }[]>([]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [reminderDaysBefore, setReminderDaysBefore] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { boardId, listId } = useParams<{ boardId: string; listId: string; }>();
    const boardIdNum = Number(boardId);


    const handleDateChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;

        if (start && end && isAfter(start, end)) {
            setError("La fecha de inicio no puede ser posterior a la fecha de fin");
        } else {
            setError(null);
            setStartDate(start);
            setEndDate(end);
        }
    };

    const handleReminderChange = (daysBefore: number) => {
        setReminderDaysBefore(daysBefore);
    };

    // Lógica para agregar responsables
    const handleAddResponsible = (user: any) => {
        setAssignees((prev) => {
            const exists = prev.some((m) => m.id === user.id);
            if (!exists) {
                return [...prev, user];
            }
            return prev;
        });
    };

    // Lógica para eliminar responsables
    const handleDeleteResponsible = (id: string) => {
        setAssignees((prev) => prev.filter((m) => m.id !== id));
    };

    const { tags, handleDeleteTag, handleAddTag } = useCardTags(formTags, setFormTags);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const formattedStartDate = startDate ? startDate.toISOString().split('T')[0] : null;
        const formattedEndDate = endDate ? endDate.toISOString().split('T')[0] : null;

        let formattedReminderDate = null;
        let reminderMessage = "";

        if (endDate && reminderDaysBefore > 0) {
            const reminderDate = new Date(endDate);
            reminderDate.setDate(reminderDate.getDate() - reminderDaysBefore);
            formattedReminderDate = reminderDate.toISOString().split('T')[0];
            reminderMessage = `Recordatorio establecido para ${reminderDaysBefore} día(s) antes de la fecha de finalización de la tarjeta ${title}`;
        }


        const cardData = {
            title,
            description,
            priority,
            assignee_ids: assignees.map(a => a.id),
            tags: tags.map((t: any) => t.name),
            start_date: formattedStartDate,
            end_date: formattedEndDate,
            reminder_date: formattedReminderDate,
            reminder_message: reminderMessage
        };

        const token = getToken();

        try {
            const response = await fetch(`${API_BASE_URL}/api/boards/${boardId}/lists/${listId}/cards`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(cardData),
            });
            const data = await response.json();
            if (response.ok) {
                setSuccess("Tarjeta creada exitosamente");
                router.push(`/boardList/${boardId}`);
            } else {
                setError(data.message || "Error al crear la tarjeta");
            }
        } catch (error) {
            setError("Error de red al crear la tarjeta");
        };
    };

    const goToBoardLists = () => {
        router.push(`/boardList/${boardId}`)
    }


    return (
        <div className="flex bg-[#1A1A1A] min-h-screen">
            {/* Sidebar lateral */}
            <DashboardSidebar />
            <main className="flex-1 bg-[#1A1A1A] flex flex-col">
                {/* Navbar autenticado con buscador, iconos y sin botón */}
                <UserNavbar showCreateBoardButton={false} />
                <div className="flex items-center justify-between p-5">
                    <h1 className="text-lg font-poppins whitespace-nowrap text-white">Crear tarjeta </h1>
                    <CloseButton onClick={() => router.back()} />
                </div>
                <div className="flex p-5 w-full">
                    {/* Datepicker*/}
                    <div className="mb-4 w-[325px] ms-[60px]">
                        <div className="justify-between p-5">
                            <label className="font-poppins block text-white mb-2">Fecha de tarjeta</label>
                            <div className="font-poppins w-full rounded-lg ms-2 outline-none bg-[#2a2a2a] text-white border border-[#3a3a3a] p-5">
                                <DatePicker
                                    selected={startDate}
                                    onChange={handleDateChange}
                                    startDate={startDate}
                                    endDate={endDate}
                                    locale={es}
                                    selectsRange
                                    inline
                                />
                                <div className="flex items-center">
                                    <input
                                        value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
                                        onChange={(e) => handleDateChange([parseISO(e.target.value), endDate])}
                                        className="font-poppins w-full p-2 rounded-xl outline-none bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:ring-2 focus:ring-[#6a5fff]"
                                        placeholder="Desde"
                                        readOnly
                                    />
                                    <input
                                        value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
                                        onChange={(e) => handleDateChange([startDate, parseISO(e.target.value)])}
                                        className="font-poppins w-full p-2 rounded-xl ms-2 outline-none bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:ring-2 focus:ring-[#6a5fff]"
                                        placeholder="Hasta"
                                        readOnly
                                    />
                                </div>
                                {/* <ReminderSelect /> */}
                                <label className="font-poppins block text-white text-sm mt-5 mb-2">Crear recordatorio</label>
                                <ReminderSelect
                                    value={reminderDaysBefore}
                                    onChange={handleReminderChange}
                                />
                            </div>
                        </div>
                    </div>
                    {/* Formulario para crear una nueva tarjeta */}
                    <form className="flex-1 p-6" onSubmit={handleSubmit}>
                        <div className="mb-4 w-[575px]">
                            <label className="font-poppins block text-white mb-2">Título de la tarjeta</label>
                            <input type="text" className="font-poppins w-full p-2 rounded-xl outline-none bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:ring-2 focus:ring-[#6a5fff]"
                                placeholder="Escribe aquí"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required />
                        </div>
                        <div className="mb-4 w-[575px]">
                            <label className="font-poppins block text-white mb-2">Descripción</label>
                            <textarea className="font-poppins w-full p-2 rounded-xl outline-none bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:ring-2 focus:ring-[#6a5fff] focus:border-[#6a5fff] transition-all duration-200"
                                rows={4}
                                placeholder="Escribe aquí"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>
                        <section className="mb-4 w-[575px]">
                            <Responsible
                                boardId={boardIdNum}
                                members={assignees}
                                onDelete={handleDeleteResponsible}
                                onAdd={handleAddResponsible}
                            />
                        </section>
                        <div className="mb-4 w-[575px]">
                            <label className="font-poppins block text-white mb-2">Prioridad</label>
                            <select
                                className="font-poppins w-full p-2 rounded-xl outline-none bg-[#2a2a2a] text-gray-400 border border-[#3a3a3a] focus:ring-2 focus:ring-[#6a5fff] focus:border-[#6a5fff] transition-all duration-200"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                <option hidden>Agrega una prioridad...</option>
                                <option value="high" className="text-white">Alta</option>
                                <option value="medium" className="text-white">Media</option>
                                <option value="low" className="text-white">Baja</option>
                            </select>
                        </div>
                        <div className="mb-4 w-[575px]">
                            <label className="font-poppins block text-white mb-2">Estado</label>
                            <select
                                className="font-poppins w-full p-2 rounded-xl outline-none bg-[#2a2a2a] text-gray-400 border border-[#3a3a3a] focus:ring-2 focus:ring-[#6a5fff] focus:border-[#6a5fff] transition-all duration-200"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option hidden>Agrega un estado...</option>
                                <option value="pending">Pendiente</option>
                                <option value="in-progress">En progreso</option>
                                <option value="done">Completado</option>
                            </select>
                        </div>
                        <div className="font-poppins mb-4 w-[575px]">
                            <Tags
                                tags={tags}
                                onAdd={handleAddTag}
                                onDelete={handleDeleteTag}
                            />
                        </div>
                        <div className="flex w-[575px]">
                            <button type="button" className="font-poppins flex-1 py-2 border border-[#6A5FFF] text-[#6A5FFF] rounded-xl hover:bg-[#5a4fef1b]"
                                onClick={goToBoardLists}
                            >Cancelar creación</button>
                            <button type="submit" className="font-poppins flex-1 ml-4 py-2 bg-[#6A5FFF] hover:bg-[#5A4FEF] text-white rounded-xl"
                            >Crear tarjeta</button>
                        </div>
                        {error && <div className="mt-4 text-red-500 font-poppins">{error}</div>}
                        {success && <div className="mt-4 text-green-500 font-poppins">{success}</div>}
                    </form>
                </div>
            </main>
        </div>
    );
}