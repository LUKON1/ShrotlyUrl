import { useTranslation } from "react-i18next";
import { useEffect } from "react";

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning", // "warning", "danger", "info"
}) {
  const { t } = useTranslation();

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Блокировка скролла при открытом модале
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getConfirmButtonClass = () => {
    switch (type) {
      case "danger":
        return "bg-red-500 hover:bg-red-600 focus:ring-red-500";
      case "warning":
        return "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500";
      default:
        return "bg-sky-500 hover:bg-sky-600 focus:ring-sky-500";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black opacity-80 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="animate-modal-fade-in relative w-full max-w-md transform rounded-lg bg-white shadow-xl transition-all dark:bg-slate-800">
        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          </div>

          {/* Message */}
          <p className="mb-6 leading-relaxed text-gray-600 dark:text-gray-400">{message}</p>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-md px-4 py-2 font-medium text-gray-600 transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:outline-none dark:text-gray-400 dark:hover:bg-slate-700"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 ${getConfirmButtonClass()} rounded-md font-medium text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
