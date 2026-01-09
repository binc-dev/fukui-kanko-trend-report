import type { TimeUnit } from "@/types/types";
import { createContext, useContext, useState, type ReactNode } from "react";

interface ChartSettingsContextType {
  area: string;
  setArea: (area: string) => void;
  timeUnit: TimeUnit;
  setTimeUnit: (timeUnit: TimeUnit) => void;
}

const chartSettingsContext = createContext<
  ChartSettingsContextType | undefined
>(undefined);

export const ChartSettingsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [area, setArea] = useState("total_daily_metrics.csv");
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("day");

  return (
    <chartSettingsContext.Provider
      value={{ area, setArea, timeUnit, setTimeUnit }}
    >
      {children}
    </chartSettingsContext.Provider>
  );
};

export const useChartSettings = () => {
  const context = useContext(chartSettingsContext);

  if (context === undefined) {
    throw new Error(
      "useChartSettings は ChartSettingsProvider の中で使用してください"
    );
  }

  return context;
};
