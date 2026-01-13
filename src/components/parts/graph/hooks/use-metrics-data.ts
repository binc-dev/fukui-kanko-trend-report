import type { DataPoint } from "@/types/types";
import Papa from "papaparse";
import { useEffect, useState } from "react";

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

  return { data };
}
