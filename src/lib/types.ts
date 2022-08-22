export type IPointerEvent = PointerEvent & {
  currentTarget: HTMLDivElement;
  target: Element;
};

export type IStore = {
  [k in IDayName]: ITimeSlot[];
} & {
  slot: ITimeSlot | null;
  day: IDayName;
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
  day?: string;
  color?: string;
};
export type IDayName = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";

export interface IPos {
  x: number;
  y: number;
}
export interface IColumnClick {
  minutes: number;
  pos: IPos;
  day: IDayName;
  clickedOnExistingSlot: boolean;
  clickedSlots: ITimeSlot[];
  nearbySlots: ITimeSlot[];
  colIdx: number;
}
