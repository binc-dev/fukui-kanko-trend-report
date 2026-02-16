import { useChartSettings } from "@/context/ChartSettingsContext";
import type { DataPoint } from "@/types/types";
import Papa from "papaparse";
import { useEffect, useState } from "react";

export function useMetricsData() {
  const [data, setData] = useState<DataPoint[]>([]);
  const { areaFilenames } = useChartSettings();

  useEffect(() => {
    const years = Object.keys(areaFilenames);
    if (years.length === 0) return;

    const fetchData = async () => {
      try {
        // 全年度のフェッチとパースを並列実行
        const promises = Object.entries(areaFilenames).map(
          async ([year, filename]) => {
            const url = `${import.meta.env.BASE_URL}data/${filename}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Fetch failed for ${year}`);

            const csvText = await res.text();

            // Papa.parse を Promise 化して処理
            return new Promise<DataPoint[]>((resolve) => {
              Papa.parse(csvText, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: (results) => resolve(results.data as DataPoint[]),
              });
            });
          },
        );

        const allResults = await Promise.all(promises);

        // データを結合
        const mergedData = allResults.flat();

        setData(mergedData);
      } catch (error) {
        console.error("データの取得または解析中にエラーが発生しました:", error);
      }
    };

    fetchData();
  }, [areaFilenames]);

  return { data };
}
