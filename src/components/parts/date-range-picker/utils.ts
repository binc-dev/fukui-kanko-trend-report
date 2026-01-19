import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

/**
 * 指定された日付を含む週（月〜日）の範囲を返す
 */
export const getWeekRange = (date: Date, min?: Date, max?: Date) => {
  let from = dayjs(date).startOf("isoWeek").toDate();
  let to = dayjs(date).endOf("isoWeek").toDate();

  if (min && dayjs(from).isBefore(min, "day")) from = min;
  if (max && dayjs(to).isAfter(max, "day")) to = max;

  return { from, to };
};

/**
 * 指定された日付を含む月の範囲を返す
 */
export const getMonthRange = (date: Date, min?: Date, max?: Date) => {
  let from = dayjs(date).startOf("month").toDate();
  let to = dayjs(date).endOf("month").toDate();

  if (min && dayjs(from).isBefore(min, "day")) from = min;
  if (max && dayjs(to).isAfter(max, "day")) to = max;

  return { from, to };
};
