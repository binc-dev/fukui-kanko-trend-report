import type { TimeUnit } from "@/types/types";
import dayjs from "dayjs";
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { DateRange } from "react-day-picker";

interface ChartSettingsContextType {
  area: string;
  setArea: (area: string) => void;
  timeUnit: TimeUnit;
  setTimeUnit: (timeUnit: TimeUnit) => void;
  dateRange: DateRange | undefined;
  setDateRange: Dispatch<SetStateAction<DateRange | undefined>>;
}

const ChartSettingsContext = createContext<
  ChartSettingsContextType | undefined
>(undefined);

export const ChartSettingsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [area, setArea] = useState("total_daily_metrics.csv");
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("day");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: dayjs().subtract(1, "month").toDate(),
    to: dayjs().toDate(),
  });

  return (
    <ChartSettingsContext.Provider
      value={{ area, setArea, timeUnit, setTimeUnit, dateRange, setDateRange }}
    >
      {children}
    </ChartSettingsContext.Provider>
  );
};

export const useChartSettings = () => {
  const context = useContext(ChartSettingsContext);

  if (context === undefined) {
    throw new Error(
      "useChartSettings は ChartSettingsProvider の中で使用してください"
    );
  }

  return context;
};
