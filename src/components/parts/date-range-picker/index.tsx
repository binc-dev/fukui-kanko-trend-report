import { useChartSettings } from "@/context/ChartSettingsContext";
import { DayRangePicker } from "./renge-picker/day-range-picker";
import { MonthRangePicker } from "./renge-picker/month-range-picker";
import { WeekRangePicker } from "./renge-picker/week-range-picker";

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
