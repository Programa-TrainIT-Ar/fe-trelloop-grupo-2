import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface NavbarProps {
  hideLogin?: boolean;
  hideRegister?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  hideLogin = false,
  hideRegister = false,
}) => {
  const router = useRouter();
  const goToLogin = () => router.push("/login");
  const goToRegister = () => router.push("/register");
  const goToHome = () => router.push("/");

  return (
    // Barra a lo ancho y por encima de cualquier fondo
    <div className="w-full bg-[#222222] relative z-50">
      {/* Contenedor interno centrado con ancho máximo correcto */}
      <div className="mx-auto max-w-[1366px] flex justify-between h-[72px] items-center">
        <div className="ml-5">
          <Image
            src="/assets/logo/logo-dark-trainit.webp"
            alt="logo"
            width={151}
            height={40}
            className="pt-[6px] pl-[18px] cursor-pointer"
            onClick={goToHome}
            priority
          />
        </div>

        <div className="flex">
          <div className="flex items-center justify-center mt-2 mr-[35px]">
            <button
              className="text-[16px] text-[#6a5fff] text-center w-[107px] h-[36px] mr-4"
              onClick={goToHome}
            >
              Inicio
            </button>
            <button
              className="text-[16px] text-white text-center w-[152px] h-[36px] mr-4"
              onClick={goToHome}
            >
              Acerca de
            </button>
            <button
              className="text-[16px] text-white text-center w-[152px] h-[36px] mr-4"
              onClick={goToHome}
            >
              Contacto
            </button>
          </div>

          {!hideLogin && (
            <button
              className="h-[36px] rounded-full w-[200px] border border-[#6a5fff] text-[#6a5fff] text-center justify-center flex px-3 mt-1 mr-4 pt-1"
              onClick={goToLogin}
            >
              LOGIN
            </button>
          )}

          {!hideRegister && (
            <button
              className="h-[36px] rounded-full w-[200px] bg-[#6a5fff] text-white text-center justify-center flex px-3 mt-1 mr-4 pt-1"
              onClick={goToRegister}
            >
              REGISTRARSE
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
