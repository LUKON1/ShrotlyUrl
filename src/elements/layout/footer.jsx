import { useTranslation } from "react-i18next";
import { useLocation, Link } from "react-router-dom";

function Footer() {
  const location = useLocation();
  const { t } = useTranslation();
  return (
    <footer className="relative mt-20 bg-slate-900 dark:bg-slate-800">
      <button
        className="touch-manipulation absolute -top-5 left-1/2 z-10 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg transition-all duration-200 hover:-translate-y-4 hover:scale-110 hover:bg-rose-600 dark:bg-slate-700 dark:hover:bg-slate-600"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        title={t("myurls.topTitle")}
        aria-label={t("myurls.topTitle")}
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>

      {/* Main footer content */}
      <div className="bg-slate-900 py-12 dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Company Info */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {t("footer.companyName", "ShortlyURL")}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {t("footer.companyDesc", "Shorten your URLs and track analytics with our modern URL shortener service.")}
              </p>
            </div>

            {/* Information */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                {t("footer.information", "Information")}
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-slate-300 hover:text-white transition-colors">
                    {t("footer.home", "Home")}
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-slate-300 hover:text-white transition-colors">
                    {t("footer.about", "About us")}
                  </Link>
                </li>
                <li>
                  <a href="mailto:support@shortlyurl.com" className="text-slate-300 hover:text-white transition-colors">
                    {t("footer.contact", "Contact us")}
                  </a>
                </li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                {t("footer.community", "Community")}
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-slate-300 hover:text-white transition-colors">
                    {t("footer.faq", "FAQ")}
                  </a>
                </li>
                <li>
                  <Link to="/signin" className="text-slate-300 hover:text-white transition-colors">
                    {t("footer.login", "Login")}
                  </Link>
                </li>
                <li>
                  <Link to="/registration" className="text-slate-300 hover:text-white transition-colors">
                    {t("footer.signup", "Sign Up")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright & Credits */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                {t("footer.legal", "Legal")}
              </h4>
              <div className="text-slate-400 text-sm space-y-2">
                <p>{t("footer.copyright", "© ShortlyURL. All rights reserved.")}</p>
                <p>{t("footer.license", "MIT License")}</p>
                <p>
                  {t("footer.poweredBy", "Created by")}{" "}
                  <a
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                    href="https://github.com/LUKON1"
                  >
                    LUKON
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
