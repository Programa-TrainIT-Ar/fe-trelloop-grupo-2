"use client";
import { useState } from "react";
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

    const data: RegisterData = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    };

    try {
      await registerUserController(data);
      setIsModalOpen(true);
    } catch (err) {
      if (err instanceof ValidationError) {
        if (err.field) {
          // Si el error tiene un campo específico, actualiza solo ese
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            [err.field!]: err.message,
          }));
        } else {
          // Si no tiene un campo específico (ej. 'general'), es un error general
          setFormErrors({ general: err.message });
        }
      } else if (err instanceof Error) {
        // Para otros errores que no son ValidationError
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

  return (
    <div className="w-full bg-dual-circles text-text-default h-screen relative flex flex-col">
      <div className="absolute inset-0 z-0">
        <Background />
      </div>
      <BackHeader title="Registro de usuario" />
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
                    className={`form-input-default  ${
                      formErrors.firstName ? "" : "mb-4"
                    }`} 
                    required
                  />
                  {formErrors.firstName && (
                    <p className="text-red-500 text-sm mt-1 mb-2">
                      {formErrors.firstName}
                    </p>
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
                    className={`form-input-default ${
                      formErrors.lastName ? "" : "mb-4"
                    }`}
                    required
                  />
                  {formErrors.lastName && (
                    <p className="text-red-500 text-sm mt-1 mb-2">
                      {formErrors.lastName}
                    </p>
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
                  className={`form-input-default ${
                    formErrors.email ? "" : "mb-4"
                  }`}
                  required
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1 mb-2">
                    {formErrors.email}
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                <div className="relative flex flex-col w-full">
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
                    className="absolute top-11  right-0 pr-3 text-[#797676]"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5 " />
                    )}
                  </button>
                  {formErrors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.password}
                    </p>
                  )}
                </div>
                <div className="relative flex flex-col w-full">
                  <label htmlFor="confirmPassword" className="mb-2">
                    Confirmar contraseña{" "}
                    <span className="text-primary-500">*</span>
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
                    className="absolute top-11  right-0 pr-3 text-[#797676]"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                  {formErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {formErrors.general && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.general}
                </p>
              )}

              <button
                type="submit"
                className="uppercase w-full h-[40px] my-6 bg-primary-500 text-white py-2  rounded-[8px]"
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
                <Link
                  href="/login"
                  className="text-secondary-500 hover:underline"
                >
                  Inicia sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <SuccessModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
