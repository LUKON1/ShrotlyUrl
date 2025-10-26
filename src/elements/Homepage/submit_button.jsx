import { useTranslation } from "react-i18next";

function SubmitButton({ isLoading }) {
    const { t } = useTranslation();
    return (
        <button
            type="submit"
            disabled={isLoading}
            className="text-1xl group relative flex h-16 w-64 cursor-pointer touch-manipulation items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 p-2 font-extrabold text-gray-900 shadow-lg duration-200 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 md:text-2xl lg:h-20 lg:text-3xl dark:from-sky-400 dark:to-blue-500 dark:text-gray-100"
        >
            <div className="absolute -top-4 right-32 z-10 h-40 w-40 rounded-full bg-rose-300 transition-all duration-500 ease-out group-hover:top-1 group-hover:right-2 group-hover:scale-150 group-focus:top-1 group-focus:right-2 group-focus:scale-150 group-active:top-1 group-active:right-2 group-active:scale-150 dark:bg-sky-800"></div>
            <div className="absolute -top-4 right-2 z-10 h-32 w-32 rounded-full bg-rose-50 transition-all duration-500 ease-out group-hover:top-1 group-hover:right-2 group-hover:scale-150 group-focus:top-1 group-focus:right-2 group-focus:scale-150 group-active:top-1 group-active:right-2 group-active:scale-150 dark:bg-blue-900"></div>
            <div className="absolute top-4 -right-12 z-10 h-24 w-24 rounded-full bg-rose-300 transition-all duration-500 ease-out group-hover:top-1 group-hover:right-2 group-hover:scale-150 group-focus:top-1 group-focus:right-2 group-focus:scale-150 group-active:top-1 group-active:right-2 group-active:scale-150 dark:bg-sky-800"></div>
            <div className="absolute -top-4 right-20 z-10 h-16 w-16 rounded-full bg-sky-400 transition-all duration-500 ease-out group-hover:top-1 group-hover:right-1 group-hover:scale-150 group-focus:top-1 group-focus:right-2 group-focus:scale-150 group-active:top-1 group-active:right-2 group-active:scale-150 dark:bg-sky-600"></div>
            <p className="relative z-10">{isLoading ? t("homepage.cutting") : t("homepage.cut")}</p>
        </button>
    );
}
export default SubmitButton;
