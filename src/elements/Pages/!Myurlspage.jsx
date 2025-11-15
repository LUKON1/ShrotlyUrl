import { useEffect, useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import useAxiosPrivate from "../../utils/useAxiosPrivate";
import useRefreshToken from "../../utils/useRefreshToken";
import Urlslist from "../Dashboard/myurlslist";
import Notifications from "../shared/messagewindow";
import UserProfile from "../Dashboard/UserProfile";
import StatsCard from "../Dashboard/StatsCard";
import ProfileAnalyticsChart from "../Dashboard/ProfileAnalyticsChart";
import TopUrlsList from "../Dashboard/TopUrlsList";
import H1 from ".././shared/h1";
import AppLoader from "../shared/AppLoader";

function Myurlspage() {
  const API_MYURLS = "/myurls/geturls";
  const API_ANALYTICS = "/myurls/analytics";
  const API_PROFILE = "/myurls/profile";
  const { t } = useTranslation();
  const axiosPrivate = useAxiosPrivate();
  const refresh = useRefreshToken();
  const [urls, setUrls] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const notificationRef = useRef();

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      await refresh();
      const results = await Promise.allSettled([
        axiosPrivate.get(API_MYURLS),
        axiosPrivate.get(API_PROFILE),
        axiosPrivate.get(API_ANALYTICS),
      ]);
      const [urlsRes, profileRes, analyticsRes] = results;
      if (urlsRes.status === "fulfilled") {
        setUrls(urlsRes.value.data);
      }
      if (profileRes.status === "fulfilled") {
        setProfile(profileRes.value.data);
      }
      if (analyticsRes.status === "fulfilled") {
        setAnalytics(analyticsRes.value.data);
      }
      if (results.some((result) => result.status === "rejected")) {
        notificationRef.current?.addNotification(t("dashboard.loaderr"), 3000);
      }
    } catch (err) {
      console.error("Failed to refresh token or other error:", err);
      notificationRef.current?.addNotification(t("dashboard.loaderr"), 3000);
    } finally {
      setIsLoading(false);
    }
  }, [axiosPrivate, refresh, API_PROFILE, API_MYURLS, API_ANALYTICS, t]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const getMyUrls = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axiosPrivate.get(API_MYURLS);
      setUrls(response.data);
    } catch (err) {
      console.error("Failed to fetch user URLs:", err);
      notificationRef.current?.addNotification(t("myurls.loaderr"), 3000);
    } finally {
      setIsLoading(false);
    }
  }, [axiosPrivate, API_MYURLS]);

  return (
    <div className="flex w-full flex-col items-center px-4 pb-20">
      <Notifications ref={notificationRef} />

      <div className="w-full max-w-7xl">
        <div className="mb-8">
          <H1>{t("dashboard.title")}</H1>
        </div>

        <div className="mb-6 flex flex-row justify-between border-b border-gray-200 dark:border-slate-700">
          <nav className="flex gap-4">
            <button
              onClick={() => setActiveTab("overview")}
              className={`border-b-2 px-4 py-3 text-sm font-semibold transition-colors md:text-base ${
                activeTab === "overview"
                  ? "border-sky-500 text-sky-600 dark:text-sky-400"
                  : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {t("dashboard.overview")}
            </button>
            <button
              onClick={() => setActiveTab("urls")}
              className={`border-b-2 px-4 py-3 text-sm font-semibold transition-colors md:text-base ${
                activeTab === "urls"
                  ? "border-sky-500 text-sky-600 dark:text-sky-400"
                  : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {t("dashboard.myUrls")}
            </button>
          </nav>
          <p className="hidden items-center text-gray-600 md:flex dark:text-gray-400">
            {t("dashboard.subtitle")}
          </p>
        </div>

        {activeTab === "overview" &&
          (isLoading ? (
            <div className="flex items-center justify-center">
              <AppLoader />
            </div>
          ) : (
            <div className="space-y-6">
              <UserProfile profile={profile} />
              {analytics && (
                <>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                      title={t("dashboard.totalUrls")}
                      value={analytics.totalUrls}
                      icon={
                        <svg fill="currentColor" viewBox="0 0 24 24" className="h-8 w-8">
                          <path d="M10,17.55,8.23,19.27a2.47,2.47,0,0,1-3.5-3.5l4.54-4.55a2.46,2.46,0,0,1,3.39-.09l.12.1a1,1,0,0,0,1.4-1.43A2.75,2.75,0,0,0,14,9.59a4.46,4.46,0,0,0-6.09.22L3.31,14.36a4.48,4.48,0,0,0,6.33,6.33L11.37,19A1,1,0,0,0,10,17.55ZM20.69,3.31a4.49,4.49,0,0,0-6.33,0L12.63,5A1,1,0,0,0,14,6.45l1.73-1.72a2.47,2.47,0,0,1,3.5,3.5l-4.54,4.55a2.46,2.46,0,0,1-3.39.09l-.12-.1a1,1,0,0,0-1.4,1.43,2.75,2.75,0,0,0,.23.21,4.47,4.47,0,0,0,6.09-.22l4.55-4.55A4.49,4.49,0,0,0,20.69,3.31Z" />
                        </svg>
                      }
                    />
                    <StatsCard
                      title={t("dashboard.totalClicks")}
                      value={analytics.totalClicks}
                      icon={
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      }
                      subtitle={`${analytics.clicksLast7Days} ${t("dashboard.last7Days")}`}
                    />
                    <StatsCard
                      title={t("dashboard.activeUrls")}
                      value={analytics.activeUrls}
                      icon={
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      }
                    />
                    <StatsCard
                      title={t("dashboard.expiredUrls")}
                      value={analytics.expiredUrls}
                      icon={
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      }
                    />
                  </div>

                  <ProfileAnalyticsChart
                    data={analytics.chartData}
                    title={t("dashboard.activityChart")}
                  />

                  <TopUrlsList topUrls={analytics.topUrls} />
                </>
              )}
            </div>
          ))}

        {activeTab === "urls" && (
          <Urlslist
            urls={urls}
            getMyUrls={getMyUrls}
            notificationRef={notificationRef}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}

export default Myurlspage;
