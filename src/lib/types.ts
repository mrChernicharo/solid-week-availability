export type IPointerEvent = PointerEvent & {
  currentTarget: HTMLDivElement;
  target: Element;
};
export type ITouchEvent = TouchEvent & {
  currentTarget: HTMLDivElement;
  target: Element;
};

export type IStore = {
  [k in IWeekday]: ITimeSlot[];
} & {
  slotId: string;
  day: IWeekday;
  gesture: "idle" | "drag:ready" | "drag:middle" | "drag:top" | "drag:bottom";
  lastPos: IPos; // for positioning modal?
  lastWindowPos: { x: number; y: number };
  modal: { create: boolean; merge: boolean; details: boolean; confirm: boolean; drop: boolean };
};

export type IPalette = "light" | "dark";

export type IDayColumn = {
  start: number;
  end: number;
  disabled: boolean;
};

export type ITimeSlot = {
  id: string;
  start: number;
  end: number;
  day: IWeekday;
  color?: string;
};
export type IWeekday = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";

export interface IPos {
  x: number;
  y: number;
  time: number;
}
// export interface IColumnClick {
//   minutes: number;
//   pos: IPos;
//   day: IWeekday;
//   clickedOnExistingSlot: boolean;
//   clickedSlots: ITimeSlot[];
//   nearbySlots: ITimeSlot[];
//   colIdx: number;
// }
