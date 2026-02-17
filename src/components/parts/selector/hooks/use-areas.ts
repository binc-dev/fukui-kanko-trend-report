import { useChartSettings } from "@/context/ChartSettingsContext";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export type AreaMetadata = {
  area_id: string;
  area_name: string;
  files: Record<number, string>;
};

type MetadataAreaItem = {
  area_id: string;
  area_name: string;
  filename: string;
};

export const TOTAL_AREA = "total";
const TOTAL_FILENAME = "total_daily_metrics.csv";

export function useAreas() {
  const [areas, setAreas] = useState<AreaMetadata[]>([]);
  const { dateRange, comparisonRange, selectedAreaId, setAreaFilenames } =
    useChartSettings();

  const targetYears = (() => {
    const years = new Set<number>();

    [dateRange, comparisonRange].forEach((range) => {
      if (range?.from && range?.to) {
        const start = dayjs(range.from).year();
        const end = dayjs(range.to).year();
        for (let year = start; year <= end; year++) years.add(year);
      }
    });

    return Array.from(years).sort((a, b) => a - b);
  })();

  useEffect(() => {
    if (targetYears.length === 0) return;

    const fetchMetadata = async () => {
      try {
        const yearEntries = await Promise.all(
          targetYears.map(async (year) => {
            const res = await fetch(
              `${import.meta.env.BASE_URL}data/${year}/metadata.json`,
            );
            if (!res.ok) return { year, areas: [] };
            const data = await res.json();
            return { year, areas: data.areas };
          }),
        );

        const areaMap = new Map<string, AreaMetadata>();
        yearEntries.forEach(({ year, areas }) => {
          areas.forEach((area: MetadataAreaItem) => {
            if (!areaMap.has(area.area_id)) {
              areaMap.set(area.area_id, {
                area_id: area.area_id,
                area_name: area.area_name,
                files: {},
              });
            }
            areaMap.get(area.area_id)!.files[year] = area.filename;
          });
        });

        setAreas(Array.from(areaMap.values()));
      } catch (error) {
        console.error("Metadata fetch error:", error);
      }
    };

    fetchMetadata();
  }, [targetYears.join(",")]);

  useEffect(() => {
    const newFilenames: Record<number, string> = {};

    if (selectedAreaId === TOTAL_AREA) {
      targetYears.forEach((year) => {
        newFilenames[year] = `${year}/${TOTAL_FILENAME}`;
      });
    } else {
      // 特定のエリアが選択されている場合
      const currentArea = areas.find((a) => a.area_id === selectedAreaId);
      if (currentArea) {
        targetYears.forEach((year) => {
          // その年にデータがない場合は全域ファイルでフォールバック（または空）
          newFilenames[year] =
            currentArea.files[year] || `${year}/${TOTAL_FILENAME}`;
        });
      }
    }

    // 算出したファイル名リストをContextに保存
    if (Object.keys(newFilenames).length > 0) {
      setAreaFilenames(newFilenames);
    }
  }, [selectedAreaId, areas, targetYears.join(",")]);

  return { areas };
}
