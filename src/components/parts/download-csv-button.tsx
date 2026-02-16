import { Button } from "@/components/ui/button";
import { useChartSettings } from "@/context/ChartSettingsContext";
import type { DateRangeVariant } from "@/types/types";
import { generateCSVContent, generateCSVFileName } from "@/utils/csv-export";
import { DownloadIcon } from "@primer/octicons-react";
import { saveAs } from "file-saver";
import { useChartData } from "./graph/hooks/use-chart-data";

export function DownloadCSVButton({ variant }: { variant: DateRangeVariant }) {
  const { start, end, data: chartData } = useChartData(variant);
  const { areaFilenames, selectedAreaId, timeUnit, isComparison } =
    useChartSettings();

  const handleDownload = () => {
    if (!chartData.length || !start || !end) return;

    // CSVコンテンツの生成
    const csvContent = generateCSVContent(chartData);

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    // ファイル名の生成
    const fileName = generateCSVFileName({
      areaFilenames,
      selectedAreaId,
      timeUnit,
      start,
      end,
    });
    saveAs(blob, fileName);
  };
  return (
    <Button
      className="h-9 px-3 text-black rounded disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
      variant="outline"
      onClick={handleDownload}
      disabled={!start || !end}
    >
      <span className="flex items-center gap-1">
        <DownloadIcon size={16} />
        {!isComparison && <span className="hidden sm:inline">CSV</span>}
      </span>
    </Button>
  );
}
