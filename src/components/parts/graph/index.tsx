import Papa from "papaparse";
import { useEffect, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
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
import { COUNT_TREND_METRICS, REVIEW_TREND_METRICS } from "./constants";
import type { ChartMetric, DataPoint } from "./types";

export function Graph() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [countHoveredKey, setCountHoveredKey] = useState<string | null>(null);
  const [reviewHoveredKey, setReviewHoveredKey] = useState<string | null>(null);
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
        if (countHoveredKey === key) setCountHoveredKey(null);
        if (reviewHoveredKey === key) setReviewHoveredKey(null);
      }
      return updatedHiddenKeys;
    });
  };

  const getChartProps = (metric: ChartMetric, hoveredKey: string | null) => {
    const baseProps = {
      dataKey: metric.id,
      name: metric.name,
      fill: metric.color,
      fillOpacity: !hoveredKey || hoveredKey === metric.id ? 1 : 0.2,
      hide: hiddenKeys.has(metric.id),
      isAnimationActive: false,
    };

    if (metric.type === "bar") {
      return {
        ...baseProps,
      };
    }

    return {
      ...baseProps,
      stroke: metric.color,
      strokeWidth: 3,
      strokeOpacity: !hoveredKey || hoveredKey === metric.id ? 1 : 0.2,
      activeDot: {
        r: hoveredKey === metric.id ? 2 : 6,
        stroke: "#fff",
        strokeWidth: 1,
        fill: metric.color,
      },
    };
  };

  const reviewChartData = data.map((entry) => {
    const updatedEntry: Record<string, string | number | null> = { ...entry };

    REVIEW_TREND_METRICS.forEach((metric) => {
      if (metric.type === "line" && updatedEntry[metric.id] === 0) {
        updatedEntry[metric.id] = null;
      }
    });

    return updatedEntry;
  });
  return (
    <div className="w-full p-4">
      <h2 className="w-full h-10 text-xl col-span-2 mt-8 pt-2 border-t-2 border-gray-100 text-center font-bold">
        回数推移
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 12, right: 60 }}>
          <CartesianGrid strokeOpacity={0.3} />
          <XAxis dataKey="date" tick={<CustomXAxisTick />} height={60} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltipContent />} />
          <Legend
            content={
              <CustomLegendContent
                hoveredKey={countHoveredKey}
                hiddenKeys={hiddenKeys}
                onHover={setCountHoveredKey}
                onLeave={() => setCountHoveredKey(null)}
                onToggle={toggleKey}
              />
            }
          />
          {COUNT_TREND_METRICS.map((metric) => (
            <Line key={metric.id} {...getChartProps(metric, countHoveredKey)} />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <h2 className="w-full h-10 text-xl col-span-2 mt-8 pt-2 border-t-2 border-gray-100 text-center font-bold">
        レビュー推移
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={reviewChartData}
          margin={{ top: 12 }}
          barCategoryGap="20%"
        >
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
          <Tooltip content={<CustomTooltipContent />} />
          <Legend
            content={
              <CustomLegendContent
                hoveredKey={reviewHoveredKey}
                hiddenKeys={hiddenKeys}
                onHover={setReviewHoveredKey}
                onLeave={() => setReviewHoveredKey(null)}
                onToggle={toggleKey}
              />
            }
          />
          {REVIEW_TREND_METRICS.map((metric) => {
            const chartProps = getChartProps(metric, reviewHoveredKey);
            return metric.type === "bar" ? (
              <Bar key={metric.id} {...chartProps} yAxisId="left" />
            ) : (
              <Line
                key={metric.id}
                connectNulls
                {...chartProps}
                yAxisId="right"
              />
            );
          })}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
