const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/utils/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#f0efff",
          200: "#cfcbff",
          300: "#ada7ff",
          400: "#8c83ff",
          500: "#6a5fff",
          600: "#524ac6",
          700: "#3a348c",
          800: "#231f53",
          900: "#0b0a1a",
        },
        secondary: {
          100: "#ffeff6",
          200: "#ffcbe2",
          300: "#ffa6ce",
          400: "#ff82ba",
          500: "#ff5ea6",
          600: "#c64981",
          700: "#8c345b",
          800: "#531f36",
          900: "#1a0911",
        },
        neutral: {
          0: "#ffffff",
          100: "#dedede",
          200: "#c4c4c4",
          300: "#aaaaaa",
          400: "#8f8f8f",
          500: "#757575",
          600: "#5c5c5c",
          700: "#434343",
          800: "#2b2b2b",
          900: "#121212",
          1000: "#000000",
        },
        blue: {
          100: "#edeefe",
          200: "#bfc5fa",
          300: "#909bf7",
          400: "#6271f3",
          500: "#3447f0",
          600: "#2837ba",
          700: "#1d2784",
          800: "#11174e",
          900: "#050718",
        },
        yellow: {
          100: "#fff8ea",
          200: "#ffe7b6",
          300: "#ffd582",
          400: "#ffc44d",
          500: "#ffb219",
          600: "#c68a13",
          700: "#8c620e",
          800: "#533a08",
          900: "#1a1203",
        },
        green: {
          100: "#ecf3ed",
          200: "#bdd6be",
          300: "#8db88f",
          400: "#5e9b61",
          500: "#2e7d32",
          600: "#246127",
          700: "#19451c",
          800: "#0f2910",
          900: "#050d05",
        },
        red: {
          100: "#fee9e9",
          200: "#fdb2b2",
          300: "#fb7a7a",
          400: "#fa4343",
          500: "#f80b0b",
          600: "#c00909",
          700: "#880606",
          800: "#510404",
          900: "#190101",
        },
      },
      backgroundColor: {
        body: "#121212",
        height: "#5c5c5c",
        medium: "#2b2b2b",
        low: "#000000",
      },
      textColor: {
        default: "#ffffff",
        inverted: "#000000",
        subtle: "#757575",
      },
      borderColor: {
        subtle: "#121212",
        medium: "#757575",
        heavy: "#c4c4c4",
      },
    },
  },

  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        ".form-input-default": {
          width: "100%",
          borderWidth: "1px",
          borderColor: "#3c3c3c",
          "--tw-border-opacity": "0.7",
          padding: theme("spacing.2"),
          borderRadius: "10px",
          backgroundColor:
            "color-mix(in srgb, transparent, var(--global-color-neutral-0) 4%)",
          backdropFilter: "blur(3.6px)",
          "&::placeholder": {
            color: "#797676",
          },
        },
        'input[type="password"]::-ms-reveal': {
          display: "none",
        },
        ".bg-dual-circles": {
          backgroundColor: "#1A1A1A",
        },
        ".bg-header": {
          backgroundColor:
            "color-mix(in srgb, transparent, var(--global-color-neutral-1000) 7%)",
        },
      });
    }),
  ],
};
