import type { TimeUnit } from "@/types/types";
import { useState } from "react";
import { CountTrendChart } from "./charts/count-trend-chart";
import { ReviewTrendChart } from "./charts/review-trend-chart";
import { useMetricsData } from "./hooks/use-metrics-data";
import { aggregateData } from "./utils";

export function Graph({
  selectedArea,
  selectedTimeUnit,
}: {
  selectedArea: string;
  selectedTimeUnit: TimeUnit;
}) {
  const { data, reviewChartData } = useMetricsData(selectedArea);
  const [countHoveredKey, setCountHoveredKey] = useState<string | null>(null);
  const [reviewHoveredKey, setReviewHoveredKey] = useState<string | null>(null);
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set());

  const chartData = aggregateData(data, selectedTimeUnit);
  console.log("Aggregated Chart Data:", chartData);

  // 凡例の項目を表示・非表示に切り替える関数
  const toggleKey = (key: string) => {
    setHiddenKeys((prev) => {
      const updatedHiddenKeys = new Set(prev);
      if (updatedHiddenKeys.has(key)) {
        updatedHiddenKeys.delete(key);
      } else {
        updatedHiddenKeys.add(key);
        // ホバー中の項目が非表示にされた場合、ホバー状態を解除
        if (countHoveredKey === key) setCountHoveredKey(null);
        if (reviewHoveredKey === key) setReviewHoveredKey(null);
      }
      return updatedHiddenKeys;
    });
  };

  return (
    <div className="w-full flex flex-col gap-12">
      <h2 className="w-full h-10 text-xl col-span-2 mt-8 pt-2 border-t-2 border-gray-100 text-center font-bold">
        回数推移
      </h2>
      <CountTrendChart
        data={chartData}
        hoveredKey={countHoveredKey}
        hiddenKeys={hiddenKeys}
        onHover={setCountHoveredKey}
        onToggle={toggleKey}
      />

      <h2 className="w-full h-10 text-xl col-span-2 mt-8 pt-2 border-t-2 border-gray-100 text-center font-bold">
        レビュー推移
      </h2>
      <ReviewTrendChart
        data={reviewChartData}
        hoveredKey={reviewHoveredKey}
        hiddenKeys={hiddenKeys}
        onHover={setReviewHoveredKey}
        onToggle={toggleKey}
      />
    </div>
  );
}
