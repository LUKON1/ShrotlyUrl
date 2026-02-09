import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useAxiosPrivate from "../../utils/useAxiosPrivate";

import AnalyticsDisplay from "./AnalyticsDisplay";

const UrlAnalyticsChart = ({ urlId }) => {
  const { t } = useTranslation();
  const axiosPrivate = useAxiosPrivate();
  const [chartData, setChartData] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosPrivate.get(`/myurls/analytics/${urlId}`);
        setChartData(response.data.chartData);
        setAnalyticsData(response.data);
      } catch (err) {
        setError(t("myurls.analyticsError"));
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    if (urlId) {
      fetchAnalytics();
    }
  }, [urlId, axiosPrivate, t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4 text-xl text-blue-600 dark:text-blue-400">
        {t("myurls.loadingAnalytics")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8 text-xl text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <AnalyticsDisplay chartData={chartData} analyticsData={analyticsData} urlId={urlId} t={t} />
  );
};

export default UrlAnalyticsChart;
