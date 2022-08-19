import { DAY_NAMES } from "./constants";
import { IDayName } from "./types";

// returns ordered dayCols based on dayCols and firstDay
export const getWeekDays = (
  dayCols: string[],
  options: {
    firstDay: IDayName;
    locale?: string;
    format?: "short" | "long" | "narrow";
    noFormatting?: boolean;
  }
) => {
  const normailizeWeekday = (weekday: string) =>
    weekday[0].toUpperCase() + weekday.slice(1, 3).toLowerCase();

  const cols = dayCols.map((d) => normailizeWeekday(d));
  const weekday = normailizeWeekday(options.firstDay || "Mon");

  const startDay = {
    weekday,
    dayNum: DAY_NAMES.indexOf(weekday),
  };

  const weekdays: {
    date: Date;
    dayNum: number;
    weekday: string;
    localized: string;
  }[] = [];

  let i = 0;
  while (i < 7) {
    const date = new Date(new Date().getTime() + i * 24 * 3600 * 1000);
    const weekday = date.toLocaleDateString("en", { weekday: "short" });
    const localized = date.toLocaleDateString(options.locale || "en", {
      weekday: options.format || "short",
    });

    const weekdayObj = { date, dayNum: date.getDay(), weekday, localized };

    weekdays.push(weekdayObj);
    i++;
  }

  const reindexedDays = weekdays
    .map((d) => {
      if (d.dayNum < startDay.dayNum) d.dayNum += 7;
      return d;
    })
    .sort((a, b) => a.dayNum - b.dayNum)
    .filter((d) => cols.includes(d.weekday));

  if (options.noFormatting) return reindexedDays.map((d) => d.weekday);

  return reindexedDays.map((d) => d.localized);
};
