import { DefaultTheme } from "solid-styled-components";
import { IWeekday } from "./types";

export const THEME: DefaultTheme = {
  dark: {
    primary: "dodgerblue",
    primary2: "lightblue",
    accent: "hotpink",
    accent2: "pink",
    text: "#fff",
    text2: "#ccc",
    lightText: "#444",
    bg: "#222",
    bg2: "#555",
  },
  light: {
    primary: "dodgerblue",
    primary2: "lightblue",
    accent: "hotpink",
    accent2: "pink",
    text: "#222",
    text2: "#555",
    lightText: "#ddd",
    bg: "#fff",
    bg2: "#ccc",
  },
};

export const WEEKDAYS: IWeekday[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const SCROLL_BAR = 15;

export const MARKER_TIME = 400;
export const MODAL_WIDTH = 120;
export const MODAL_HEIGHT = 140;

export const SNAP_OPTIONS = [30, 20, 15, 10, 5];

export const DEFAULT_SLOT_DURATION = 30;
export const MIN_SLOT_DURATION = 15;

export const t = {
  "pt-BR": {
    start: "início",
    end: "fim",
  },
  es: {
    start: "inicio",
    end: "fin",
  },
  fr: {
    start: "debout",
    end: "fin",
  },
  en: {
    start: "start",
    end: "end",
  },
};
