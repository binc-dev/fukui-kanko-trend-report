import { Button } from "@/components/ui/button";
import { useChartSettings } from "@/context/ChartSettingsContext";
import type { DateRangeVariant } from "@/types/types";
import { DownloadIcon } from "@primer/octicons-react";
import { saveAs } from "file-saver";
import { useChartData } from "./graph/hooks/use-chart-data";

export function DownloadCSVButton({ variant }: { variant: DateRangeVariant }) {
  const { start, end, data: chartData } = useChartData(variant);
  const { area, timeUnit } = useChartSettings();

  const name =
    area === "total_daily_metrics.csv" ? "全域" : area.split("_")[2] || "不明";

  const handleDownload = () => {
    if (chartData.length === 0) return;

    const headerMap: Record<string, string> = {
      date: "日付",
      map_views: "地図検索",
      search_views: "web検索",
      directions: "ルート検索",
      call_clicks: "通話",
      website_clicks: "ウェブサイトクリック",
      review_count_change: "レビュー投稿数",
      average_rating: "平均評点",
    };

    const headers = Object.keys(headerMap)
      .map((key) => headerMap[key])
      .join(",");

    const rows = chartData.map((item) =>
      Object.keys(headerMap)
        .map((key) => `"${item[key as keyof typeof item] ?? ""}"`)
        .join(","),
    );
    const csvContent = [headers, ...rows].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const formats = {
      month: "YYYYMM",
      week: "YYYYMMDD[週]",
      day: "YYYYMMDD",
    };

    const formatStr = formats[timeUnit];
    const dateRangeStr = `${start?.format(formatStr)}-${end?.format(formatStr)}`;
    saveAs(blob, `トレンドレポート_${name}_${dateRangeStr}.csv`);
  };
  return (
    <Button
      className="h-9 px-3  text-black rounded disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
      variant="outline"
      onClick={handleDownload}
      disabled={!start || !end}
    >
      <span className="flex items-center gap-1">
        <DownloadIcon size={16} />
        <span className="hidden sm:inline">CSV</span>
      </span>
    </Button>
  );
}
