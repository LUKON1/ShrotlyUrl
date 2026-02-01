import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";
import useAxiosPrivate from "../../utils/useAxiosPrivate";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

import AnalyticsWidgets from "./AnalyticsWidgets";
import DateRangeSelector from "./DateRangeSelector";
import ExportButton from "./ExportButton";

dayjs.extend(isBetween);

const UrlAnalyticsChart = ({ urlId }) => {
  const { t } = useTranslation();
  const axiosPrivate = useAxiosPrivate();
  const [chartData, setChartData] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dateRange, setDateRange] = useState({
    range: "last7Days",
    startDate: dayjs().subtract(6, "day").format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  });

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

  const filteredData = React.useMemo(() => {
    const start = dayjs(dateRange.startDate).startOf("day");
    const end = dayjs(dateRange.endDate).endOf("day");
    const filledData = [];
    let current = start;

    while (current.isBefore(end) || current.isSame(end, "day")) {
      const dateStr = current.format("YYYY-MM-DD");
      const existingItem = chartData?.find((item) => item.date === dateStr);

      if (existingItem) {
        filledData.push(existingItem);
      } else {
        filledData.push({ date: dateStr, clicks: 0 });
      }
      current = current.add(1, "day");
    }

    return filledData;
  }, [chartData, dateRange]);

  const handleRangeChange = React.useCallback((newRange) => {
    setDateRange(newRange);
  }, []);

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
    <div className="w-full">
      <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {t("myurls.analytics")}
          </h3>
          <DateRangeSelector onChange={handleRangeChange} initialRange="last7Days" />
        </div>
        <ExportButton
          data={filteredData}
          filename={`url_analytics_${urlId}.csv`}
          headers={["Date", "Clicks"]}
        />
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer
          width="100%"
          height={280}
          minWidth={200}
          aspect={undefined}
          key={urlId}
        >
          <AreaChart
            data={filteredData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 30,
            }}
          >
            <defs>
              <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
            <XAxis
              dataKey="date"
              className="fill-gray-700 dark:fill-gray-300"
              tickFormatter={(value) => dayjs(value).format("DD/MM")}
            />
            <YAxis className="fill-gray-700 dark:fill-gray-300" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgb(30 41 59)",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
              }}
              labelStyle={{ color: "#e2e8f0", marginBottom: "0.25rem" }}
              itemStyle={{ color: "#818cf8" }}
              labelFormatter={(value) =>
                `${t("myurls.date")}: ${dayjs(value).format("DD/MM/YYYY")}`
              }
              formatter={(value, name) => [value, t("myurls.clicks")]}
            />
            <Area
              type="monotone"
              dataKey="clicks"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorClicks)"
              activeDot={{ r: 8 }}
              name={t("myurls.clicks")}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {analyticsData && (
        <AnalyticsWidgets
          devices={analyticsData.devices}
          browsers={analyticsData.browsers}
          countries={analyticsData.countries}
          os={analyticsData.os}
          t={t}
        />
      )}
    </div>
  );
};

export default UrlAnalyticsChart;
