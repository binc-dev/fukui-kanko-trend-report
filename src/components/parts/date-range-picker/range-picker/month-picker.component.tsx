import { Button } from "@/components/ui/button";
import { useChartSettings } from "@/context/ChartSettingsContext";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { useState } from "react";

const MONTHS = [
  "1月",
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月",
];

export function MonthPicker({
  onChange,
  selected,
  min,
}: {
  onChange: (date: Date) => void;
  selected?: Date;
  min?: Date;
}) {
  const { availableRange } = useChartSettings();

  const minLimit = min ?? availableRange.min ?? undefined;
  const maxLimit = availableRange.max ?? undefined;

  const minDate = minLimit ? dayjs(minLimit) : undefined;
  const maxDate = maxLimit ? dayjs(maxLimit) : undefined;

  const [prevSelected, setPrevSelected] = useState(selected);
  const [year, setYear] = useState(() => dayjs(selected || new Date()).year());

  if (selected !== prevSelected) {
    setPrevSelected(selected);
    if (selected) {
      setYear(dayjs(selected).year());
    }
  }

  const handleYearChange = (offset: number) => {
    setYear((prev) => {
      const nextYear = prev + offset;
      if (minDate && nextYear < minDate.year()) return prev;
      if (maxDate && nextYear > maxDate.year()) return prev;
      return nextYear;
    });
  };

  return (
    <div className={"p-4 w-fit"}>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleYearChange(-1)}
          disabled={minDate ? year <= minDate.year() : false}
        >
          &lt;
        </Button>
        <span className="font-semibold">{year}年</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleYearChange(1)}
          disabled={maxDate ? year >= maxDate.year() : false}
        >
          &gt;
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {MONTHS.map((monthName, index) => {
          const currentMonth = dayjs().year(year).month(index).startOf("month");

          const isBeforeMin = minDate
            ? currentMonth.isBefore(minDate, "month")
            : false;
          const isAfterMax = maxDate
            ? currentMonth.isAfter(maxDate, "month")
            : false;
          const isDisabled = isBeforeMin || isAfterMax;

          const isSelected = selected
            ? dayjs(selected).isSame(currentMonth, "month")
            : false;

          return (
            <Button
              key={monthName}
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "w-16",
                isDisabled && "disabled:opacity-30",
                isSelected && "bg-[#6eba2c] text-white hover:bg-[#5fa024]"
              )}
              disabled={isDisabled}
              onClick={() => onChange(currentMonth.toDate())}
            >
              {monthName}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
