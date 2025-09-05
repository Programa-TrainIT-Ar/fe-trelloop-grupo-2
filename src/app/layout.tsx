import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";
import { ReactNode } from "react";
import "../styles/globals.css";
import GridOverlay from "utils/dev/Grid";
import { Poppins } from "next/font/google";
import React from "react";

// ✅ Importar fuente correctamente
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-poppins",
});
import "../styles/globals.css";
import { ppValveExtraLightItalic } from "../styles/typography";


export const metadata: Metadata = {
  title: "Mi Proyecto",
  description: "Aplicación web en desarrollo",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${ppValveExtraLightItalic.variable} `}
    >
      <body>
        {children} {/*Grilla*/}
        {/* {process.env.NODE_ENV === "development" && <GridOverlay />} */}
      </body>
    </html>
  );
}
