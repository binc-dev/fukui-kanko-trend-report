export type DataPoint = {
  date: string;
  [key: string]: string | number;
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

export type ChartMetric = {
  id: string;
  name: string;
  color: string;
  type?: "line" | "bar";
};
