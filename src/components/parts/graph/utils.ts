import { useChartSettings } from "@/context/ChartSettingsContext";
import type { ChartMetric, DataPoint, TimeUnit } from "@/types/types";
import * as holidayJp from "@holiday-jp/holiday_jp";
import { groupBy, mutate, sum, summarize, tidy } from "@tidyjs/tidy";
import dayjs from "dayjs";
import { DAYS } from "./constants";

export const getDateInfo = (dateStr: string) => {
  const { timeUnit } = useChartSettings();
  const date = new Date(dateStr);
  if (timeUnit === "month") {
    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    return { formattedDate, displayText: "", color: "#666" };
  }
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

export const aggregateData = (data: DataPoint[], unit: TimeUnit) => {
  if (!data || data.length === 0) return [];

  if (unit === "day" || unit === "week") {
    return data;
  }

  return tidy(
    data,
    mutate({
      date: (data) => {
        const date = dayjs(data.date);
        return date.format("YYYY-MM");
      },
    }),
    groupBy("date", [
      summarize({
        map_views: sum("map_views"),
        search_views: sum("search_views"),
        directions: sum("directions"),
        call_clicks: sum("call_clicks"),
        website_clicks: sum("website_clicks"),
      }),
    ])
  ).sort((a, b) => a.date.localeCompare(b.date));
};
