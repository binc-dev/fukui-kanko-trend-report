import type { ChartMetric, DataPoint, TimeUnit } from "@/types/types";
import * as holidayJp from "@holiday-jp/holiday_jp";
import { groupBy, mutate, sum, summarize, tidy } from "@tidyjs/tidy";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { DAYS } from "./constants";
dayjs.extend(isSameOrBefore);
dayjs.extend(isoWeek);

export const getDateInfo = (dateStr: string, timeUnit: TimeUnit) => {
  const d = dayjs(dateStr);
  const date = d.toDate();

  if (timeUnit === "month") {
    return {
      displayText: "",
      color: "#666",
    };
  }

  if (timeUnit === "week") {
    return {
      displayText: ``,
      color: "#666",
    };
  }

  const dayOfWeek = DAYS[date.getDay()];
  const holiday = holidayJp.between(date, date)[0];

  const displayText = holiday ? holiday.name : dayOfWeek;
  const isWeekendOrHoliday = holiday || dayOfWeek === "日";
  const isSaturday = dayOfWeek === "土";

  const color = isWeekendOrHoliday ? "red" : isSaturday ? "blue" : "#666";

  return { displayText, color };
};

export const getChartProps = (
  metric: ChartMetric,
  hoveredKey: string | null,
  hiddenKeys: Set<string>,
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

  if (unit === "day") {
    const sortedData = [...data].sort((a, b) => a.date.localeCompare(b.date));

    const start = dayjs(sortedData[0].date);
    const end = dayjs(sortedData[sortedData.length - 1].date);

    const filledData = [] as DataPoint[];
    let current = start;
    let dataIndex = 0;

    while (current.isSameOrBefore(end)) {
      const dateStr = current.format("YYYY-MM-DD");
      const entry = sortedData[dataIndex];

      if (entry && entry.date === dateStr) {
        filledData.push({
          ...entry,
          average_rating:
            entry.average_rating === 0 ? null : entry.average_rating,
        });
        dataIndex++;
      } else {
        filledData.push({
          date: dateStr,
          map_views: 0,
          search_views: 0,
          directions: 0,
          call_clicks: 0,
          website_clicks: 0,
          review_count_change: 0,
          average_rating: null,
          total_reviews: 0,
          location_count: 0,
        });
      }
      current = current.add(1, "day");
    }
    return filledData;
  }

  const dateFormat = unit === "month" ? "YYYY-MM" : "YYYY-MM-DD週";

  return tidy(
    data,
    mutate({
      date: (data) =>
        unit === "month"
          ? dayjs(data.date).format(dateFormat)
          : dayjs(data.date).startOf("isoWeek").format(dateFormat),
      weighted_rating: (data) =>
        (data.average_rating || 0) * (data.review_count_change || 0),
    }),
    groupBy("date", [
      summarize({
        map_views: sum("map_views"),
        search_views: sum("search_views"),
        directions: sum("directions"),
        call_clicks: sum("call_clicks"),
        website_clicks: sum("website_clicks"),
        review_count_change: sum("review_count_change"),
        weighted_rating_sum: sum("weighted_rating"),
      }),
    ]),
    mutate({
      average_rating: (data) =>
        data.review_count_change > 0
          ? Math.round(
              (data.weighted_rating_sum / data.review_count_change) * 10,
            ) / 10
          : null,
    }),
  ).sort((a, b) => a.date.localeCompare(b.date));
};
