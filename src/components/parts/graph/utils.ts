import * as holidayJP from "@holiday-jp/holiday_jp";
import { DAYS } from "./constants";

export const getDateInfo = (dateStr: string) => {
  const date = new Date(dateStr);
  const dayOfWeek = DAYS[date.getDay()];
  const holiday = holidayJP.between(date, date)[0];

  const displayText = holiday ? holiday.name : dayOfWeek;
  const isWeekendOrHoliday = holiday || dayOfWeek === "日";
  const isSaturday = dayOfWeek === "土";

  const color = isWeekendOrHoliday ? "red" : isSaturday ? "blue" : "#666";
  const formattedDate = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;

  return { formattedDate, displayText, color };
};
