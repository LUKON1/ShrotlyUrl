import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { formatDate } from "../../utils/formatDate";
import UrlAnalyticsChart from "./UrlAnalyticsChart";
import AppLoader from "../shared/AppLoader";
import UrlCard from "../shared/UrlCard";

function Urlslist({ urls, notificationRef, getMyUrls, isLoading }) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [openAnalyticsId, setOpenAnalyticsId] = useState(null);

  const displayedUrls = useMemo(() => {
    return searchTerm
      ? urls.filter((urlItem) => urlItem.url.toLowerCase().includes(searchTerm.toLowerCase()))
      : urls;
  }, [searchTerm, urls]);

  const toggleAnalytics = (id) => {
    setOpenAnalyticsId(openAnalyticsId === id ? null : id);
  };

  return (
    <>
      <div className="flex w-full flex-col items-center">
        <>
          <div className="mx-auto mb-4 flex h-12 w-full max-w-7xl flex-row items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              placeholder={t("myurls.search")}
              className="h-full w-full rounded-lg rounded-r-none border-2 border-sky-400 bg-white px-3 text-lg text-gray-900 focus:ring-2 focus:ring-sky-500 focus:outline-none dark:border-sky-500 dark:bg-slate-700 dark:text-gray-100"
            />
            <button
              onClick={getMyUrls}
              className="h-full w-12 rounded-lg rounded-l-none border-2 border-l-0 border-sky-400 bg-sky-400 p-1 transition-colors hover:bg-sky-500 dark:border-sky-500 dark:bg-sky-500 dark:hover:bg-sky-600"
              type="button"
            >
              <svg fill="#FFFFFF" viewBox="0 0 35 31.8" className="hover:cursor-pointer">
                <use href="#reload"></use>
              </svg>
            </button>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <AppLoader />
            </div>
          ) : (
            <>
              {displayedUrls.length > 0 ? (
                <ul className="mx-auto w-full max-w-7xl">
                  {displayedUrls.map((urlItem, index) => (
                    <div key={urlItem._id}>
                      <li
                        className="animate-fadeinup mb-4"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <UrlCard
                          mode="myurls"
                          urlData={urlItem}
                          onToggleAnalytics={() => toggleAnalytics(urlItem._id)}
                          t={t}
                          notificationRef={notificationRef}
                        />
                      </li>
                      {openAnalyticsId === urlItem._id && (
                        <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-lg transition-shadow hover:shadow-xl sm:p-6 dark:border-slate-700 dark:bg-slate-800">
                          <UrlAnalyticsChart urlId={urlItem._id} />
                        </div>
                      )}
                    </div>
                  ))}
                </ul>
              ) : (
                <p className="text-xl text-rose-900 dark:text-rose-400">{t("myurls.nourls")}</p>
              )}
            </>
          )}
        </>
      </div>
    </>
  );
}
export default Urlslist;
