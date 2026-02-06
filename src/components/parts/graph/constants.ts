export const COUNT_TREND_METRICS = [
  { id: "map_views", name: "地図検索", color: "#1F77B4" },
  { id: "search_views", name: "Web検索", color: "#FF7F0E" },
  { id: "directions", name: "ルート検索", color: "#2CA02C" },
  { id: "call_clicks", name: "通話", color: "#D62728" },
  { id: "website_clicks", name: "ウェブサイトクリック", color: "#9467BD" },
] as const;

export const REVIEW_TREND_METRICS = [
  {
    id: "review_count_by_rating_1",
    name: "★1",
    color: "#cbd5e1",
    type: "bar",
    stackId: "reviews",
  },
  {
    id: "review_count_by_rating_2",
    name: "★2",
    color: "#93c5fd",
    type: "bar",
    stackId: "reviews",
  },
  {
    id: "review_count_by_rating_3",
    name: "★3",
    color: "#60a5fa",
    type: "bar",
    stackId: "reviews",
  },
  {
    id: "review_count_by_rating_4",
    name: "★4",
    color: "#3b82f6",
    type: "bar",
    stackId: "reviews",
  },
  {
    id: "review_count_by_rating_5",
    name: "★5",
    color: "#1e40af",
    type: "bar",
    stackId: "reviews",
  },
  { id: "average_rating", name: "平均評点", color: "#f59e0b", type: "line" },
] as const;

export const DAYS = ["日", "月", "火", "水", "木", "金", "土"];
