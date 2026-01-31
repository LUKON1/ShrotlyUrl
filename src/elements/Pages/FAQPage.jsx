import { useRef } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

const FAQPage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[30vh] w-full flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="motion-safe flex max-w-2xl flex-col items-center gap-6 text-center lg:-mt-40"
      >
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 dark:border-slate-700 dark:bg-slate-800/50">
          <h1 className="mb-4 text-4xl font-extrabold text-slate-800 dark:text-slate-100">
            {t("faq.title", "FAQ")}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {t("faq.description", "Frequently Asked Questions will be here soon.")}
          </p>
          <div className="mt-8">
            <span className="inline-flex animate-pulse items-center rounded-full bg-sky-100 px-4 py-1.5 text-sm font-medium text-sky-800 dark:bg-sky-900/30 dark:text-sky-300">
              🚧 Under Construction
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FAQPage;
