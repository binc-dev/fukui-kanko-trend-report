import Papa from "papaparse";
import { useEffect, useState } from "react";
import type { LegendPayload } from "recharts";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type DataPoint = {
  date: string;
  map_views: number;
  search_views: number;
  directions: number;
  call_clicks: number;
  website_clicks: number;
};

export function Graph() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/total_daily_metrics.csv")
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            setData(results.data as DataPoint[]);
          },
        });
      });
  }, []);

  const handleLegendMouseEnter = (payload: LegendPayload) => {
    if (typeof payload.dataKey === "string") {
      setHoveredKey(payload.dataKey);
    }
  };

  const handleLegendMouseLeave = () => {
    setHoveredKey(null);
  };

  const getOpacity = (dataKey: string) => {
    if (!hoveredKey) return 1;
    return hoveredKey === dataKey ? 1 : 0.2;
  };
  return (
    <div className="w-full p-4">
      <h2 className="mb-4 text-2xl font-semibold text-center">回数推移</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 12, right: 42 }}>
          <CartesianGrid strokeOpacity={0.3} />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip itemSorter={(item) => -(item.value ?? 0)} />
          <Legend
            itemSorter={null}
            wrapperStyle={{ cursor: "pointer" }}
            onMouseEnter={handleLegendMouseEnter}
            onMouseLeave={handleLegendMouseLeave}
          />
          <Line
            dataKey="map_views"
            name="地図表示"
            stroke="#1F77B4"
            strokeWidth={3}
            strokeOpacity={getOpacity("map_views")}
          />
          <Line
            dataKey="directions"
            name="地図検索"
            stroke="#FF7F0E"
            strokeWidth={3}
            strokeOpacity={getOpacity("directions")}
          />
          <Line
            dataKey="search_views"
            name="ルート設定"
            stroke="#2CA02C"
            strokeWidth={3}
            strokeOpacity={getOpacity("search_views")}
          />
          <Line
            dataKey="call_clicks"
            name="通話"
            stroke="#D62728"
            strokeWidth={3}
            strokeOpacity={getOpacity("call_clicks")}
          />
          <Line
            dataKey="website_clicks"
            name="ウェブサイトクリック"
            stroke="#9467BD"
            strokeWidth={3}
            strokeOpacity={getOpacity("website_clicks")}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
