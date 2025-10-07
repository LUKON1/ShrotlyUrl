import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { formatDate } from "../../utils/formatDate";

function Urlslist({ urls, notificationRef }) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const displayedUrls = useMemo(() => {
    return searchTerm
      ? urls.filter((urlItem) =>
        urlItem.url.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : urls;
  }, [searchTerm, urls]);

  return (
    <>
    <div className="flex flex-col items-center w-full">
        <>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            placeholder={t("myurls.search")}
            className="mb-4 p-3 border border-gray-300 rounded-md w-full max-w-5xl text-lg"
          />
          <ul className="w-full max-w-5xl">
            {displayedUrls.map((urlItem) => (
              
              <li
                key={urlItem._id}
                className="bg-rose-100 rounded-md shadow-md p-4 sm:p-6 mb-4 mx-2 lg:mx-0"
              >
                <div className="flex justify-between items-center">
                  <span className="select-all text-2xl sm:text-3xl md:text-4xl font-bold text-rose-800 hover:text-rose-600 transition-colors">
                    {`${import.meta.env.VITE_BASE_URL}${urlItem.shortCode}`}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${import.meta.env.VITE_BASE_URL}${urlItem.shortCode}`);
                      notificationRef.current?.addNotification(t("homepage.copied"), 2000);
                    }}
                    className="transition-all duration-200 ease-out
                       hover:bg-rose-400 active:bg-rose-500 bg-rose-300
                        shadow-md hover:shadow-lg h-12 sm:h-14 md:h-16
                        text-base sm:text-lg md:text-xl
                        p-3 sm:p-4 rounded-md text-rose-950 font-extrabold flex items-center"
                  >
                    {t("myurls.copy")}
                  </button>
                </div>
                <p className="text-base sm:text-lg md:text-xl text-gray-500 mt-1">
                  {urlItem.url}
                </p>
                <div className="flex justify-between mt-2">
                  <div
                    className={`py-2  px-6 -ml-4 -mb-4 sm:-mb-6 rounded-tr-4xl sm:-ml-6 md:-ml-6 font-extrabold ${
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
                    <span className="text-base sm:text-lg md:text-xl text-gray-500">
                      {formatDate(urlItem.createdAt)} -- {formatDate(urlItem.expiredAt)}
                    </span>
                  </div>
                  <div>
                    <p className="text-lg sm:text-xl md:text-2xl text-gray-700 font-extrabold">
                      {t("myurls.clicks")} {urlItem.clicks}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      </div>
    </>
  );
}
export default Urlslist;