import React from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { formatDate } from "../../utils/formatDate";

function UrlCard({
  urlData,
  mode,
  onCopy,
  onShare,
  onDownloadQR,
  onToggleAnalytics,
  onToggleActive,
  t,
  notificationRef,
}) {
  return (
    <div className="mb-8 rounded-lg border border-gray-200 bg-white p-4 shadow-lg transition-shadow hover:shadow-xl sm:p-6 dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex max-w-[64%] flex-col">
          <div className="flex flex-row items-center gap-4">
            <p className="text-base font-bold text-sky-400 transition-colors select-all hover:text-sky-600 sm:text-lg md:text-xl dark:text-sky-500 dark:hover:text-sky-300">
              {`${import.meta.env.VITE_BASE_URL}/${urlData.shortCode}`}
            </p>
            {mode === "share" && (
              <button
                onClick={() => (window.location.href = urlData.url)}
                className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-xl border border-green-600 bg-green-500 p-1 hover:bg-green-600 sm:h-5 sm:w-5 md:h-6 md:w-6 dark:bg-green-700 dark:hover:bg-green-600"
                title={t("shared.visitSite")}
              >
                <svg fill="#FFFFFF" viewBox="0 0 15 15">
                  <use href="#arrow"></use>
                </svg>
              </button>
            )}
          </div>
          <p className="mt-1 truncate text-sm text-gray-600 sm:text-base md:text-lg dark:text-gray-400">
            {urlData.url}
          </p>
        </div>
        <div className="flex flex-row-reverse items-center gap-1.5">
          {mode === "myurls" && (
            <>
              {/* Share Button */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${import.meta.env.VITE_BASE_URL}/share/${urlData.shortCode}`
                  );
                  notificationRef.current?.addNotification(t("shared.shareLinkCopied"), 2000);
                }}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-xl border border-sky-500 bg-sky-400 hover:bg-sky-500 sm:h-9 sm:w-9 md:h-12 md:w-12 dark:bg-sky-700 dark:hover:bg-sky-600"
                title={t("myurls.share")}
              >
                <svg fill="#FFFFFF" viewBox="0 0 24 24" className="p-1">
                  <use href="#share"></use>
                </svg>
              </button>
              {/* QR Button */}
              <button
                type="button"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-xl border border-sky-500 bg-sky-400 hover:bg-sky-500 sm:h-9 sm:w-9 md:h-12 md:w-12 dark:bg-sky-700 dark:hover:bg-sky-600"
                onClick={() => {
                  const urlFullDomain = new URL(urlData.url);
                  const urlMainDomain = urlFullDomain.hostname;
                  const domainParts = urlMainDomain.split(".");
                  const baseDomain = domainParts.slice(-2).join(".");
                  const link = document.createElement("a");
                  link.href = urlData.qrCodeDataUrl;
                  link.download = `${baseDomain}-QRcode.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                title={t("myurls.downloadQr")}
              >
                <svg fill="none" viewBox="0 0 24 24" className="p-1">
                  <use href="#qrcode"></use>
                </svg>
              </button>
              {/* Copy button */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${import.meta.env.VITE_BASE_URL}/${urlData.shortCode}`
                  );
                  notificationRef.current?.addNotification(t("homepage.copied"), 2000);
                }}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-xl border border-sky-500 bg-sky-400 hover:bg-sky-500 sm:h-9 sm:w-9 md:h-12 md:w-12 dark:bg-sky-700 dark:hover:bg-sky-600"
                title={t("myurls.copy")}
              >
                <svg fill="#FFFFFF" viewBox="0 0 24 24" className="p-1">
                  <use href="#clipboard"></use>
                </svg>
              </button>
              {/* chart button */}
              <button
                onClick={onToggleAnalytics}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-xl border border-sky-500 bg-sky-400 hover:bg-sky-500 sm:h-9 sm:w-9 md:h-12 md:w-12 dark:bg-sky-700 dark:hover:bg-sky-600"
                title={t("myurls.viewAnalytics")}
              >
                <svg fill="#FFFFFF" viewBox="0 0 16 16" className="p-1">
                  <use href="#chart"></use>
                </svg>
              </button>
            </>
          )}
          {mode === "share" && (
            <>
              {/* Download QR Button */}
              <button
                type="button"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-xl border border-sky-500 bg-sky-400 hover:bg-sky-500 sm:h-9 sm:w-9 md:h-12 md:w-12 dark:bg-sky-700 dark:hover:bg-sky-600"
                onClick={() => {
                  const urlFullDomain = new URL(urlData.url);
                  const urlMainDomain = urlFullDomain.hostname;
                  const domainParts = urlMainDomain.split(".");
                  const baseDomain = domainParts.slice(-2).join(".");
                  const link = document.createElement("a");
                  link.href = urlData.qrCodeDataUrl;
                  link.download = `${baseDomain}-QRcode.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                title={t("shared.downloadQR")}
              >
                <svg fill="none" viewBox="0 0 24 24" className="p-1">
                  <use href="#qrcode"></use>
                </svg>
              </button>
              {/* Copy button */}
              <button
                onClick={onCopy}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-xl border border-sky-500 bg-sky-400 hover:bg-sky-500 sm:h-9 sm:w-9 md:h-12 md:w-12 dark:bg-sky-700 dark:hover:bg-sky-600"
                title={t("shared.copy")}
              >
                <svg fill="#FFFFFF" viewBox="0 0 24 24" className="p-1">
                  <use href="#clipboard"></use>
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div
          className={`flex items-center gap-2 self-end rounded-lg border px-4 py-2 shadow-md transition-colors dark:text-white ${
            urlData.isActive === false
              ? "border-gray-600 bg-gray-500 text-white dark:border-gray-500 dark:bg-gray-600"
              : dayjs(urlData.expiredAt).isAfter(dayjs())
                ? "border-green-600 bg-green-500 text-white dark:border-green-600 dark:bg-green-700"
                : "border-red-600 bg-red-500 text-white dark:border-red-600 dark:bg-red-500"
          } `}
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            {urlData.isActive === false ? (
              <use href="#cross" />
            ) : dayjs(urlData.expiredAt).isAfter(dayjs()) ? (
              <use href="#check" />
            ) : (
              <use href="#cross" />
            )}
          </svg>
          <div>
            <p className="text-lg font-semibold sm:text-xl md:text-2xl">
              {urlData.isActive === false
                ? t("myurls.paused")
                : dayjs(urlData.expiredAt).isAfter(dayjs())
                  ? t("shared.active")
                  : t("shared.expired")}
            </p>
            <span className="text-base text-white sm:text-lg md:text-xl">
              {formatDate(urlData.createdAt)} — {formatDate(urlData.expiredAt)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end">
          {mode === "myurls" && onToggleActive && (
            <button
              onClick={onToggleActive}
              className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-xl border transition-colors sm:h-9 sm:w-9 md:h-12 md:w-12 ${
                urlData.isActive !== false
                  ? "border-red-600 bg-red-500 hover:bg-red-600 dark:border-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                  : "border-sky-500 bg-sky-400 hover:bg-sky-500 dark:border-sky-600 dark:bg-sky-700 dark:hover:bg-sky-600"
              }`}
              title={urlData.isActive !== false ? t("myurls.pause") : t("myurls.resume")}
            >
              <svg fill="#FFFFFF" viewBox="0 0 24 24" className="p-1">
                {urlData.isActive !== false ? <use href="#pause"></use> : <use href="#play"></use>}
              </svg>
            </button>
          )}
          <div
            className="flex h-7 w-auto flex-row items-center gap-1 rounded-xl border border-sky-500 bg-sky-400 px-2 sm:h-9 md:h-12 dark:bg-sky-700"
            title="Clicks"
          >
            <svg
              fill="#FFFFFF"
              className="h-7 w-7 p-1 sm:h-9 sm:w-9 md:h-12 md:w-12"
              viewBox="0 0 48 48"
            >
              <use href="#clicks"></use>
            </svg>
            <p className="text-lg font-extrabold text-white sm:text-xl md:text-2xl">
              {urlData.clicks}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UrlCard;
