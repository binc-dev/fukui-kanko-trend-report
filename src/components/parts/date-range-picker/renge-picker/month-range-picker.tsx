import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useChartSettings } from "@/context/ChartSettingsContext";
import { CalendarIcon } from "@primer/octicons-react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { getMonthRange } from "../utils";
import { MonthPicker } from "./month-picker.component";

export function MonthRangePicker() {
  const { dateRange, setDateRange, availableRange } = useChartSettings();
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);

  const min = availableRange.min ?? undefined;
  const max = availableRange.max ?? undefined;

  useEffect(() => {
    if (!dateRange) return;

    const startOfMonth = dateRange.from
      ? getMonthRange(dateRange.from, min, max).from
      : undefined;

    const endOfMonth = dateRange.to
      ? getMonthRange(dateRange.to, min, max).to
      : undefined;

    if (
      !dayjs(dateRange.from).isSame(startOfMonth, "day") ||
      !dayjs(dateRange.to).isSame(endOfMonth, "day")
    ) {
      setDateRange({
        from: startOfMonth,
        to: endOfMonth,
      });
    }
  }, []);

  return (
    <div className="flex flex-row gap-6">
      <div className="flex flex-col gap-1">
        <p>開始</p>
        <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-48 justify-between font-normal border-black"
            >
              {dateRange?.from ? (
                dayjs(dateRange.from).format("YYYY/MM")
              ) : (
                <span>開始月を選択</span>
              )}
              <CalendarIcon size={24} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <MonthPicker
              selected={dateRange?.from}
              onChange={(date) => {
                const isSame =
                  dateRange?.from &&
                  dayjs(date).isSame(dayjs(dateRange.from), "month");

                if (isSame) {
                  setDateRange((prev) => ({ ...prev, from: undefined }));
                } else {
                  const { from: startDate } = getMonthRange(date, min, max);
                  setDateRange((prev) => {
                    const shouldResetTo =
                      prev?.to &&
                      dayjs(startDate).isAfter(dayjs(prev.to), "month");
                    return {
                      ...prev,
                      from: startDate,
                      to: shouldResetTo ? undefined : prev?.to,
                    };
                  });
                }
                setIsStartOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex items-end pb-1 text-xl">〜</div>
      <div className="flex flex-col gap-1">
        <p>終了</p>
        <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-48 justify-between font-normal border-black"
              disabled={!dateRange?.from}
            >
              {dateRange?.to ? (
                dayjs(dateRange.to).format("YYYY/MM")
              ) : (
                <span>終了月を選択</span>
              )}
              <CalendarIcon size={24} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <MonthPicker
              selected={dateRange?.to}
              min={dateRange?.from}
              onChange={(date) => {
                const isSameAsCurrent =
                  dateRange?.to &&
                  dayjs(date).isSame(dayjs(dateRange.to), "month");

                if (isSameAsCurrent) {
                  setDateRange((prev) => ({
                    ...prev,
                    from: prev?.from,
                    to: undefined,
                  }));
                } else {
                  const { to: endDate } = getMonthRange(date, min, max);
                  setDateRange((prev) => ({
                    ...prev,
                    from: prev?.from,
                    to: endDate,
                  }));
                }
                setIsEndOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
