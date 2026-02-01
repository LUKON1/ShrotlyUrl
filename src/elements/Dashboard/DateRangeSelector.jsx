import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

const ranges = [
  { label: "last7Days", days: 7 },
  { label: "last30Days", days: 30 },
  { label: "last90Days", days: 90 },
  { label: "lastYear", days: 365 },
  { label: "custom", days: -1 },
];

const DateRangeSelector = ({ onChange, initialRange = "last7Days" }) => {
  const { t } = useTranslation();
  const [selectedRange, setSelectedRange] = useState(initialRange);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  // Calculate dates helper
  const calculateDates = (days) => {
    const end = dayjs();
    const start = dayjs().subtract(days - 1, "day");
    return {
      startDate: start.format("YYYY-MM-DD"),
      endDate: end.format("YYYY-MM-DD"),
    };
  };

  // Trigger initial onChange on component mount
  useEffect(() => {
    const initialRangeObj = ranges.find((r) => r.label === initialRange);
    if (initialRangeObj && initialRangeObj.days !== -1) {
      const dates = calculateDates(initialRangeObj.days);
      onChange({
        range: initialRangeObj.label,
        ...dates,
      });
    }
  }, [initialRange, onChange]);

  const handleRangeChange = (range) => {
    setSelectedRange(range.label);

    if (range.days !== -1) {
      const dates = calculateDates(range.days);
      onChange({
        range: range.label,
        ...dates,
      });
    }
  };

  const handleCustomApply = () => {
    if (customStart && customEnd) {
      const start = dayjs(customStart);
      const end = dayjs(customEnd);
      const today = dayjs();
      const oneYearAgo = today.subtract(365, "day");

      // Validation: Start date cannot be more than 1 year in the past
      if (start.isBefore(oneYearAgo)) {
        alert(
          t("analytics.customRangeError") || "Start date cannot be more than 1 year in the past"
        );
        return;
      }

      // Validation: End date cannot be in the future
      if (end.isAfter(today)) {
        alert(t("analytics.customRangeFutureError") || "End date cannot be in the future");
        return;
      }

      // Validation: Start must be before or equal to end
      if (start.isAfter(end)) {
        alert(t("analytics.customRangeInvalidError") || "Start date must be before end date");
        return;
      }

      onChange({
        range: "custom",
        startDate: customStart,
        endDate: customEnd,
      });
    }
  };

  // Calculate min and max dates for custom inputs
  const today = dayjs().format("YYYY-MM-DD");
  const oneYearAgo = dayjs().subtract(365, "day").format("YYYY-MM-DD");

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600">
            {t(`analytics.ranges.${selectedRange}`) || selectedRange}
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="ring-opacity-5 absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black focus:outline-none dark:bg-slate-700">
            <div className="py-1">
              {ranges.map((range) => (
                <Menu.Item key={range.label}>
                  {({ active }) => (
                    <button
                      onClick={() => handleRangeChange(range)}
                      className={`${
                        active
                          ? "bg-gray-100 text-gray-900 dark:bg-slate-600 dark:text-white"
                          : "text-gray-700 dark:text-gray-200"
                      } block w-full px-4 py-2 text-left text-sm`}
                    >
                      {t(`analytics.ranges.${range.label}`) || range.label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      {selectedRange === "custom" && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            min={oneYearAgo}
            max={today}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-gray-200"
          />
          <span className="text-gray-500 dark:text-gray-400">-</span>
          <input
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            min={customStart || oneYearAgo}
            max={today}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-gray-200"
          />
          <button
            onClick={handleCustomApply}
            className="rounded-lg bg-sky-500 px-3 py-2 text-sm font-medium text-white hover:bg-sky-600 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none dark:bg-sky-600 dark:hover:bg-sky-700"
          >
            {t("common.apply") || "Apply"}
          </button>
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;
