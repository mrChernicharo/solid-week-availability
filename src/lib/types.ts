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
