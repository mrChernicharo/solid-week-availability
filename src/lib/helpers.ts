import { DAY_NAMES } from "./constants";

// returns ordered dayCols based on dayCols and firstDay
export const getOrderedWeekDays = (firstDay: string, dayCols: string[]) => {
  const normailizeWeekday = (weekday: string) =>
    weekday[0].toUpperCase() + weekday.slice(1, 3).toLowerCase();

  const cols = dayCols.map((d) => normailizeWeekday(d));
  const weekday = normailizeWeekday(firstDay);

  const startDay = {
    weekday,
    dayNum: DAY_NAMES.indexOf(weekday),
  };

  let i = 0;
  const weekdays: { date: Date; dayNum: number; weekday: string }[] = [];
  while (i < 7) {
    const date = new Date(new Date().getTime() + i * 24 * 3600 * 1000);
    const weekday = date.toLocaleDateString("en", { weekday: "short" });

    const weekdayObj = { date, dayNum: date.getDay(), weekday };

    weekdays.push(weekdayObj);
    i++;
  }

  const reindexedDays = weekdays
    .map((d) => {
      if (d.dayNum < startDay.dayNum) d.dayNum += 7;
      return d;
    })
    .sort((a, b) => a.dayNum - b.dayNum)
    .map((d) => d.weekday)
    .filter((d) => cols.includes(d));

  return reindexedDays;
};

export const getLocaleWeekDays = (locale: string) => {
  let i = 0;
  const weekdays: { dayNum: number; weekday: string }[] = [];
  const today = new Date();

  while (i < 7) {
    const date = new Date(today.getTime() + i * 24 * 3600 * 1000);
    const weekday = date.toLocaleDateString(locale, { weekday: "short" });

    const weekdayObj = { dayNum: date.getDay(), weekday };

    weekdays.push(weekdayObj);
    i++;
  }

  return weekdays.sort((a, b) => a.dayNum - b.dayNum);
};
