import { Button } from "@/components/ui/button";
import { useChartSettings } from "@/context/ChartSettingsContext";
import type { DateRangeVariant } from "@/types/types";
import { DownloadIcon } from "@primer/octicons-react";
import { saveAs } from "file-saver";
import { useChartData } from "./graph/hooks/use-chart-data";

export function DownloadCSVButton({ variant }: { variant: DateRangeVariant }) {
  const { start, end, data: chartData } = useChartData(variant);
  const { area } = useChartSettings();

  const handleDownload = () => {
    if (chartData.length === 0) return;
    const headers = Object.keys(chartData[0]).join(",");
    const rows = chartData.map((item) =>
      Object.values(item)
        .map((value) => `"${value}"`)
        .join(","),
    );

    const csvContent = [headers, ...rows].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, `data_${area}_${variant}.csv`);
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
