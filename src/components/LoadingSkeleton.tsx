"use client";

import DashboardSidebar from "./home/DashboardSidebar";
import UserNavbar from "./home/UserNavbar";

interface LoadingSkeletonProps {
  message?: string;
}

const LoadingSkeleton = ({ message = "Cargando..." }: LoadingSkeletonProps) => {
  return (
    <div className="flex bg-[#1A1A1A] min-h-screen">
      {/* Sidebar lateral - versión opaca para mostrar estructura */}
      <div className="opacity-50">
        <DashboardSidebar />
      </div>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col">
        {/* Navbar - versión opaca */}
        <div className="opacity-50">
          <UserNavbar />
        </div>

        {/* Área de carga con spinner */}
        <div className="flex-1 flex items-center justify-center px-6 pb-20">
          <div className="flex flex-col items-center space-y-4">
            {/* Spinner animado */}
            <div className="relative">
              <div className="w-12 h-12 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-blue-400 rounded-full animate-spin animate-pulse"></div>
            </div>
            
            {/* Mensaje de carga */}
            <p className="text-gray-300 text-lg font-medium animate-pulse">
              {message}
            </p>
            
            {/* Puntos animados */}
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoadingSkeleton;