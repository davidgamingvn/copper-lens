import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", ...fontFamily.sans],
        heading: ["var(--font-heading)", ...fontFamily.sans],
        body: ["var(--font-body)", ...fontFamily.sans],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "#002868",
          foreground: "rgba(0, 40, 104)",
          50: "rgba(0, 40, 104, 0.05)",
          100: "rgba(0, 40, 104, 0.1)",
          200: "rgba(0, 40, 104, 0.2)",
          300: "rgba(0, 40, 104, 0.3)",
          400: "rgba(0, 40, 104, 0.4)",
          500: "rgba(0, 40, 104, 0.5)",
          600: "rgba(0, 40, 104, 0.6)",
          700: "rgba(0, 40, 104, 0.7)",
          800: "rgba(0, 40, 104, 0.8)",
          900: "rgba(0, 40, 104, 0.9)",
        },
        secondary: {
          DEFAULT: "#CE5C17",
          foreground: "rgba(206, 92, 23)",
          50: "rgba(206, 92, 23, 0.05)",
          100: "rgba(206, 92, 23, 0.1)",
          200: "rgba(206, 92, 23, 0.2)",
          300: "rgba(206, 92, 23, 0.3)",
          400: "rgba(206, 92, 23, 0.4)",
          500: "rgba(206, 92, 23, 0.5)",
          600: "rgba(206, 92, 23, 0.6)",
          700: "rgba(206, 92, 23, 0.7)",
          800: "rgba(206, 92, 23, 0.8)",
          900: "rgba(206, 92, 23, 0.9)",
        },
        accent: {
          DEFAULT: "#FED700",
          foreground: "rgba(254, 215, 0)",
          50: "rgba(254, 215, 0, 0.05)",
          100: "rgba(254, 215, 0, 0.1)",
          200: "rgba(254, 215, 0, 0.2)",
          300: "rgba(254, 215, 0, 0.3)",
          400: "rgba(254, 215, 0, 0.4)",
          500: "rgba(254, 215, 0, 0.5)",
          600: "rgba(254, 215, 0, 0.6)",
          700: "rgba(254, 215, 0, 0.7)",
          800: "rgba(254, 215, 0, 0.8)",
          900: "rgba(254, 215, 0, 0.9)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
