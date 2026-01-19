import { useChartSettings } from "@/context/ChartSettingsContext";
import type { DateRangeVariant } from "@/types/types";
import { DayRangePicker } from "./range-picker/day-range-picker";
import { MonthRangePicker } from "./range-picker/month-range-picker";
import { WeekRangePicker } from "./range-picker/week-range-picker";

export function DateRangePicker({
  variant = "primary",
}: {
  variant: DateRangeVariant;
}) {
  const { timeUnit } = useChartSettings();

  return timeUnit === "day" ? (
    <DayRangePicker variant={variant} />
  ) : timeUnit === "week" ? (
    <WeekRangePicker variant={variant} />
  ) : (
    <MonthRangePicker variant={variant} />
  );
}
