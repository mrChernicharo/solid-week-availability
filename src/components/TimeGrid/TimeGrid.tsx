import {
  FaSolidBrazilianRealSign,
  FaSolidCalendarPlus,
  FaSolidCheck,
  FaSolidLayerGroup,
  FaSolidNoteSticky,
  FaSolidPaperclip,
  FaSolidX,
} from "solid-icons/fa";
import { createEffect, createSignal, For, on, onCleanup, onMount, Show } from "solid-js";
import { createStore, SetStoreFunction, unwrap } from "solid-js/store";
import {
  findOverlappingSlots,
  getElementRect,
  getLocaleHours,
  getMergedTimeslots,
  getWeekDays,
  localizeWeekday,
  readableTime,
  yPosToTime,
} from "../../lib/helpers";
import { IWeekday, IPalette, IPointerEvent, IPos, IStore, ITimeSlot } from "../../lib/types";
import DayColumn from "../DayColumn/DayColumn";
import { TimeGridContainer } from "./TimeGridStyles";
import idMaker from "@melodev/id-maker";
import { DefaultTheme } from "solid-styled-components";

interface IProps {
  cols: IWeekday[];
  minHour: number;
  maxHour: number;
  locale: string;
  colWidth: number;
  colHeight: number;
  headerHeight: number;
  widgetHeight: number;
  firstDay: IWeekday;
  theme: DefaultTheme;
  palette: IPalette;
  timeSlots: { [k: string]: ITimeSlot[] };
  currentDay: IWeekday;
  currentGesture: "idle" | "drag:ready" | "drag:middle" | "drag:top" | "drag:bottom";
  onColumnClick: (e, day, pos, colIdx) => void;
  onSlotClick: (e: any, slot: ITimeSlot) => void;
  onSlotHover: (slot: ITimeSlot, day: IWeekday) => void;
}

const TimeGrid = (props: IProps) => {
  let gridRef: HTMLDivElement;

  // const rect = () => getElementRect(gridRef);

  const HOURS = () => getLocaleHours(props.minHour, props.maxHour, props.locale);

  function handleColumnClick(e, day, pos, colIdx) {
    props.onColumnClick(e, day, pos, colIdx);
  }
  {
    // function updateModalState() {
    //   const widgetEl = () => document.querySelector("#widget_root_element");
    //   const wRect = () => getElementRect(widgetEl() as HTMLDivElement);
    //   const scrollOffsetY = widgetEl()?.scrollTop || 0;
    //   const scrollOffsetX = widgetEl()?.scrollLeft || 0;
    //   modalPos.x = columnClick.pos.x + props.colWidth * columnClick.colIdx;
    //   modalPos.x = modalPos.x - scrollOffsetX < wRect().width / 2 ? modalPos.x : modalPos.x - MODAL_WIDTH;
    //   modalPos.y = columnClick.pos.y;
    //   modalPos.y = modalPos.y < wRect().height / 2 + scrollOffsetY ? modalPos.y : modalPos.y - MODAL_HEIGHT;
    //   if (columnClick.clickedOnExistingSlot) {
    //     // console.log("WE HAVE OVERLAPPING TIMESLOTS!");
    //     setStore("gesture", "drag:ready");
    //     return;
    //   }
    //   if (!mergeModalOpen()) setCreateModalOpen(true);
    // }
    // createEffect(() => {});
  }

  return (
    <TimeGridContainer
      ref={gridRef!}
      cols={props.cols}
      colHeight={props.colHeight}
      colWidth={props.colWidth}
      theme={props.theme}
      palette={props.palette}
      itemCount={HOURS().length}
      data-cy="day_grid"
    >
      {/* DAY COLUMNS */}
      <For each={props.cols}>
        {(col: IWeekday, i) => (
          <DayColumn
            day={col}
            colIdx={i()}
            locale={props.locale}
            height={props.colHeight}
            headerHeight={props.headerHeight}
            width={props.colWidth}
            minHour={props.minHour}
            maxHour={props.maxHour}
            theme={props.theme}
            palette={props.palette}
            timeSlots={props.timeSlots[col]}
            onCancelableClick={handleColumnClick}
            onSlotClick={props.onSlotClick}
            onSlotHover={props.onSlotHover}
            isDragging={props.currentDay === col && props.currentGesture !== "idle"}
            // currentGesture={props.currentGesture}

            // onPointerDown={handlePointerDown}
            // onColumnClick={handleColumnClick}
            // showTimeSlotModal={() => setDetailsModalOpen(true)}
            // showOverlapConfirm={() => {
            //   setCreateModalOpen(false);
            //   setMergeModalOpen(true);
            // }}
          />
        )}
      </For>

      {/* GRID LINES */}
      <For each={HOURS()}>
        {(hour: string, i) => (
          <div
            class="grid-line"
            style={{ top: (props.colHeight / HOURS().length) * i() + "px" }}
            data-cy={`grid_line_${hour}`}
          />
        )}
      </For>
    </TimeGridContainer>
  );
};

export default TimeGrid;
