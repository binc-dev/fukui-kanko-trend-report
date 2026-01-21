import { useChartSettings } from "@/context/ChartSettingsContext";
import type { DateRangeVariant } from "@/types/types";
import dayjs from "dayjs";
import { aggregateData } from "../utils";
import { useMetricsData } from "./use-metrics-data";

export function useChartData(variant: DateRangeVariant) {
  const { area, timeUnit, dateRange, comparisonRange } = useChartSettings();
  const { data } = useMetricsData(area);

  const currentRange = variant === "primary" ? dateRange : comparisonRange;

  if (!data || !currentRange?.from || !currentRange?.to) {
    return { start: null, end: null, data: [] };
  }

  const start = dayjs(currentRange.from).startOf("day");
  const end = dayjs(currentRange.to).endOf("day");

  const filteredData = data.filter((item) => {
    const itemDate = dayjs(item.date);
    return (
      (itemDate.isAfter(start) || itemDate.isSame(start)) &&
      (itemDate.isBefore(end) || itemDate.isSame(end))
    );
  });

  return { start, end, data: aggregateData(filteredData, timeUnit) };
}
