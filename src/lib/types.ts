export type IPointerEvent = PointerEvent & {
  currentTarget: HTMLDivElement;
  target: Element;
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
  idx: number;
}
