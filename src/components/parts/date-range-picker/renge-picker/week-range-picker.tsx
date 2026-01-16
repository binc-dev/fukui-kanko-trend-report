import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useChartSettings } from "@/context/ChartSettingsContext";
import { CalendarIcon } from "@primer/octicons-react";
import { ja } from "date-fns/locale";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useState } from "react";
dayjs.extend(isoWeek);

export function WeekRangePicker() {
  const { dateRange, setDateRange, availableRange } = useChartSettings();
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);

  const min = availableRange.min ?? undefined;
  const max = availableRange.max ?? undefined;

  const getWeekRange = (date: Date) => {
    let monday = dayjs(date).startOf("isoWeek").toDate();
    let sunday = dayjs(date).endOf("isoWeek").toDate();

    if (min && dayjs(monday).isBefore(min, "day")) {
      monday = min;
    }

    if (max && dayjs(sunday).isAfter(max, "day")) {
      sunday = max;
    }

    return { from: monday, to: sunday };
  };

  function handleWeekSelect(
    date: { from?: Date; to?: Date } | undefined,
    current: { from?: Date; to?: Date } | undefined,
    isStartWeek: boolean,
    setRange: (range: { from: Date; to: Date } | undefined) => void
  ) {
    if (!date?.from) return;

    const newWeek = getWeekRange(date.from);

    const currentDate = isStartWeek ? current?.from : current?.to;
    if (!currentDate) {
      setRange(newWeek);
      return;
    }

    const currentWeek = getWeekRange(currentDate);
    const compareDate = isStartWeek ? newWeek.from : newWeek.to;
    const currentCompareDate = isStartWeek ? currentWeek.from : currentWeek.to;

    if (compareDate < currentCompareDate) {
      setRange(newWeek);
    } else if (date.to) {
      setRange(getWeekRange(date.to));
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
              className="w-48 justify-between font-normal border-black"
            >
              {dateRange?.from ? (
                dayjs(dateRange.from).format("YYYY/MM/DD週")
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
              defaultMonth={dateRange?.from}
              startMonth={min}
              endMonth={max}
              selected={
                dateRange?.from ? getWeekRange(dateRange.from) : undefined
              }
              onSelect={(range) => {
                handleWeekSelect(range, dateRange, true, (newRange) =>
                  setDateRange((prev) => {
                    const shouldResetTo =
                      prev?.to &&
                      newRange &&
                      dayjs(newRange.from).isAfter(prev.to, "day");
                    return {
                      ...prev,
                      from: newRange?.from,
                      to: shouldResetTo ? undefined : prev?.to,
                    };
                  })
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
              className="w-48 justify-between font-normal border-black"
              disabled={!dateRange?.from}
            >
              {dateRange?.to ? (
                dayjs(getWeekRange(dateRange.to).from).format("YYYY/MM/DD週")
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
              defaultMonth={dateRange?.to}
              startMonth={dateRange?.from ?? min}
              endMonth={max}
              selected={
                dateRange?.to
                  ? {
                      from: getWeekRange(dateRange.to).from,
                      to: getWeekRange(dateRange.to).to,
                    }
                  : undefined
              }
              onSelect={(range) => {
                handleWeekSelect(range, dateRange, false, (newRange) =>
                  setDateRange((prev) => ({
                    ...prev,
                    from: prev?.from,
                    to: newRange?.to,
                  }))
                );
                setIsEndOpen(false);
              }}
              disabled={(date) =>
                (min ? dayjs(date).isBefore(min, "day") : false) ||
                (max ? dayjs(date).isAfter(max, "day") : false) ||
                (dateRange?.from ? dayjs(date).isBefore(dateRange.from) : false)
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
