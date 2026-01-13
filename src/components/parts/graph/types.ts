import type { DataPoint } from "@/types/types";

export type AggregatedDataPoint = {
  date: string;
  map_views: number;
  search_views: number;
  directions: number;
  call_clicks: number;
  website_clicks: number;
  total_reviews?: number;
  average_rating: number | null;
  review_count_change: number;
  location_count?: number;
  weighted_rating_sum?: number;
};

export type CustomXAxisTickProps = {
  x?: number;
  y?: number;
  payload?: {
    value: string;
  };
};

type TooltipPayloadItem = {
  payload: DataPoint;
  name: string;
  value: number;
  color: string;
  dataKey: string;
};

export type CustomTooltipContentProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  chartType: "count" | "review";
  hiddenKeys?: Set<string>;
};

type LegendPayloadItem = {
  dataKey: string;
  color: string;
  value: string;
};

export type CustomLegendContentProps = {
  payload?: LegendPayloadItem[];
  hoveredKey: string | null;
  hiddenKeys: Set<string>;
  onHover: (key: string) => void;
  onLeave: () => void;
  onToggle: (key: string) => void;
};
