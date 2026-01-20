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
  isComparison: boolean;
  setIsComparison: (isComparison: boolean) => void;
  dateRange: DateRange | undefined;
  setDateRange: Dispatch<SetStateAction<DateRange | undefined>>;
  comparisonRange: DateRange | undefined;
  setComparisonRange: Dispatch<SetStateAction<DateRange | undefined>>;
  availableRange: { min: Date | null; max: Date | null };
  setAvailableRange: Dispatch<
    SetStateAction<{ min: Date | null; max: Date | null }>
  >;
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
  const [isComparison, setIsComparison] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: dayjs().subtract(3, "month").toDate(),
    to: dayjs().subtract(1, "day").toDate(),
  });
  const [comparisonRange, setComparisonRange] = useState<DateRange | undefined>(
    {
      from: dayjs().subtract(3, "month").toDate(),
      to: dayjs().subtract(1, "day").toDate(),
    }
  );
  const [availableRange, setAvailableRange] = useState<{
    min: Date | null;
    max: Date | null;
  }>({
    min: null,
    max: dayjs().subtract(1, "day").toDate(),
  });

  return (
    <ChartSettingsContext.Provider
      value={{
        area,
        setArea,
        timeUnit,
        setTimeUnit,
        isComparison,
        setIsComparison,
        dateRange,
        setDateRange,
        comparisonRange,
        setComparisonRange,
        availableRange,
        setAvailableRange,
      }}
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
