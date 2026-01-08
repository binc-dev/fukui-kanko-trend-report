import { useEffect, useState } from "react";

export type Area = {
  area_id: string;
  area_name: string;
  filename: string;
};

export const TOTAL_AREA = "total_daily_metrics.csv";

export function useAreas() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>(TOTAL_AREA);
  useEffect(() => {
    fetch("/metadata.json")
      .then((res) => res.json())
      .then((data) => setAreas(data.areas));
  }, []);

  return {
    areas,
    selectedArea,
    setSelectedArea,
  };
}
