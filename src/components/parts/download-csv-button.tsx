import { Button } from "@/components/ui/button"; // shadcn/ui等のボタン
import { DownloadIcon } from "@primer/octicons-react";

export function DownloadCSVButton() {
  return (
    <Button
      className="h-9 px-3  text-black rounded disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
      variant="outline"
    >
      <span className="flex items-center gap-1">
        <DownloadIcon size={16} />
        <span className="hidden sm:inline">CSV</span>
      </span>
    </Button>
  );
}
