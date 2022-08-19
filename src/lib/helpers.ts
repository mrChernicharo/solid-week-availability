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

export const getHours = (minHour: number, maxHour: number, locale = "en") => {
  const hours: string[] = [];
  let curr = minHour;

  while (curr <= maxHour) {
    let hour = "";
    if (locale === "en") {
      if (curr === 0) hour = "12 AM";
      if (curr === 12) hour = "12 PM";
      if (curr !== 0 && curr !== 12)
        hour = curr < 12 ? curr + " AM" : curr - 12 + " PM";
    } else {
      hour = curr + ":00";
    }

    hours.push(hour);
    curr++;
  }

  return hours;
};

export function getElementRect(ref: HTMLElement) {
  return ref.getBoundingClientRect();
}

export function setCSSVariable(key: string, val: string) {
  document.documentElement.style.setProperty(key, val);
}

export function getCSSVariable(key: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(key)
    .trim();
}
