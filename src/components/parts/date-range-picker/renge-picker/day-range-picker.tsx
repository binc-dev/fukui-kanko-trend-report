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
import { useState } from "react";

export function DayRangePicker() {
  const { dateRange, setDateRange, availableRange } = useChartSettings();
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
              className="w-48 justify-between font-normal border-black"
            >
              {dateRange?.from ? (
                dayjs(dateRange.from).format("YYYY/MM/DD")
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
              defaultMonth={dateRange?.from}
              startMonth={min}
              endMonth={max}
              selected={dateRange?.from}
              onSelect={(newFrom) => {
                setDateRange((prev) => {
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
              className="w-48 justify-between font-normal border-black"
              disabled={!dateRange?.from}
            >
              {dateRange?.to ? (
                dayjs(dateRange.to).format("YYYY/MM/DD")
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
              defaultMonth={dateRange?.to}
              startMonth={dateRange?.from ?? min}
              endMonth={max}
              selected={dateRange?.to}
              onSelect={(date) => {
                setDateRange((prev) => ({
                  ...prev,
                  from: prev?.from,
                  to: date,
                }));
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
