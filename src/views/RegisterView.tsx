"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SuccessModal from "../components/SuccessModal";
import IlustracionUsuario from "../assets/images/ilustracion-usuario.svg";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Background from "../components/register/Background";
import { ValidationError } from "../types/validatesError";
import { RegisterData} from "types/user";
import { registerUserController } from "controllers/authController";
import BackHeader from "components/BackHeader";
import Navbar from "components/Navbar/Navbar";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function RegisterView() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Confirmación al salir si el formulario tiene datos
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const isDirty = useMemo(() => {
    const { firstName, lastName, email, password, confirmPassword } = formData;
    return Boolean(firstName || lastName || email || password || confirmPassword);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: undefined,
      general: undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const { firstName, lastName, email, password, confirmPassword } = formData;
    const data: RegisterData = { firstName, lastName, email, password, confirmPassword };

    try {
      await registerUserController(data);
      setIsModalOpen(true);
    } catch (err) {
      if (err instanceof ValidationError) {
        if (err.field) {
          setFormErrors((prevErrors) => ({ ...prevErrors, [err.field!]: err.message }));
        } else {
          setFormErrors({ general: err.message });
        }
      } else if (err instanceof Error) {
        setFormErrors({ general: "Error inesperado: " + err.message });
      } else {
        setFormErrors({ general: "Error desconocido al registrar usuario." });
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    router.push("/login");
  };

  // Flecha atrás (BackHeader)
  const handleBackRequest = () => {
    if (isDirty) setShowLeaveConfirm(true);
    else router.push("/");
  };
  const confirmLeave = () => {
    setShowLeaveConfirm(false);
    router.push("/");
  };
  const cancelLeave = () => setShowLeaveConfirm(false);

  return (
    <div className="w-full bg-dual-circles text-text-default h-screen relative flex flex-col">
      {/* NAVBAR del home: full width y arriba de todo; ocultar REGISTRARSE aquí */}
      <Navbar hideRegister />

      {/* Fondo decorativo debajo y sin capturar clics */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Background />
      </div>

      {/* Header con flecha (usa onBack para chequear si hay datos) */}
      <BackHeader title="Registro de usuario" onBack={handleBackRequest} />

      <div className="flex-grow px-8 relative flex flex-col lg:flex-row justify-center">
        <div className="w-full lg:w-1/2 flex justify-end items-center p-8 order-last lg:order-first">
          <IlustracionUsuario
            alt="Imagen"
            className="w-[325px] lg:w-full max-w-xs lg:max-w-md"
          />
        </div>

        {/* Contenedor del Formulario */}
        <div className="w-full z-10 lg:w-1/2 flex justify-start items-center">
          <div className="w-full px-8 lg:px-0 lg:pr-16 max-w-[661px]">
            <form noValidate onSubmit={handleSubmit} className="w-full">
              <div className="flex space-x-2">
                <div className="flex flex-col w-full">
                  <label htmlFor="firstName" className="mb-2">
                    Nombres <span className="text-primary-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Escribe tus nombres"
                    id="firstName"
                    minLength={3}
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`form-input-default  ${formErrors.firstName ? "" : "mb-4"}`} 
                    required
                  />
                  {formErrors.firstName && (
                    <p className="text-red-500 text-sm mt-1 mb-2">{formErrors.firstName}</p>
                  )}
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="lastName" className="mb-2">
                    Apellidos <span className="text-primary-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    minLength={3}
                    placeholder="Escribe tus apellidos"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`form-input-default ${formErrors.lastName ? "" : "mb-4"}`}
                    required
                  />
                  {formErrors.lastName && (
                    <p className="text-red-500 text-sm mt-1 mb-2">{formErrors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col w-full">
                <label htmlFor="email" className="mb-2">
                  Correo electrónico <span className="text-primary-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Escribe tu correo electrónico"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input-default ${formErrors.email ? "" : "mb-4"}`}
                  required
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1 mb-2">{formErrors.email}</p>
                )}
              </div>

              <div className="flex space-x-2">
                <div className="relative flex flex-col w/full w-full">
                  <label htmlFor="password" className="mb-2">
                    Contraseña <span className="text-primary-500">*</span>
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    minLength={8}
                    placeholder="Escribe tu contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-input-default pr-10 `}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-11 right-0 pr-3 text-[#797676]"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                  {formErrors.password && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
                  )}
                </div>

                <div className="relative flex flex-col w/full w-full">
                  <label htmlFor="confirmPassword" className="mb-2">
                    Confirmar contraseña <span className="text-primary-500">*</span>
                  </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    minLength={8}
                    placeholder="Escribe tu confirmación"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`form-input-default pr-10 `}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-11 right-0 pr-3 text-[#797676]"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                  {formErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {formErrors.general && (
                <p className="text-red-500 text-sm mt-1">{formErrors.general}</p>
              )}

              <button
                type="submit"
                className="uppercase w-full h-[40px] my-6 bg-primary-500 text-white py-2 rounded-[8px]"
              >
                Registrarme
              </button>
            </form>

            <div className="w-full px-[20%] text-center justify-center">
              <p>
                Al registrarme, acepto las{" "}
                <Link href="#" className="text-secondary-500 hover:underline">
                  Condiciones del servicio
                </Link>
                , de Trainit y su{" "}
                <Link href="#" className="text-secondary-500 hover:underline">
                  Politica de privacidad
                </Link>
                .
              </p>
              <p className="text-sm text-center mt-[6%]">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="text-secondary-500 hover:underline">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de éxito (tu existente) */}
      <SuccessModal isOpen={isModalOpen} onClose={handleCloseModal} />

      {/* Modal de confirmación para salir si hay datos */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="w-[460px] h-[274px] bg-[#222222] rounded-[16px] flex flex-col items-center px-6 py-4 relative">
            <img src="/assets/icons/alert.png" alt="Alerta" className="w-[72px] h-[72px] mt-2" />
            <p className="text-white text-center font-poppins text-[14px] font-normal leading-[180%] mt-6">
              Está a punto de cancelar el registro. ¿Está seguro de cancelar la operación?
            </p>
            <div className="flex justify-between mt-auto mb-4 gap-4">
              <button
                onClick={cancelLeave}
                className="w-[180px] h-[32px] border border-[#6A5FFF] rounded-[8px] text-white text-[14px] font-normal leading-[117%] hover:opacity-90"
              >
                Cancelar
              </button>
              <button
                onClick={confirmLeave}
                className="w-[180px] h-[32px] bg-[#FB7A7A] rounded-[8px] text-white text-[14px] font-medium leading-[117%] hover:opacity-90"
              >
                Sí, salir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}