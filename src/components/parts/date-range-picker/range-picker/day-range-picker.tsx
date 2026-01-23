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
import { useState } from "react";

export function DayRangePicker({ variant }: { variant: DateRangeVariant }) {
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
                dayjs(currentRange.from).format("YYYY/MM/DD")
              ) : (
                <span>開始日を選択</span>
              )}
              <CalendarIcon size={24} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              locale={ja}
              mode="single"
              defaultMonth={currentRange?.from}
              startMonth={min}
              endMonth={max}
              selected={currentRange?.from}
              onSelect={(newFrom) => {
                currentSetter((prev) => {
                  const shouldResetTo =
                    prev?.to &&
                    newFrom &&
                    dayjs(newFrom).isAfter(prev.to, "day");
                  return {
                    ...prev,
                    from: newFrom,
                    to: shouldResetTo ? undefined : prev?.to,
                  };
                });
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
                dayjs(currentRange.to).format("YYYY/MM/DD")
              ) : (
                <span>終了日を選択</span>
              )}
              <CalendarIcon size={24} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              locale={ja}
              mode="single"
              defaultMonth={currentRange?.to}
              startMonth={currentRange?.from ?? min}
              endMonth={max}
              selected={currentRange?.to}
              onSelect={(date) => {
                currentSetter((prev) => ({
                  ...prev,
                  from: prev?.from,
                  to: date,
                }));
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
