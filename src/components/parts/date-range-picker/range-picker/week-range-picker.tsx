import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useChartSettings } from "@/context/ChartSettingsContext";
import type { DateRangeVariant } from "@/types/types";
import { CalendarIcon } from "@primer/octicons-react";
import { ja } from "date-fns/locale";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useState } from "react";
import { useInitialRangeAdjustment } from "../hooks/useInitialRangeAdjustment";
import { getWeekRange } from "../utils";
dayjs.extend(isoWeek);

export function WeekRangePicker({ variant }: { variant: DateRangeVariant }) {
  const {
    dateRange,
    setDateRange,
    comparisonRange,
    setComparisonRange,
    availableRange,
  } = useChartSettings();

  const currentRange = variant === "primary" ? dateRange : comparisonRange;
  const currentSetter =
    variant === "primary" ? setDateRange : setComparisonRange;

  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);

  const min = availableRange.min ?? undefined;
  const max = availableRange.max ?? undefined;

  // 表示単位を切り替えた時に範囲を週の範囲に調整する
  useInitialRangeAdjustment(
    currentRange,
    currentSetter,
    min,
    max,
    getWeekRange,
  );

  // 週選択時の処理
  function handleWeekSelect(
    date: { from?: Date; to?: Date } | undefined,
    current: { from?: Date; to?: Date } | undefined,
    isStartWeek: boolean,
    setRange: (range: { from: Date; to: Date } | undefined) => void,
  ) {
    if (!date?.from) return;

    const newWeek = getWeekRange(date.from, min, max);

    const currentDate = isStartWeek ? current?.from : current?.to;
    if (!currentDate) {
      setRange(newWeek);
      return;
    }

    const currentWeek = getWeekRange(currentDate, min, max);
    const compareDate = isStartWeek ? newWeek.from : newWeek.to;
    const currentCompareDate = isStartWeek ? currentWeek.from : currentWeek.to;

    if (compareDate < currentCompareDate) {
      setRange(newWeek);
    } else if (date.to) {
      setRange(getWeekRange(date.to, min, max));
    }
  }

  return (
    <div className="flex flex-row gap-6">
      <div className="flex flex-col gap-1">
        <p>開始</p>
        <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="lg:w-48 justify-between font-normal border-black"
            >
              {currentRange?.from ? (
                dayjs(currentRange.from).format("YYYY/MM/DD週")
              ) : (
                <span>開始週を選択</span>
              )}
              <CalendarIcon size={24} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              locale={ja}
              mode="range"
              defaultMonth={currentRange?.from}
              startMonth={min}
              endMonth={max}
              selected={
                currentRange?.from
                  ? getWeekRange(currentRange.from, min, max)
                  : undefined
              }
              onSelect={(range) => {
                handleWeekSelect(range, currentRange, true, (newRange) =>
                  currentSetter((prev) => {
                    const shouldResetTo =
                      prev?.to &&
                      newRange &&
                      dayjs(newRange.from).isAfter(prev.to, "day");
                    return {
                      ...prev,
                      from: newRange?.from,
                      to: shouldResetTo ? undefined : prev?.to,
                    };
                  }),
                );
                setIsStartOpen(false);
              }}
              disabled={(date) =>
                (min ? dayjs(date).isBefore(min, "day") : false) ||
                (max ? dayjs(date).isAfter(max, "day") : false)
              }
              className="rounded-md border shadow-sm"
              captionLayout="dropdown"
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
              className="lg:w-48 justify-between font-normal border-black"
              disabled={!currentRange?.from}
            >
              {currentRange?.to ? (
                dayjs(getWeekRange(currentRange.to, min, max).from).format(
                  "YYYY/MM/DD週",
                )
              ) : (
                <span>終了週を選択</span>
              )}
              <CalendarIcon size={24} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              locale={ja}
              mode="range"
              defaultMonth={currentRange?.to}
              startMonth={currentRange?.from ?? min}
              endMonth={max}
              selected={
                currentRange?.to
                  ? {
                      from: getWeekRange(currentRange.to, min, max).from,
                      to: getWeekRange(currentRange.to, min, max).to,
                    }
                  : undefined
              }
              onSelect={(range) => {
                handleWeekSelect(range, currentRange, false, (newRange) =>
                  currentSetter((prev) => ({
                    ...prev,
                    from: prev?.from,
                    to: newRange?.to,
                  })),
                );
                setIsEndOpen(false);
              }}
              disabled={(date) =>
                (min ? dayjs(date).isBefore(min, "day") : false) ||
                (max ? dayjs(date).isAfter(max, "day") : false) ||
                (currentRange?.from
                  ? dayjs(date).isBefore(currentRange.from)
                  : false)
              }
              className="rounded-md border shadow-sm"
              captionLayout="dropdown"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
