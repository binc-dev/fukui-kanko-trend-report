import * as holidayJp from "@holiday-jp/holiday_jp";
import { DAYS } from "./constants";
import type { ChartMetric } from "./types";

export const getDateInfo = (dateStr: string) => {
  const date = new Date(dateStr);
  const dayOfWeek = DAYS[date.getDay()];
  const holiday = holidayJp.between(date, date)[0];

  const displayText = holiday ? holiday.name : dayOfWeek;
  const isWeekendOrHoliday = holiday || dayOfWeek === "日";
  const isSaturday = dayOfWeek === "土";

  const color = isWeekendOrHoliday ? "red" : isSaturday ? "blue" : "#666";
  const formattedDate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  return { formattedDate, displayText, color };
};

export const getChartProps = (
  metric: ChartMetric,
  hoveredKey: string | null,
  hiddenKeys: Set<string>
) => {
  const baseProps = {
    dataKey: metric.id,
    name: metric.name,
    fill: metric.color,
    fillOpacity: !hoveredKey || hoveredKey === metric.id ? 1 : 0.2,
    hide: hiddenKeys.has(metric.id),
    isAnimationActive: false,
  };

  if (metric.type === "bar") {
    return {
      ...baseProps,
    };
  }

  return {
    ...baseProps,
    stroke: metric.color,
    strokeWidth: 3,
    strokeOpacity: !hoveredKey || hoveredKey === metric.id ? 1 : 0.2,
    activeDot: {
      r: hoveredKey === metric.id ? 2 : 6,
      stroke: "#fff",
      strokeWidth: 1,
      fill: metric.color,
    },
  };
};
