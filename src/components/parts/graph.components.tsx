import * as holidayJP from "@holiday-jp/holiday_jp";
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

type TooltipPayloadItem = {
  payload: DataPoint;
  name: string;
  value: number;
  color: string;
  dataKey: string;
};

type CustomLegendContentProps = {
  payload?: LegendPayloadItem[];
  hoveredKey: string | null;
  hiddenKeys: Set<string>;
  onHover: (key: string) => void;
  onLeave: () => void;
  onToggle: (key: string) => void;
};

type CustomXAxisTickProps = {
  x?: number;
  y?: number;
  payload?: {
    value: string;
  };
};

type CustomTooltipContentProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
};

const CustomLegendContent = ({
  payload,
  hoveredKey,
  hiddenKeys,
  onHover,
  onLeave,
  onToggle,
}: CustomLegendContentProps) => {
  const desiredOrder = [
    "map_views",
    "search_views",
    "directions",
    "call_clicks",
    "website_clicks",
  ];

  // payloadをdesiredOrderの順序でソート
  const sortedPayload = payload?.slice().sort((a, b) => {
    const indexA = desiredOrder.indexOf(a.dataKey);
    const indexB = desiredOrder.indexOf(b.dataKey);
    return indexA - indexB;
  });

  return (
    <ul className="flex flex-wrap justify-center gap-4 list-none m-0 p-0">
      {sortedPayload?.map((entry, index) => {
        const { dataKey, color, value } = entry;
        const isHidden = hiddenKeys.has(dataKey);
        const isHovered = hoveredKey === dataKey;

        let opacity = isHidden ? 0.2 : 1;
        if (hoveredKey && !isHovered && !isHidden) {
          opacity = 0.2;
        }

        return (
          <li
            key={`item-${index}`}
            className="flex items-center gap-2 cursor-pointer transition-opacity duration-200 ease-in-out"
            style={{ opacity }}
            onMouseEnter={() => !isHidden && onHover(String(dataKey))}
            onMouseLeave={() => onLeave()}
            onClick={() => {
              const wasHidden = hiddenKeys.has(dataKey);
              onToggle(String(dataKey));
              // 再表示時にホバーしていた場合はホバー状態にする
              if (wasHidden) {
                onHover(String(dataKey));
              }
            }}
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

const CustomXAxisTick = ({ x, y, payload }: CustomXAxisTickProps) => {
  if (!payload?.value) {
    return null;
  }

  const date = new Date(payload.value);
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  const dayOfWeek = days[date.getDay()];

  const holiday = holidayJP.between(date, date)[0];
  const displayText = holiday ? holiday.name : dayOfWeek;
  const textColor =
    holiday || dayOfWeek === "日"
      ? "red"
      : dayOfWeek === "土"
      ? "blue"
      : "#666";

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize={12}>
        {`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`}
      </text>
      <text
        x={0}
        y={0}
        dy={32}
        textAnchor="middle"
        fill={textColor}
        fontSize={10}
      >
        {`${displayText}`}
      </text>
    </g>
  );
};

const CustomTooltipContent = ({
  active,
  payload,
}: CustomTooltipContentProps) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const date = new Date(payload[0].payload.date);
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  const dayOfWeek = days[date.getDay()];

  const holiday = holidayJP.between(date, date)[0];
  const displayText = holiday ? holiday.name : dayOfWeek;
  const textColor =
    holiday || dayOfWeek === "日"
      ? "red"
      : dayOfWeek === "土"
      ? "blue"
      : "#666";

  return (
    <div className="grid min-w-32 items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      <div className="flex">
        <span>
          {`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`}
        </span>
        <span style={{ color: textColor }} className="ml-2">
          {displayText}
        </span>
      </div>

      <div className="grid gap-1.5">
        {payload
          .sort((a, b) => b.value - a.value)
          .map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-muted-foreground">{`${item.name}:`}</span>
              </div>
              <span className="font-mono font-medium tabular-nums text-foreground">
                {item.value.toLocaleString()}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export function Graph() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set());

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

  // 凡例の項目を表示・非表示に切り替える関数
  const toggleKey = (key: string) => {
    setHiddenKeys((prev) => {
      const updatedHiddenKeys = new Set(prev);
      if (updatedHiddenKeys.has(key)) {
        updatedHiddenKeys.delete(key);
      } else {
        updatedHiddenKeys.add(key);
        // ホバー中の項目が非表示にされた場合、ホバー状態を解除
        if (hoveredKey === key) {
          setHoveredKey(null);
        }
      }
      return updatedHiddenKeys;
    });
  };

  // ホバー状態に応じた不透明度を取得する関数
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
          <XAxis dataKey="date" tick={<CustomXAxisTick />} height={60} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltipContent />} />
          <Legend
            content={
              <CustomLegendContent
                hoveredKey={hoveredKey}
                hiddenKeys={hiddenKeys}
                onHover={setHoveredKey}
                onLeave={() => setHoveredKey(null)}
                onToggle={toggleKey}
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
            hide={hiddenKeys.has("map_views")}
          />
          <Line
            isAnimationActive={false}
            dataKey="search_views"
            name="地図検索"
            stroke="#FF7F0E"
            strokeWidth={3}
            strokeOpacity={getOpacity("search_views")}
            hide={hiddenKeys.has("search_views")}
          />
          <Line
            isAnimationActive={false}
            dataKey="directions"
            name="ルート設定"
            stroke="#2CA02C"
            strokeWidth={3}
            strokeOpacity={getOpacity("directions")}
            hide={hiddenKeys.has("directions")}
          />
          <Line
            isAnimationActive={false}
            dataKey="call_clicks"
            name="通話"
            stroke="#D62728"
            strokeWidth={3}
            strokeOpacity={getOpacity("call_clicks")}
            hide={hiddenKeys.has("call_clicks")}
          />
          <Line
            isAnimationActive={false}
            dataKey="website_clicks"
            name="ウェブサイトクリック"
            stroke="#9467BD"
            strokeWidth={3}
            strokeOpacity={getOpacity("website_clicks")}
            hide={hiddenKeys.has("website_clicks")}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
