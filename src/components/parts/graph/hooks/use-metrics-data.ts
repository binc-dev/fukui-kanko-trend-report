import Papa from "papaparse";
import { useEffect, useState } from "react";
import { REVIEW_TREND_METRICS } from "../constants";
import type { DataPoint } from "../types";

export function useMetricsData(areaFilename: string) {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    fetch(`/data/${areaFilename}`)
      .then((res) => res.text())
      .then((csv) => {
        Papa.parse(csv, {
          header: true,
          dynamicTyping: true,
          complete: (results) => setData(results.data as DataPoint[]),
        });
      })
      .catch((error) => {
        console.error(
          "CSVデータの取得または解析中にエラーが発生しました:",
          error
        );
      });
  }, [areaFilename]);

  const reviewChartData = data.map((entry) => {
    const updatedEntry: Record<string, string | number | null> = { ...entry };
    REVIEW_TREND_METRICS.forEach((metric) => {
      if (metric.type === "line" && updatedEntry[metric.id] === 0) {
        updatedEntry[metric.id] = null;
      }
    });
    return updatedEntry as DataPoint;
  });

  return { data, reviewChartData };
}
