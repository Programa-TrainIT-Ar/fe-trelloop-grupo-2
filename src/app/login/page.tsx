"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useAuthStore } from "store/authStore";
import LogoutBanner from "components/LogoutBanner";
import Navbar from "components/Navbar/Navbar";
import BackHeader from "components/BackHeader"; // NUEVO: header con flecha

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, loading, user, isAuthenticated, logoutReason, clearLogoutReason } = useAuthStore();
  const [rememberMe, setRememberMe] = useState(false);

  // Función para cargar email guardado del localStorage
  const loadRememberedEmail = () => {
    try {
      const savedEmail = localStorage.getItem("rememberedEmail");
      const wasRemembered = localStorage.getItem("rememberMeChecked");

      if (savedEmail && wasRemembered === "true") {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    } catch (error) {
      console.error("Error al cargar email guardado:", error);
    }
  };

  // Función para guardar email en localStorage
  const saveEmail = (email: string) => {
    try {
      localStorage.setItem("rememberedEmail", email);
      localStorage.setItem("rememberMeChecked", "true");
    } catch (error) {
      console.error("Error al guardar email:", error);
    }
  };

  // Función para limpiar email guardado
  const clearRememberedEmail = () => {
    try {
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberMeChecked");
    } catch (error) {
      console.error("Error al limpiar email:", error);
    }
  };

  // Limpiar el banner cuando el componente se monta (opcional)
  useEffect(() => {
    // Solo limpiar si el usuario está navegando desde otra página
    // pero mantener el mensaje si viene de logout por inactividad
    loadRememberedEmail();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // validar que existan correo y contraseña:
    if (!email || !password) {
      setError("Por favor llena todos los campos.");
      return;
    }

    //revisar formato de correo valido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Formato de correo electrónico invalido.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    //si todo está bien, limpiar el error
    setError("");
    console.log("todo bien al 100");

    // Llamar a la función de login del contexto de autenticación
    const success = await login({ email, password });

    if (success) {
      // Si el login es exitoso y el usuario marcó "Recordarme"
      if (rememberMe) {
        saveEmail(email);
      } else {
        // Si no marcó "Recordarme", limpiar cualquier email guardado previamente
        clearRememberedEmail();
      }
      // Redirigir al usuario a la página principal o a donde se desee
      router.push("/home");
    } else {
      setError("Error al iniciar sesión.");
    }
  };

  const handleDismissAlert = () => {
    clearLogoutReason();
  };

  // Función para manejar cambios en el checkbox
  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setRememberMe(checked);

    // Si desmarca "Recordarme", limpiar el email guardado inmediatamente
    if (!checked) {
      clearRememberedEmail();
    }
  };

  return (
    <div
      className="w-full h-screen bg-cover bg-center bg-no-repeat text-text-default flex flex-col"
      style={{
        backgroundColor: "#1a1a1a",
        backgroundImage:
          "url('/assets/images/ui-login-registro-fondo-circulo-grupo.webp')",
      }}
    >
      {/* ⬇️ Navbar del home, sin tocar su estilo */}
      <Navbar hideLogin />

      {/* ⬇️ Reemplaza el header simple por BackHeader con flecha al home */}
      <BackHeader title="LOGIN" href="/" />

      <form onSubmit={handleSubmit} noValidate className="flex-1 flex flex-col">
        {/* Banner de alerta (solo si hay logoutReason) */}
        {logoutReason && (
          <div className="px-4 pt-4">
            <LogoutBanner
              reason={logoutReason}
              onDismiss={handleDismissAlert}
            />
          </div>
        )}

        {/* Contenido principal */}
        <div className="flex-1 flex text-white">
          {/* Lado izquierdo */}
          <div className="w-1/2 hidden md:flex items-center justify-center">
            <img
              src="/assets/images/ilustracion-candado.svg"
              alt="Ilustración de candado"
              className="max-w-md max-h-96 object-contain"
            />
          </div>

          {/* Lado derecho */}
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8">
            <div className="w-full max-w-md space-y-6 bg-[#1A1A1A]/40 backdrop-blur-sm p-6 rounded-lg">
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Escribe tu correo electrónico..."
                    className="w-full px-4 py-1 rounded-md bg-[#1a1a1a] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm">
                    Contraseña <span className="text-primary-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Escriba su contraseña"
                      className="w-full px-4 py-1 rounded-md bg-[#1a1a1a] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-[#797676]"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                    className="w-3 h-3 text-primary-0 rounded border-gray-300 focus:text-primary-0"
                  />
                  <span className="text-sm text-neutral-100">Recordarme</span>
                </label>

                <button className="w-full bg-primary-500 hover:bg-primary-600 text-white py-1 rounded-md transition duration-200">
                  Iniciar sesión
                </button>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>

              <p className="text-center text-sm text-gray-400">
                ¿No tienes cuenta?{" "}
                <Link
                  href="/register"
                  className="text-secondary-500 hover:underline"
                >
                  Regístrate
                </Link>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;