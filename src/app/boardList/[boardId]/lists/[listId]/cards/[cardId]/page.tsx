"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "styles/datepicker.css";
import { es } from "date-fns/locale";

import DashboardSidebar from "components/home/DashboardSidebar";
import UserNavbar from "components/home/UserNavbar";
import CloseButton from "components/ui/CloseButton";
import Responsible from "components/EditCard/Responsible";
import Tags from "components/Edit/form/view/Tags";
import ReminderSelect from "components/Edit/form/view/ReminderSelect";

import { useCardForm } from "hooks/useCardForm";
import { useCardMembers } from "hooks/useCardMembers";
import { useCardTags } from "hooks/useCardTags";

import { Tags as TagsType } from "types/tags";

export default function PgtListasEditar() {
  const router = useRouter();
  const { boardId, listId, cardId } = useParams<{
    boardId: string;
    listId: string;
    cardId: string;
  }>();
  const boardIdNum = Number(boardId);
  const listIdNum = Number(listId);
  const cardIdNum = Number(cardId);

  const {
    form,
    loading,
    error,
    reminderValue,
    handleFormChange,
    handleDateChange,
    handleReminderChange,
    handleSubmit,
    setForm,
  } = useCardForm();

  const { handleAddResponsible, handleDeleteResponsible } = useCardMembers(
    form,
    setForm,
    boardIdNum,
    listIdNum,
    cardIdNum
  );
  const adaptSetFormTags = (setForm: any) => (tags: TagsType[]) => {
  setForm((prev: any) => ({ ...prev, tags }));
};
  const { tags, handleAddTag, handleDeleteTag } = useCardTags(
    form.tags,
    adaptSetFormTags(setForm)
  );
  // proximo manejo de loading y errores
  // if (loading) {
  //   return <div>Cargando...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  return (
    <div className="flex bg-[#191919] h-full w-full">
      <DashboardSidebar />
      <div className="min-w-0 w-full">
        <UserNavbar showCreateBoardButton={false} />
        <div className="flex items-center justify-between p-5">
          <h1 className="text-2xl font-poppins whitespace-nowrap text-white">
            Editar tarjeta
          </h1>
          <CloseButton onClick={() => router.back()} />
        </div>
        <div className="p-6 flex items-center justify-center w-full">
          <form
            onSubmit={handleSubmit}
            className="flex items-center justify-center w-full"
          >
            <div className="flex gap-16 max-w-7xl justify-center">
              <div className="w-[320px] flex-shrink-0">
                <div className="mb-4 w-[325px] p-5 pt-0">
                  <label className="font-poppins block text-white mb-2">
                    Fecha de tarjeta
                  </label>
                  <div className="font-poppins w-full rounded-lg ms-2 outline-none bg-[#2a2a2a] text-white border border-[#3a3a3a] p-5">
                    <DatePicker
                      selected={form.startDate}
                      onChange={handleDateChange}
                      startDate={form.startDate}
                      endDate={form.endDate}
                      locale={es}
                      selectsRange
                      inline
                    />
                    <div className="flex items-center">
                      <input
                        value={
                          form.startDate
                            ? form.startDate.toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          handleFormChange(
                            "startDate",
                            new Date(e.target.value)
                          )
                        }
                        className="font-poppins w-full p-2 rounded-xl outline-none bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:ring-2 focus:ring-[#6a5fff]"
                        placeholder="Desde"
                      />
                      <input
                        value={
                          form.endDate
                            ? form.endDate.toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          handleFormChange("endDate", new Date(e.target.value))
                        }
                        className="font-poppins w-full p-2 rounded-xl ms-2 outline-none bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:ring-2 focus:ring-[#6a5fff]"
                        placeholder="Hasta"
                      />
                    </div>
                    <label className="font-poppins block text-white text-sm mt-5 mb-2">
                      Crear recordatorio
                    </label>
                    <ReminderSelect
                      value={reminderValue}
                      onChange={handleReminderChange}
                    />
                  </div>
                </div>
              </div>
              <div className="flex-1 max-w-2xl">
                <div className="space-y-6">
                  <div className="flex flex-col w-full items-start gap-1.5 relative">
                    <label className="[font-family:'Poppins',Helvetica] font-medium text-white text-sm tracking-[0] leading-[normal]">
                      Título de la tarjeta
                    </label>
                    <input
                      value={form.title}
                      onChange={(e) =>
                        handleFormChange("title", e.target.value)
                      }
                      placeholder="Ut enim ad minim veniam, quis nostrud"
                      className="w-full bg-[#ffffff0a] rounded-[10px] border border-solid border-[#3c3c3cb2] backdrop-blur-[1.8px]   [font-family:'Poppins',Helvetica] font-normal text-white placeholder-[#797676] text-sm tracking-[0] leading-[normal] px-2.5 py-[9px] outline-none h-auto focus:ring-1 focus:ring-[#6a5fff] focus:border-[#6a5fff]"
                    />
                  </div>
                  <div className="w-full flex flex-col items-start gap-1.5">
                    <label className="[font-family:'Poppins',Helvetica] font-medium text-white text-sm tracking-[0] leading-[normal]">
                      Descripción
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        handleFormChange("description", e.target.value)
                      }
                      placeholder="Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur"
                      className="flex-1 w-full min-h-[130px] bg-[#ffffff0a] rounded-[10px] border border-solid border-[#3c3c3cb2]  p-2.5 [font-family:'Poppins',Helvetica] font-normal placeholder-[#797676] text-white text-sm tracking-[0] leading-[normal] outline-none resize-none focus:ring-1 focus:ring-[#6a5fff] focus:border-[#6a5fff]"
                    />
                  </div>
                  <section>
                    <Responsible
                      boardId={boardIdNum}
                      members={form.assignees}
                      onDelete={handleDeleteResponsible}
                      onAdd={handleAddResponsible}
                    />
                  </section>
                  <div>
                    <label className="font-poppins block text-white mb-2">
                      Prioridad
                    </label>
                    <select
                      onChange={(e) =>
                        handleFormChange("priority", e.target.value)
                      }
                      value={form.priority}
                      className="font-poppins w-full p-2 rounded-xl outline-none bg-[#ffffff0a] text-[#cac5c5] border border-[#3a3a3a] focus:ring-1 focus:ring-[#6a5fff] focus:border-[#6a5fff] transition-all duration-200"
                    >
                      <option hidden>Agrega una prioridad...</option>
                      <option value="high" className="text-white bg-[#222222]">
                        Alta
                      </option>
                      <option
                        value="medium"
                        className="text-white bg-[#222222]"
                      >
                        Media
                      </option>
                      <option value="low" className="text-white bg-[#222222]">
                        Baja
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="font-poppins block text-white mb-2">
                      Estado
                    </label>
                    <select
                      onChange={(e) =>
                        handleFormChange("status", e.target.value)
                      }
                      value={form.status}
                      className="font-poppins w-full p-2 rounded-xl outline-none bg-[#ffffff0a] text-[#cac5c5] border border-[#3a3a3a] focus:ring-1 focus:ring-[#6a5fff] focus:border-[#6a5fff] transition-all duration-200"
                    >
                      <option className="text-white" hidden>
                        Agrega un estado...
                      </option>
                      <option
                        className="text-white bg-[#222222]"
                        value="Pendiente"
                      >
                        Pendiente
                      </option>
                      <option
                        className="text-white bg-[#222222]"
                        value="En progreso"
                      >
                        En progreso
                      </option>
                      <option
                        className="text-white bg-[#222222]"
                        value="Completado"
                      >
                        Completado
                      </option>
                    </select>
                  </div>
                  <div className="font-poppins mb-4">
                    <Tags
                      tags={tags}
                      onAdd={handleAddTag}
                      onDelete={handleDeleteTag}
                    />
                  </div>
                  <div className="flex gap-4 pt-6">
                    <div className="flex w-[575px]">
                      <button
                        type="button"
                        onClick={() => router.back()}
                        className="font-poppins flex-1 py-2 border border-[#6A5FFF] text-[#6A5FFF] rounded-xl hover:bg-[#5a4fef1b]"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="font-poppins flex-1 ml-4 py-2 bg-[#6A5FFF] hover:bg-[#5A4FEF] text-white rounded-xl"
                      >
                        Actualizar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
