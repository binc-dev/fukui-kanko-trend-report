import { useChartSettings } from "@/context/ChartSettingsContext";
import { DayRangePicker } from "./range-picker/day-range-picker";
import { MonthRangePicker } from "./range-picker/month-range-picker";
import { WeekRangePicker } from "./range-picker/week-range-picker";

export function DateRangePicker() {
  const { timeUnit } = useChartSettings();

  return timeUnit === "day" ? (
    <DayRangePicker />
  ) : timeUnit === "week" ? (
    <WeekRangePicker />
  ) : (
    <MonthRangePicker />
  );
}
