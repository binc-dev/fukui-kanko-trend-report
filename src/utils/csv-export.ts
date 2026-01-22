import type { ChartDataItem, TimeUnit } from "@/types/types";
import type { Dayjs } from "dayjs";

export const HEADER_MAP = {
  date: "日付",
  map_views: "地図検索",
  search_views: "web検索",
  directions: "ルート検索",
  call_clicks: "通話",
  website_clicks: "ウェブサイトクリック",
  review_count_change: "レビュー投稿数",
  average_rating: "平均評点",
} as const;

export const DATE_FORMATS = {
  month: "YYYYMM",
  week: "YYYYMMDD[週]",
  day: "YYYYMMDD",
} as const;

export function generateCSVContent(data: ChartDataItem[]): string {
  const headers = Object.values(HEADER_MAP).join(",");
  const keys = Object.keys(HEADER_MAP) as (keyof typeof HEADER_MAP)[];

  const rows = data.map((item) =>
    keys.map((key) => `"${item[key] ?? ""}"`).join(","),
  );

  return [headers, ...rows].join("\n");
}

export function generateCSVFileName({
  area,
  timeUnit,
  start,
  end,
}: {
  area: string;
  timeUnit: TimeUnit;
  start: Dayjs;
  end: Dayjs;
}): string {
  const name =
    area === "total_daily_metrics.csv" ? "全域" : area.split("_")[2] || "不明";

  const formatStr = DATE_FORMATS[timeUnit];
  const dateRangeStr = `${start.format(formatStr)}-${end.format(formatStr)}`;

  return `トレンドレポート_${name}_${dateRangeStr}.csv`;
}
