"use client";

import DashboardSidebar from "../../components/home/DashboardSidebar";
import UserNavbar from "../../components/home/UserNavbar";
import UserNavbarEditView from "components/ui/UserNavbarEditView";
import CreateBoard from "../../components/newBoard/CreateBoard";
import AuthGuard from "components/AuthGuard";


export default function HomePage() {
  return (
    <AuthGuard>
      <div className="flex bg-[#1A1A1A] min-h-screen">
        {/* Sidebar lateral */}
        <DashboardSidebar />

        {/* Contenido principal */}
        <main className="flex-1 flex flex-col">
          {/* Navbar autenticado con buscador, iconos y botón */}
          <UserNavbarEditView/>

          {/* Sección de tableros */}
          <div className="px-6 pb-20">
            <CreateBoard />
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
