import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { motion } from "motion/react";
import AuthContext from "../../context/AuthProvider";
import { ThemeContext } from "../../context/ThemeProvider";
import useAxiosPrivate from "../../utils/useAxiosPrivate";

function Logout() {
  const API_LOGOUT = "/user/logout";
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const axiosPrivate = useAxiosPrivate();
  const isDark = theme === "dark";
  const handleLogout = async () => {
    try {
      await axiosPrivate.post(API_LOGOUT, {});
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setAuth({});
      navigate("/");
    }
  };
  return (
    <motion.button
      onClick={handleLogout}
      type="button"
      className="touch-manipulation flex h-8 w-8 items-center justify-center rounded-md p-1.5 text-sm font-bold shadow-md sm:h-10 sm:w-10 sm:text-base md:h-14 md:w-14"
      animate={{
        backgroundColor: isDark ? "rgb(239 68 68)" : "rgb(252 165 165)", // red-500 : red-300
        color: isDark ? "rgb(51 65 85)" : "rgb(255 255 255)", // slate-900 : white
      }}
      whileHover={{
        backgroundColor: isDark ? "rgb(220 38 38)" : "rgb(248 113 113)", // red-600 : red-400
        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        scale: 1.05,
      }}
      whileTap={{
        backgroundColor: isDark ? "rgb(185 28 28)" : "rgb(239 68 68)", // red-700 : red-500
        scale: 0.95,
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      title={t("myurls.logout")}
    >
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M15 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H15M8 8L4 12M4 12L8 16M4 12L16 12"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        </svg>
    </motion.button>
  );
}
export default Logout;
