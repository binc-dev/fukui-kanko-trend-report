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
import {
  CustomLegendContent,
  CustomTooltipContent,
  CustomXAxisTick,
} from "./chart.components";
import { COUNT_TREND_METRICS } from "./constants";
import type { DataPoint } from "./types";

export function Graph() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set());

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

  // 凡例の項目を表示・非表示に切り替える関数
  const toggleKey = (key: string) => {
    setHiddenKeys((prev) => {
      const updatedHiddenKeys = new Set(prev);
      if (updatedHiddenKeys.has(key)) updatedHiddenKeys.delete(key);
      else {
        updatedHiddenKeys.add(key);
        // ホバー中の項目が非表示にされた場合、ホバー状態を解除
        if (hoveredKey === key) setHoveredKey(null);
      }
      return updatedHiddenKeys;
    });
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
          {COUNT_TREND_METRICS.map((metric) => (
            <Line
              key={metric.id}
              dataKey={metric.id}
              name={metric.name}
              stroke={metric.color}
              strokeWidth={3}
              strokeOpacity={!hoveredKey || hoveredKey === metric.id ? 1 : 0.2}
              hide={hiddenKeys.has(metric.id)}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
