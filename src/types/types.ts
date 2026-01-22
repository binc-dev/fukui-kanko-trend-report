export type DataPoint = {
  date: string;
  map_views: number;
  search_views: number;
  directions: number;
  call_clicks: number;
  website_clicks: number;
  total_reviews: number;
  average_rating: number;
  review_count_change: number;
  location_count: number;
};

export type ChartDataItem = {
  date: string;
  map_views: number;
  search_views: number;
  directions: number;
  call_clicks: number;
  website_clicks: number;
  review_count_change: number;
  average_rating: number | null;
};

export type ChartMetric = {
  id: string;
  name: string;
  color: string;
  type?: "line" | "bar";
};

export type TimeUnit = "day" | "week" | "month";

export type DateRangeVariant = "primary" | "comparison";
