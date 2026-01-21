import { useChartSettings } from "@/context/ChartSettingsContext";
import type { DateRangeVariant } from "@/types/types";
import dayjs from "dayjs";
import minMax from "dayjs/plugin/minMax";
import { useEffect, useState } from "react";
import { CountTrendChart } from "./charts/count-trend-chart";
import { ReviewTrendChart } from "./charts/review-trend-chart";
import { useChartData } from "./hooks/use-chart-data";
import { useMetricsData } from "./hooks/use-metrics-data";
dayjs.extend(minMax);

export function Graph({ variant }: { variant: DateRangeVariant }) {
  const { area, setAvailableRange } = useChartSettings();
  const { data } = useMetricsData(area);

  const { start, end, data: chartData } = useChartData(variant);

  useEffect(() => {
    if (!data?.length) return;

    const minDate = dayjs.min(data.map((d) => dayjs(d.date)));
    if (minDate) {
      setAvailableRange((prev) => ({ ...prev, min: minDate.toDate() }));
    }
  }, [data, setAvailableRange]);

  const [countHoveredKey, setCountHoveredKey] = useState<string | null>(null);
  const [reviewHoveredKey, setReviewHoveredKey] = useState<string | null>(null);
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set());

  if (!data || !start || !end) {
    return (
      <div className="w-full flex items-center justify-center h-64 text-gray-500">
        <p className="text-lg">表示したい期間を設定してください。</p>
      </div>
    );
  }

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
    <div className="w-full flex flex-col gap-4">
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

      <h2 className="w-full h-10 text-xl col-span-2 mt-6 pt-2 border-t-2 border-gray-100 text-center font-bold">
        レビュー推移
      </h2>
      <ReviewTrendChart
        data={chartData}
        hoveredKey={reviewHoveredKey}
        hiddenKeys={hiddenKeys}
        onHover={setReviewHoveredKey}
        onToggle={toggleKey}
      />
    </div>
  );
}
