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
import { COUNT_TREND_METRICS } from "../constants";
import type { DataPoint } from "../types";
import { getChartProps } from "../utils";
import {
  CustomLegendContent,
  CustomTooltipContent,
  CustomXAxisTick,
} from "./chart-elements";

export function CountTrendChart({
  data,
  hoveredKey,
  hiddenKeys,
  onHover,
  onToggle,
}: {
  data: DataPoint[];
  hoveredKey: string | null;
  hiddenKeys: Set<string>;
  onHover: (key: string | null) => void;
  onToggle: (key: string) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 12, right: 60 }}>
        <CartesianGrid strokeOpacity={0.3} />
        <XAxis dataKey="date" tick={<CustomXAxisTick />} height={60} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltipContent chartType="count" />} />
        <Legend
          content={
            <CustomLegendContent
              hoveredKey={hoveredKey}
              hiddenKeys={hiddenKeys}
              onHover={onHover}
              onLeave={() => onHover(null)}
              onToggle={onToggle}
            />
          }
        />
        {COUNT_TREND_METRICS.map((metric) => (
          <Line
            key={metric.id}
            {...getChartProps(metric, hoveredKey, hiddenKeys)}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
