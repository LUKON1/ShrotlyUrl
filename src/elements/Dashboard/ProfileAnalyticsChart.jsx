import { useState, useEffect, useMemo, useCallback } from "react";
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
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import DateRangeSelector from "./DateRangeSelector";
import ExportButton from "./ExportButton";

dayjs.extend(isBetween);

function ProfileAnalyticsChart({ data, title }) {
  const [dateRange, setDateRange] = useState({
    range: "last7Days",
    startDate: dayjs().subtract(6, "day").format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  });

  const filteredData = useMemo(() => {
    // Generate all dates in range
    const start = dayjs(dateRange.startDate).startOf("day");
    const end = dayjs(dateRange.endDate).endOf("day");
    const filledData = [];
    let current = start;

    while (current.isBefore(end) || current.isSame(end, "day")) {
      const dateStr = current.format("YYYY-MM-DD");
      const existingItem = data?.find((item) => item.date === dateStr);

      if (existingItem) {
        filledData.push(existingItem);
      } else {
        filledData.push({ date: dateStr, clicks: 0, created: 0 });
      }
      current = current.add(1, "day");
    }

    return filledData;
  }, [data, dateRange]);

  const handleRangeChange = useCallback((newRange) => {
    setDateRange(newRange);
  }, []);

  return (
    <div
      className="relative z-10 rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
      style={{ willChange: "background-color, border-color" }}
    >
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h3>
          <DateRangeSelector onChange={handleRangeChange} initialRange="last7Days" />
        </div>
        <ExportButton
          data={filteredData}
          filename="profile_analytics.csv"
          headers={["Date", "URLs Created", "Clicks"]}
        />
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={filteredData}>
          <defs>
            <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
            className="stroke-gray-200 dark:stroke-slate-700"
          />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            className="stroke-gray-500 dark:stroke-gray-400"
            tick={{ fill: "#6b7280", className: "fill-gray-500 dark:fill-gray-400" }}
            tickFormatter={(value) => dayjs(value).format("DD/MM")}
          />
          <YAxis
            stroke="#6b7280"
            className="stroke-gray-500 dark:stroke-gray-400"
            tick={{ fill: "#6b7280" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgb(30 41 59)",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            labelStyle={{ color: "#e2e8f0", marginBottom: "0.25rem" }}
            labelFormatter={(value) => dayjs(value).format("DD/MM/YYYY")}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="created"
            stroke="#0ea5e9"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCreated)"
            name="URLs Created"
            activeDot={{ r: 6 }}
          />
          <Area
            type="monotone"
            dataKey="clicks"
            stroke="#f43f5e"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorClicks)"
            name="Clicks"
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ProfileAnalyticsChart;
