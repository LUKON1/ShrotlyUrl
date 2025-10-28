import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { formatDate } from "../../utils/formatDate";

function Urlslist({ urls, notificationRef, getMyUrls, isLoading }) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const displayedUrls = useMemo(() => {
    return searchTerm
      ? urls.filter((urlItem) => urlItem.url.toLowerCase().includes(searchTerm.toLowerCase()))
      : urls;
  }, [searchTerm, urls]);

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
              <img
                className="hover:cursor-pointer dark:invert"
                src="/src/assets/reload.svg"
                alt={t("myurls.refresh")}
              />
            </button>
          </div>
          {isLoading ? (
            <div className="flex grow items-center justify-center text-2xl text-rose-900 dark:text-rose-400">
              {t("myurls.loading")}
            </div>
          ) : (
            <>
              {displayedUrls.length > 0 ? (
                <ul className="mx-auto w-full max-w-7xl">
                  {displayedUrls.map((urlItem) => (
                    <li
                      key={urlItem._id}
                      className="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-lg transition-shadow hover:shadow-xl sm:p-6 dark:border-slate-700 dark:bg-slate-800"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex max-w-2/3 flex-col">
                          <p className="text-2xl font-bold text-rose-700 transition-colors select-all hover:text-rose-600 sm:text-3xl md:text-4xl dark:text-rose-400 dark:hover:text-rose-300">
                            {`${import.meta.env.VITE_BASE_URL}/${urlItem.shortCode}`}
                          </p>
                          <p className="mt-1 truncate text-base text-gray-600 sm:text-lg md:text-xl dark:text-gray-400">
                            {urlItem.url}
                          </p>
                        </div>
                        <div className="flex flex-row-reverse gap-1.5 items-center">
                          <button
                            type="button"
                            className="h-[64px] w-[45px] cursor-pointer dark:bg-slate-700 flex items-center justify-center rounded-xl border-1 border-slate-500"
                            onClick={() => {
                              const urlFullDomain = new URL(urlItem.url);
                              const urlMainDomain = urlFullDomain.hostname;
                              const domainParts = urlMainDomain.split(".");
                              const baseDomain = domainParts.slice(-2).join(".");
                              const link = document.createElement("a");
                              link.href = urlItem.qrCodeDataUrl;
                              link.download = `${baseDomain}-QRcode.png`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                          >
                            <svg
                              width="40px"
                              height="40px"
                              viewBox="0 0 24 24"
                              fill="none"
                              className="dark:invert"
                            >
                              <path
                                d="M7 12H12V17M3.01 12H3M8.01 17H8M12.01 21H12M21.01 12H21M3 17H4.5M15.5 12H17.5M3 21H8M12 2V8M17.6 21H19.4C19.9601 21 20.2401 21 20.454 20.891C20.6422 20.7951 20.7951 20.6422 20.891 20.454C21 20.2401 21 19.9601 21 19.4V17.6C21 17.0399 21 16.7599 20.891 16.546C20.7951 16.3578 20.6422 16.2049 20.454 16.109C20.2401 16 19.9601 16 19.4 16H17.6C17.0399 16 16.7599 16 16.546 16.109C16.3578 16.2049 16.2049 16.3578 16.109 16.546C16 16.7599 16 17.0399 16 17.6V19.4C16 19.9601 16 20.2401 16.109 20.454C16.2049 20.6422 16.3578 20.7951 16.546 20.891C16.7599 21 17.0399 21 17.6 21ZM17.6 8H19.4C19.9601 8 20.2401 8 20.454 7.89101C20.6422 7.79513 20.7951 7.64215 20.891 7.45399C21 7.24008 21 6.96005 21 6.4V4.6C21 4.03995 21 3.75992 20.891 3.54601C20.7951 3.35785 20.6422 3.20487 20.454 3.10899C20.2401 3 19.9601 3 19.4 3H17.6C17.0399 3 16.7599 3 16.546 3.10899C16.3578 3.20487 16.2049 3.35785 16.109 3.54601C16 3.75992 16 4.03995 16 4.6V6.4C16 6.96005 16 7.24008 16.109 7.45399C16.2049 7.64215 16.3578 7.79513 16.546 7.89101C16.7599 8 17.0399 8 17.6 8ZM4.6 8H6.4C6.96005 8 7.24008 8 7.45399 7.89101C7.64215 7.79513 7.79513 7.64215 7.89101 7.45399C8 7.24008 8 6.96005 8 6.4V4.6C8 4.03995 8 3.75992 7.89101 3.54601C7.79513 3.35785 7.64215 3.20487 7.45399 3.10899C7.24008 3 6.96005 3 6.4 3H4.6C4.03995 3 3.75992 3 3.54601 3.10899C3.35785 3.20487 3.20487 3.35785 3.10899 3.54601C3 3.75992 3 4.03995 3 4.6V6.4C3 6.96005 3 7.24008 3.10899 7.45399C3.20487 7.64215 3.35785 7.79513 3.54601 7.89101C3.75992 8 4.03995 8 4.6 8Z"
                                stroke="#000000"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(
                                `${import.meta.env.VITE_BASE_URL}/${urlItem.shortCode}`
                              );
                              notificationRef.current?.addNotification(t("homepage.copied"), 2000);
                            }}
                            className="flex h-12 items-center rounded-lg bg-rose-300 p-3 text-base font-extrabold text-white shadow-md transition-all duration-200 ease-out hover:bg-rose-400 hover:shadow-lg active:bg-rose-500 sm:h-14 sm:p-4 sm:text-lg md:h-16 md:text-xl dark:bg-rose-500 dark:text-slate-900 dark:hover:bg-rose-600 dark:active:bg-rose-700"
                          >
                            {t("myurls.copy")}
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between">
                        <div
                          className={`-mb-4 -ml-4 rounded-tr-4xl px-6 py-2 font-extrabold sm:-mb-6 sm:-ml-6 md:-ml-6 ${
                            dayjs(urlItem.expiredAt).isAfter(dayjs())
                              ? "bg-green-300 text-green-900"
                              : "bg-red-300 text-red-900"
                          } `}
                        >
                          <p className="text-lg sm:text-xl md:text-2xl">
                            {dayjs(urlItem.expiredAt).isAfter(dayjs())
                              ? t("myurls.isexpiredF")
                              : t("myurls.isexpiredT")}
                          </p>
                          <span className="text-base text-gray-600 sm:text-lg md:text-xl dark:text-gray-400">
                            {formatDate(urlItem.createdAt)} -- {formatDate(urlItem.expiredAt)}
                          </span>
                        </div>
                        <div>
                          <p className="text-lg font-extrabold text-gray-700 sm:text-xl md:text-2xl dark:text-gray-300">
                            {t("myurls.clicks")} {urlItem.clicks}
                          </p>
                        </div>
                      </div>
                    </li>
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
