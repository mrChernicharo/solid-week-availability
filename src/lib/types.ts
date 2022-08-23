export type IPointerEvent = PointerEvent & {
  currentTarget: HTMLDivElement;
  target: Element;
};

export type IStore = {
  [k in IWeekday]: ITimeSlot[];
} & {
  slot: ITimeSlot | null;
  day: IWeekday;
  gesture: "idle" | "drag:ready" | "drag:middle" | "drag:top" | "drag:bottom";
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
  day?: IWeekday;
  color?: string;
};
export type IWeekday = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";

export interface IPos {
  x: number;
  y: number;
}
export interface IColumnClick {
  minutes: number;
  pos: IPos;
  day: IWeekday;
  clickedOnExistingSlot: boolean;
  clickedSlots: ITimeSlot[];
  nearbySlots: ITimeSlot[];
  colIdx: number;
}
