import { DAY_NAMES, HALF_SLOT } from "./constants";
import { IDayName, ITimeSlot } from "./types";

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

  while (curr < maxHour) {
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

//////////*************************************************//////////

export function timeToYPos(
  minutes: number,
  minHour: number,
  maxHour: number,
  columnHeight: number
) {
  const [start, end] = [minHour * 60, maxHour * 60];

  const percent = (minutes - start) / (end - start);
  const res = columnHeight * percent;

  return res;
}

export function yPosToTime(
  yPos: number,
  minHour: number,
  maxHour: number,
  columnHeight: number
) {
  const [start, end] = [minHour * 60, maxHour * 60];

  const percent = yPos / columnHeight;

  const timeClicked = (end - start) * percent + start;

  return Math.round(timeClicked);
}

export function readableTime(minutes: number, locale = "en") {
  const [hours, mins] = [Math.floor(minutes / 60), minutes % 60];

  let h = hours < 10 ? `0${hours}` : hours;
  let m = mins < 10 ? `0${mins}` : mins;

  let res = "";
  if (locale === "en") {
    if (hours === 0) {
      res = `12:${m} AM`;
    }
    if (hours === 12) {
      res = `12:${m} PM`;
    }
    if (hours !== 0 && hours !== 12) {
      if (hours > 11) {
        res = `${+h - 12}:${m} PM`;
      } else {
        res = `${+h}:${m} AM`;
      }
    }
  } else {
    res = `${h}:${m}`;
  }

  console.log({ hours, mins, minutes, res });
  return res;
}

//////////*************************************************//////////

export function findOverlappingSlots(
  start: number,
  end: number,
  timeSlots: ITimeSlot[]
) {
  const overlappingItems = timeSlots.filter(
    (s, i) =>
      (start <= s.start && start <= s.end && end >= s.start && end <= s.end) || // top overlap
      (start >= s.start && start <= s.end && end >= s.start && end <= s.end) || // fit inside
      (start >= s.start && start <= s.end && end >= s.start && end >= s.end) || // bottom overlap
      (start <= s.start && start <= s.end && end >= s.start && end >= s.end) // encompass
  );

  return overlappingItems;
}

export function getMergedTimeslots(newTimeSlot, timeslots) {
  if (!newTimeSlot) return timeslots;

  const { start, end } = newTimeSlot;

  const overlappingItems = findOverlappingSlots(start, end, timeslots);

  if (overlappingItems?.length > 0) {
    const overlappingIds = overlappingItems
      .map((item) => item.id)
      .concat(newTimeSlot.id);

    const mergedSlot = mergeTimeslots(
      [...timeslots, newTimeSlot],
      overlappingIds
    );

    const filteredSlots = timeslots.filter(
      (item) => !overlappingIds.includes(item.id)
    );

    const mergedSlots = [...filteredSlots, mergedSlot];

    return mergedSlots;
  } else {
    return [...timeslots, newTimeSlot];
  }
}

export function mergeTimeslots(timeSlots, overlappingIds) {
  const overlapping = timeSlots.filter((item) =>
    overlappingIds.includes(item.id)
  );

  // console.log('before merge', overlapping);

  const mergedSlot = overlapping.reduce(
    (acc, next) => {
      (acc.start = Math.min(acc.start, next.start)),
        (acc.end = Math.max(acc.end, next.end));

      return acc;
    },
    {
      id: overlapping[0].id,
      start: overlapping[0].start,
      end: overlapping[0].end,
    }
  );

  const snappedSlot = {
    id: mergedSlot.id,
    start: mergedSlot.start,
    end: mergedSlot.end,
  };

  return snappedSlot;
}
