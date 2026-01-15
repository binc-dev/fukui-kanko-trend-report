import { Button } from "@/components/ui/button";
import { useChartSettings } from "@/context/ChartSettingsContext";
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

  const minDate = min
    ? dayjs(min)
    : availableRange.min
    ? dayjs(availableRange.min)
    : undefined;
  const maxDate = availableRange.max ? dayjs(availableRange.max) : undefined;
  const selectedDate = selected ? dayjs(selected) : undefined;
  // 範囲の年を算出
  const minYear = minDate ? minDate.year() : dayjs().year();
  const maxYear = maxDate ? maxDate.year() : dayjs().year();
  const [year, setYear] = useState(() => {
    const initialYear = selectedDate?.year() ?? dayjs().year();
    return Math.min(maxYear, Math.max(minYear, initialYear));
  });

  const [prevSelected, setPrevSelected] = useState(selected);
  if (selected !== prevSelected) {
    setPrevSelected(selected);
    if (selected) {
      setYear(selected.getFullYear());
    }
  }

  const handleYearChange = (offset: number) => {
    setYear((prev) => Math.min(maxYear, Math.max(minYear, prev + offset)));
  };

  return (
    <div className={"p-4 w-fit"}>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleYearChange(-1)}
          disabled={year <= minYear}
        >
          &lt;
        </Button>
        <span className="font-semibold">{year}年</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleYearChange(1)}
          disabled={year >= maxYear}
        >
          &gt;
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {MONTHS.map((monthName, index) => {
          const currentMonthDate = dayjs(new Date(year, index, 1));

          const isBeforeMin = minDate
            ? currentMonthDate.isBefore(minDate, "month")
            : false;
          const isAfterMax = maxDate
            ? currentMonthDate.isAfter(maxDate, "month")
            : false;
          const isDisabled = isBeforeMin || isAfterMax;

          const isSelected = selectedDate?.isSame(currentMonthDate, "month");

          return (
            <Button
              key={monthName}
              variant={isSelected ? "default" : "outline"}
              className="w-16"
              disabled={isDisabled}
              onClick={() => onChange?.(currentMonthDate.toDate())}
            >
              {monthName}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
