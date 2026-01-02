import { useContext } from "react";
import { motion } from "motion/react";
import { ThemeContext } from "../../context/ThemeProvider";

function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative inline-flex h-8 w-16 cursor-pointer touch-manipulation items-center rounded-full"
      aria-label="Toggle theme"
      animate={{
        backgroundColor: theme === "dark" ? "#334155" : "#fbbf24", // slate-700 : amber-400
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <motion.div
        className="absolute flex h-6 w-6 items-center justify-center rounded-full"
        animate={{
          x: theme === "dark" ? 36 : 4, // translate-x-9 (36px) : translate-x-1 (4px)
          backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff", // slate-900 : white
        }}
        transition={{ duration: 0.1, ease: "easeOut" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {theme === "dark" ? (
          <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          <svg className="h-4 w-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </motion.div>
    </motion.button>
  );
}

export default ThemeToggle;
