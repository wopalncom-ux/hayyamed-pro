/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary:    "#1a56a0",
        "primary-light": "#e8f0fe",
        surface:    "#f8fafc",
        border:     "#e2e8f0",
        muted:      "#64748b",
        success:    "#16a34a",
        warning:         "#d97706",
        "warning-light": "#fef3c7",
        danger:     "#dc2626",
        navy:       "#0f1f3d",
      },
    },
  },
  plugins: [],
};
