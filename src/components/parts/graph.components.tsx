import Papa from "papaparse";
import { useEffect, useState } from "react";
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

type LegendPayloadItem = {
  dataKey: string;
  color: string;
  value: string;
};

type CustomLegendContentProps = {
  payload?: LegendPayloadItem[];
  hoveredKey: string | null;
  onHover: (key: string) => void;
  onLeave: () => void;
};

const CustomLegendContent = ({
  payload,
  hoveredKey,
  onHover,
  onLeave,
}: CustomLegendContentProps) => {
  const desiredOrder = [
    "map_views",
    "search_views",
    "directions",
    "call_clicks",
    "website_clicks",
  ];

  const sortedPayload = payload?.slice().sort((a, b) => {
    const indexA = desiredOrder.indexOf(a.dataKey);
    const indexB = desiredOrder.indexOf(b.dataKey);
    return indexA - indexB;
  });
  return (
    <ul className="flex flex-wrap justify-center gap-4 list-none m-0 p-0">
      {sortedPayload?.map((entry, index) => {
        const { dataKey, color, value } = entry;
        const isActive = !hoveredKey || hoveredKey === dataKey;
        const opacity = isActive ? 1 : 0.2;

        return (
          <li
            key={`item-${index}`}
            className="flex items-center gap-2 cursor-pointer transition-opacity duration-200 ease-in-out"
            style={{ opacity }}
            onMouseEnter={() => onHover(String(dataKey))}
            onMouseLeave={() => onLeave()}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm">{value}</span>
          </li>
        );
      })}
    </ul>
  );
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
            content={
              <CustomLegendContent
                hoveredKey={hoveredKey}
                onHover={setHoveredKey}
                onLeave={() => setHoveredKey(null)}
              />
            }
          />
          <Line
            isAnimationActive={false}
            dataKey="map_views"
            name="地図表示"
            stroke="#1F77B4"
            strokeWidth={3}
            strokeOpacity={getOpacity("map_views")}
          />
          <Line
            isAnimationActive={false}
            dataKey="search_views"
            name="地図検索"
            stroke="#FF7F0E"
            strokeWidth={3}
            strokeOpacity={getOpacity("search_views")}
          />
          <Line
            isAnimationActive={false}
            dataKey="directions"
            name="ルート設定"
            stroke="#2CA02C"
            strokeWidth={3}
            strokeOpacity={getOpacity("directions")}
          />
          <Line
            isAnimationActive={false}
            dataKey="call_clicks"
            name="通話"
            stroke="#D62728"
            strokeWidth={3}
            strokeOpacity={getOpacity("call_clicks")}
          />
          <Line
            isAnimationActive={false}
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
