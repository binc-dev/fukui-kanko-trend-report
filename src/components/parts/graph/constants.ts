export const COUNT_TREND_METRICS = [
  { id: "map_views", name: "地図検索", color: "#1F77B4" },
  { id: "search_views", name: "Web検索", color: "#FF7F0E" },
  { id: "directions", name: "ルート検索", color: "#2CA02C" },
  { id: "call_clicks", name: "通話", color: "#D62728" },
  { id: "website_clicks", name: "ウェブサイトクリック", color: "#9467BD" },
] as const;

export const REVIEW_TREND_METRICS = [
  {
    id: "review_count_change",
    name: "レビュー投稿数",
    color: "#1F77B4",
    type: "bar",
  },
  { id: "average_rating", name: "平均評点", color: "#FF7F0E", type: "line" },
] as const;

export const DAYS = ["日", "月", "火", "水", "木", "金", "土"];
