import dayjs from "dayjs";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import type { DateRange } from "react-day-picker";

export function useInitialRangeAdjustment(
  dateRange: { from?: Date; to?: Date } | undefined,
  setDateRange: Dispatch<SetStateAction<DateRange | undefined>>,
  min: Date | undefined,
  max: Date | undefined,
  getRange: (date: Date, min?: Date, max?: Date) => { from: Date; to: Date }
) {
  useEffect(() => {
    if (!dateRange) return;

    const start = dateRange.from
      ? getRange(dateRange.from, min, max).from
      : undefined;
    const end = dateRange.to ? getRange(dateRange.to, min, max).to : undefined;

    const needsUpdateFrom =
      dateRange.from && !dayjs(dateRange.from).isSame(start, "day");
    const needsUpdateTo =
      dateRange.to && !dayjs(dateRange.to).isSame(end, "day");

    if (needsUpdateFrom || needsUpdateTo) {
      setDateRange({ from: start, to: end });
    }
  }, []);
}
