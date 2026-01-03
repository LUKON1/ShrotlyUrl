import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { motion } from "motion/react";
import AuthContext from "../../context/AuthProvider";
import { ThemeContext } from "../../context/ThemeProvider";
import useAxiosPrivate from "../../utils/useAxiosPrivate";
import ConfirmModal from "../shared/ConfirmModal";

function DeleteProfile() {
  const API_DELETE_USER = "/user/deleteuser";
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const axiosPrivate = useAxiosPrivate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const isDark = theme === "dark";

  const handleDeleteUser = () => {
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosPrivate.delete(API_DELETE_USER);
      setAuth({});
      navigate("/");
    } catch (err) {
      console.error("Delete user error:", err);
      alert(t("modal.error", "Failed to delete account. Please try again."));
    }
  };
  return (
    <>
      <motion.button
        onClick={handleDeleteUser}
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
        title={t("myurls.deleteProfile")}
      >
        <svg fill="#FFFFFF" viewBox="-3 -2 24 24" preserveAspectRatio="xMinYMin">
          <path d="M6 2V1a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1h4a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-.133l-.68 10.2a3 3 0 0 1-2.993 2.8H5.826a3 3 0 0 1-2.993-2.796L2.137 7H2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4zm10 2H2v1h14V4zM4.141 7l.687 10.068a1 1 0 0 0 .998.932h6.368a1 1 0 0 0 .998-.934L13.862 7h-9.72zM7 8a1 1 0 0 1 1 1v7a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1zm4 0a1 1 0 0 1 1 1v7a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1z" />
        </svg>
      </motion.button>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDelete}
        title={t("modal.deleteProfile.title")}
        message={t("modal.deleteProfile.confirm")}
        confirmText={t("modal.deleteProfile.confirmBtn")}
        cancelText={t("modal.deleteProfile.cancelBtn")}
        type="danger"
      />
    </>
  );
}
export default DeleteProfile;
