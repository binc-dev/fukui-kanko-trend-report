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
    if (!dateRange?.from || !dateRange?.to) return;

    const start = getRange(dateRange.from, min, max).from;
    const end = getRange(dateRange.to, min, max).to;

    const needsUpdateFrom = !dayjs(dateRange.from).isSame(start, "day");
    const needsUpdateTo = !dayjs(dateRange.to).isSame(end, "day");

    if (needsUpdateFrom || needsUpdateTo) {
      setDateRange({ from: start, to: end });
    }
  }, [dateRange, min, max, getRange, setDateRange]);
}
