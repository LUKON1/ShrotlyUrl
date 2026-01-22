import { useTranslation } from "react-i18next";
import HiddenSVGIcons from "../shared/HiddenSVGIcons";

function ExpiredPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-full items-center justify-center">
      <div className="mx-auto flex max-w-lg flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-lg hover:shadow-xl dark:bg-slate-800">
        <div className="mb-8 h-32 w-32">
          <svg viewBox="0 0 20 20" className="text-orange-500 dark:text-orange-400">
            <use href="#timeout"></use>
          </svg>
        </div>
        <h1 className="mb-4 text-2xl font-bold text-orange-600 sm:text-3xl md:text-4xl dark:text-orange-400">
          {t("expired.title", "Link Expired")}
        </h1>
        <p className="mb-8 text-base text-gray-600 sm:text-lg dark:text-gray-400">
          {t("expired.message", "This shortened link has expired and is no longer available.")}
        </p>
        <a
          href="/"
          style={{ transition: "var(--transition-bg)" }}
          className="inline-flex touch-manipulation items-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none"
        >
          {t("expired.home", "Go Home")}
        </a>
      </div>
    </div>
  );
}

export default ExpiredPage;
