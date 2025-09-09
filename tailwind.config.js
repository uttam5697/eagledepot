/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontSize: {
      xs: ["0.875rem"], // 14px
      sm: ["1rem"], // 16px
      "2sm": ["18px"], // 18px
      base: ["1.25rem"], // 20px
      xl: ["1.5rem"], // 24px
      "2xl": ["1.875rem"], // 30px
      "3xl": ["2.125rem"], // 34px
      "4xl": ["2.75rem"], // 44px
      "4.5xl": ["3.375rem"], // 54px
      "5xl": ["5.25rem"], // 84px
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '12px',
        md: '1.5rem',
      }
    },
    extend: {
      fontFamily: {
        body: ['Cinzel', 'sans-serif'],
        playfairDisplay: ['EB Garamond', 'sans-serif'],
        quicksand: ['Quicksand', 'sans-serif'],
      },
      colors: {
        primary: "#C5A24C",
        "light-white": "#FBFAF7",
        black: "#000000",
        white: "#FFFFFF",
        peru: "#B08D40",
      },
      spacing: {
        "8xl": "96rem",
        "9xl": "128rem",
      },
      borderRadius: {
        "3xl": "1.875rem",
        "2xl": "1.25rem",
        xl: "0.938rem",
      },
      backgroundImage: {
        "primary-gradient": "linear-gradient(119.63deg, #C5A24C -28%, #000000 68.13%)",
        "black-gradient": "linear-gradient(180deg, #00000000 43.33%, #000000b3 100%)",
        "black-light-gradient": "linear-gradient(180deg, #0000001a 13.85%, #00000099 100%)",
        "black-dark-light-gradient": "linear-gradient(0deg, #00000000 70.11%, #00000080 100%)",
        "white-light-gradient": "linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)",
      },
    },
    screens: {
      "3xl": "1700px",
      'md': '768px',
      'lg': '1024px',
      'xl': '1152px',
      '2xl': '1280px',
    },
    theme: {
      extend: {
        animation: {
          fadeIn: 'fadeIn 0.6s ease-in-out',
        },
        keyframes: {
          fadeIn: {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
        },
      },
    }

  },
  plugins: [],
};