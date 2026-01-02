import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeProvider";

function SubmitButton({ isLoading }) {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <motion.button
      style={{ animationDelay: "0.2s" }}
      type="submit"
      disabled={isLoading}
      className="animate-fadeinup text-1xl group relative flex h-16 w-64 cursor-pointer touch-manipulation items-center justify-center overflow-hidden rounded-lg p-2 font-extrabold text-gray-900 opacity-0 shadow-lg duration-200 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 md:text-2xl lg:h-20 lg:text-3xl dark:text-gray-100"
      animate={{
        background: isDark
          ? "linear-gradient(to right, #0ea5e9, #3b82f6)" // sky-400 to blue-500
          : "linear-gradient(to right, #0ea5e9, #2563eb)", // sky-500 to blue-600
      }}
      whileHover="hover"
      whileFocus="hover"
      whileTap="hover"
    >
      <motion.div
        className="absolute -top-4 right-32 z-10 h-40 w-40 rounded-full bg-blue-200 dark:bg-sky-800"
        variants={{
          hover: { top: 4, right: 8, scale: 1.5 },
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      <motion.div
        className="absolute -top-4 right-2 z-10 h-32 w-32 rounded-full bg-slate-100 dark:bg-blue-900"
        variants={{
          hover: { top: 4, right: 8, scale: 1.5 },
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      <motion.div
        className="absolute top-4 -right-12 z-10 h-24 w-24 rounded-full bg-blue-200 dark:bg-sky-800"
        variants={{
          hover: { top: 4, right: 8, scale: 1.5 },
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      <motion.div
        className="absolute -top-4 right-20 z-10 h-16 w-16 rounded-full bg-sky-400 dark:bg-sky-600"
        variants={{
          hover: { top: 4, right: 8, scale: 1.5 },
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      <p className="relative z-10">{isLoading ? t("homepage.cutting") : t("homepage.cut")}</p>
    </motion.button>
  );
}
export default SubmitButton;
