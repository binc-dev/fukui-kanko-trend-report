import Papa from "papaparse";
import { useEffect, useState } from "react";
import { REVIEW_TREND_METRICS } from "../constants";
import type { DataPoint } from "../types";

export function useMetricsData() {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    fetch("/data/total_daily_metrics.csv")
      .then((res) => res.text())
      .then((csv) => {
        Papa.parse(csv, {
          header: true,
          dynamicTyping: true,
          complete: (results) => setData(results.data as DataPoint[]),
        });
      });
  }, []);

  const reviewChartData = data.map((entry) => {
    const updatedEntry: Record<string, string | number | null> = { ...entry };
    REVIEW_TREND_METRICS.forEach((metric) => {
      if (metric.type === "line" && updatedEntry[metric.id] === 0) {
        updatedEntry[metric.id] = null;
      }
    });
    return updatedEntry;
  });

  return { data, reviewChartData };
}
