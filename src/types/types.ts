export type DataPoint = {
  date: string;
  [key: string]: string | number;
};

export type ChartMetric = {
  id: string;
  name: string;
  color: string;
  type?: "line" | "bar";
};

export type TimeUnit = "day" | "week" | "month";
