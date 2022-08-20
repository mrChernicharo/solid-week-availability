import { FaSolidCheck, FaSolidX } from "solid-icons/fa";
import { createEffect, createSignal, For, Show } from "solid-js";
import { createStore, unwrap } from "solid-js/store";
import { getElementRect, getHours, getWeekDays } from "../../lib/helpers";
import {
  IColumnClick,
  IDayName,
  IPointerEvent,
  ITimeSlot,
} from "../../lib/types";
import DayColumn from "../DayColumn/DayColumn";
import { DayGridContainer, MarkerOverlay } from "./DayGridStyles";
import idMaker from "@melodev/id-maker";
import { DefaultTheme } from "solid-styled-components";
import { HALF_SLOT, MODAL_HEIGHT, MODAL_WIDTH } from "../../lib/constants";

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
  headerHeight: number;
  widgetHeight: number;
  firstDay: string;
  theme: DefaultTheme;
  palette: "light" | "dark";
}

const initialStore = {};

const DayGrid = (props: IProps) => {
  let gridRef: HTMLDivElement;
  let modalRef: HTMLDivElement;
  let posX = 0;
  let posY = 0;

  let columnClick: IColumnClick;
  const HOURS = getHours(props.minHour, props.maxHour, props.locale);

  props.cols.forEach((col: IDayName) => {
    initialStore[col] = [];
  });

  const [store, setStore] = createStore(initialStore as IStore);

  const [createModalOpen, setCreateModalOpen] = createSignal(false);
  const [mergeModalOpen, setMergeModalOpen] = createSignal(false);

  // console.log("DayGridProps", { ...props, s: { ...unwrap(store) } });

  function handleColumnClick(e: IPointerEvent, obj: IColumnClick) {
    console.log(obj);
    columnClick = structuredClone(obj);
    const wRect = () =>
      getElementRect(gridRef.parentElement?.parentElement as HTMLDivElement);

    const widget = document.querySelector("#widget_root_element");
    const scrollOffsetY = widget?.scrollTop || 0;
    const scrollOffsetX = widget?.scrollLeft || 0;

    posX = columnClick.pos.x + props.colWidth * columnClick.idx;
    posX = posX - scrollOffsetX < wRect().width / 2 ? posX : posX - MODAL_WIDTH;

    posY = columnClick.pos.y;
    posY =
      posY < wRect().height / 2 + scrollOffsetY ? posY : posY - MODAL_HEIGHT;

    if (!mergeModalOpen()) setCreateModalOpen(true);
  }

  function handleOverlap() {
    console.log("overlap");
    setCreateModalOpen(false);
    setMergeModalOpen(true);
  }

  function addNewTimeSlot(e) {
    const newTimeSlot: ITimeSlot = {
      id: idMaker(),
      start: columnClick.minutes - HALF_SLOT,
      end: columnClick.minutes + HALF_SLOT,
      day: columnClick.day,
    };

    setStore(columnClick.day, (slots) => [...slots, newTimeSlot]);
  }

  // createEffect(() => console.log({ ...store.Mon }));

  return (
    <DayGridContainer
      ref={gridRef!}
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
            headerHeight={props.headerHeight}
            width={props.colWidth}
            minHour={props.minHour}
            maxHour={props.maxHour}
            theme={props.theme}
            palette={props.palette}
            onColumnClick={handleColumnClick}
            showOverlapConfirm={handleOverlap}
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

      <Show when={createModalOpen() || mergeModalOpen()}>
        <MarkerOverlay
          onClick={(e) => {
            setCreateModalOpen(false);
            setMergeModalOpen(false);
          }}
        />
        <div
          id="modal"
          style={{
            position: "absolute",
            background: "lightblue",
            width: MODAL_WIDTH + "px",
            height: MODAL_HEIGHT + "px",
            "z-index": 50,
            top: posY + "px",
            left: posX + "px",
          }}
        >
          <Show when={createModalOpen()}>
            <button onclick={(e) => setCreateModalOpen(false)}>
              <FaSolidX />
            </button>
            <h1>Create modal</h1>
            <button
              onclick={(e) => {
                addNewTimeSlot(e);
                setCreateModalOpen(false);
              }}
            >
              <FaSolidCheck />
            </button>
          </Show>

          <Show when={mergeModalOpen()}>
            <button onclick={(e) => setMergeModalOpen(false)}>
              <FaSolidX />
            </button>
            <h1>Merge modal</h1>
            <button
              onclick={(e) => {
                addNewTimeSlot(e);
                setMergeModalOpen(false);
              }}
            >
              <FaSolidCheck />
            </button>
          </Show>
        </div>
      </Show>
    </DayGridContainer>
  );
};

export default DayGrid;
