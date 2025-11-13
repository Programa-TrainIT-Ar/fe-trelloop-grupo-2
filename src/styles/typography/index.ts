// src/styles/typography/index.ts
import { Poppins } from "next/font/google";
import localFont from "next/font/local";

// Fuente de Google: Poppins
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-poppins",
  display: "swap",
});

// Fuente local: PPValve
export const ppValveExtraLightItalic = localFont({
  src: "../../app/fonts/PPValve/PPValve-PlainExtralightItalic.otf",
  weight: "200",
  style: "italic",
  variable: "--font-ppvalve",
  display: "swap",
});
