import { motion } from "motion/react";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeProvider";

function Registrsubmit({ children }) {
	const { theme } = useContext(ThemeContext);
	const isDark = theme === "dark";

	return (
		<motion.button
			type="submit"
			className="touch-manipulation
          shadow-lg h-16
          lg:h-20  text-1xl md:text-2xl lg:text-3xl
          p-4  rounded-lg text-white dark:text-slate-900 font-extrabold
          w-3xs md:w-[55vw]
          lg:w-[70vw]
          max-w-5xl"
			animate={{
				backgroundColor: isDark ? "#f43f5e" : "#60a5fa" // rose-500 : blue-400
			}}
			whileHover={{
				backgroundColor: isDark ? "#fb7185" : "#93c5fd", // rose-400 : blue-300
				boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
				scale: 1.02
			}}
			whileTap={{
				backgroundColor: isDark ? "#e11d48" : "#1d4ed8", // rose-600 : blue-700
				scale: 0.98
			}}
			transition={{ duration: 0.2, ease: "easeOut" }}
			tapTransition={{ duration: 0.1, ease: "easeOut" }}
		>
			{children}
		</motion.button>
	);
}

export default Registrsubmit;
