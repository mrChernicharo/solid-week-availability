import { FaSolidCheck, FaSolidX } from "solid-icons/fa";
import { createEffect, createSignal, For, Show } from "solid-js";
import { createStore, unwrap } from "solid-js/store";
import { getHours, getWeekDays } from "../../lib/helpers";
import { IColumnClick, IDayName, ITimeSlot } from "../../lib/types";
import DayColumn from "../DayColumn/DayColumn";
import { DayGridContainer, MarkerOverlay } from "./DayGridStyles";
import idMaker from "@melodev/id-maker";
import { DefaultTheme } from "solid-styled-components";
import { HALF_SLOT } from "../../lib/constants";

type IStore = {
  [k in IDayName]: ITimeSlot[];
};

interface IProps {
  cols: IDayName[];
  localizedCols: string[];
  minHour: number;
  maxHour: number;
  locale: string;
  colWidth: number;
  colHeight: number;
  widgetHeight: number;
  firstDay: string;
  theme: DefaultTheme;
  palette: "light" | "dark";
}

const initialStore = {};

const DayGrid = (props: IProps) => {
  let columnClick: IColumnClick;
  const HOURS = getHours(props.minHour, props.maxHour, props.locale);

  props.cols.forEach((col: IDayName) => {
    initialStore[col] = [];
  });

  const [store, setStore] = createStore(initialStore as IStore);

  const [overlayOpen, setOverlayOpen] = createSignal(false);

  // console.log("DayGridProps", { ...props, s: { ...unwrap(store) } });

  function handleColumnClick(obj: IColumnClick) {
    columnClick = structuredClone(obj);

    // has overlap

    setOverlayOpen(true);
  }

  function addNewTimeSlot(e) {
    console.log("addNewTimeSlot", columnClick, store[columnClick?.day]);
    setOverlayOpen(false);
    const newTimeSlot: ITimeSlot = {
      id: idMaker(),
      start: columnClick.minutes - HALF_SLOT,
      end: columnClick.minutes + HALF_SLOT,
      day: columnClick.day,
    };

    setStore(columnClick.day, (s) => [...s, newTimeSlot]);
  }

  createEffect(() => console.log({ ...store.Mon }));

  return (
    <DayGridContainer
      cols={props.localizedCols}
      colHeight={props.colHeight}
      colWidth={props.colWidth}
      theme={props.theme}
      palette={props.palette}
      itemCount={HOURS.length}
      data-cy="day_grid"
    >
      <For each={props.cols}>
        {(col: IDayName, i) => (
          <DayColumn
            day={col}
            height={props.colHeight}
            width={props.colWidth}
            minHour={props.minHour}
            maxHour={props.maxHour}
            theme={props.theme}
            palette={props.palette}
            onColumnClick={handleColumnClick}
            // setTimeSlots={setStore}
            timeSlots={store[col]}
            idx={i()}
          />
        )}
      </For>

      <For each={HOURS}>
        {(hour: string, i) => (
          <div
            class="grid-line"
            style={{ top: (props.colHeight / HOURS.length) * i() + "px" }}
            data-cy={`grid_line_${hour}`}
          />
        )}
      </For>

      <Show when={overlayOpen()}>
        <MarkerOverlay onClick={(e) => setOverlayOpen(false)} />
        <div
          style={{
            position: "absolute",
            background: "lightblue",
            "z-index": 50,
            /* @ts-ignore */
            top: columnClick.pos.y + "px",
            /* @ts-ignore */
            left: columnClick.pos.x + props.colWidth * columnClick.idx + "px",
          }}
        >
          <button onclick={(e) => setOverlayOpen(false)}>
            <FaSolidX />
          </button>
          <h1>Modal</h1>
          <button onclick={(e) => addNewTimeSlot(e)}>
            <FaSolidCheck />
          </button>
        </div>
      </Show>
    </DayGridContainer>
  );
};

export default DayGrid;
