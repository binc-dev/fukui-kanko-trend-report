import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { REVIEW_TREND_METRICS } from "../constants";
import type { DataPoint } from "../types";
import { getChartProps } from "../utils";
import {
  CustomLegendContent,
  CustomTooltipContent,
  CustomXAxisTick,
} from "./chart-elements";

export function ReviewTrendChart({
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
      <ComposedChart data={data} margin={{ top: 12 }} barCategoryGap="20%">
        <CartesianGrid vertical={false} strokeOpacity={0.3} yAxisId="left" />
        <XAxis dataKey="date" tick={<CustomXAxisTick />} height={60} />
        <YAxis
          yAxisId="left"
          orientation="left"
          tick={{ fontSize: 12 }}
          tickCount={5}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={[1, 5]}
          tick={{ fontSize: 12 }}
          tickCount={5}
        />
        <Tooltip
          content={
            <CustomTooltipContent chartType="review" hiddenKeys={hiddenKeys} />
          }
        />
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
        {REVIEW_TREND_METRICS.map((metric) => {
          const props = getChartProps(metric, hoveredKey, hiddenKeys);
          return metric.type === "bar" ? (
            <Bar key={metric.id} {...props} yAxisId="left" />
          ) : (
            <Line key={metric.id} {...props} connectNulls yAxisId="right" />
          );
        })}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
