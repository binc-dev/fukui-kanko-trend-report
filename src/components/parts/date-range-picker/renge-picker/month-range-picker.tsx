import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useChartSettings } from "@/context/ChartSettingsContext";
import { CalendarIcon } from "@primer/octicons-react";
import dayjs from "dayjs";
import { MonthPicker } from "./month-picker.component";

export function MonthRangePicker() {
  const { dateRange, setDateRange } = useChartSettings();

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
                const startDate = dayjs(date).startOf("month").toDate();
                setDateRange((prev) => ({
                  ...prev,
                  from: startDate,
                }));
              }}
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
              onChange={(date) => {
                const endDate = dayjs(date).endOf("month").toDate();
                setDateRange((prev) => ({
                  ...prev,
                  from: prev?.from,
                  to: endDate,
                }));
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
