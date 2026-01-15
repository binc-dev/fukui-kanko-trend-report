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

export function DayRangePicker() {
  const { dateRange, setDateRange, availableRange } = useChartSettings();

  const min = availableRange.min ?? undefined;
  const max = availableRange.max ?? undefined;

  return (
    <div className="flex flex-row gap-6">
      <div className="flex flex-col gap-1">
        <p>開始</p>
        <Popover>
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
              selected={dateRange?.from}
              onSelect={(date) =>
                setDateRange((prev) => ({ ...prev, from: date }))
              }
              disabled={(date) =>
                (min ? dayjs(date).isBefore(min, "day") : false) ||
                (max ? dayjs(date).isAfter(max, "day") : false) ||
                (dateRange?.to ? dayjs(date).isAfter(dateRange.to) : false)
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
        <Popover>
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
              selected={dateRange?.to}
              onSelect={(date) =>
                setDateRange((prev) => ({
                  ...prev,
                  from: prev?.from,
                  to: date,
                }))
              }
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
