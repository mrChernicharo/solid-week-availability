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
  getHours,
  getMergedTimeslots,
  getWeekDays,
  localizeWeekday,
  readableTime,
  yPosToTime,
} from "../../lib/helpers";
import { IColumnClick, IWeekday, IPalette, IPointerEvent, IPos, IStore, ITimeSlot } from "../../lib/types";
import DayColumn from "../DayColumn/DayColumn";
import { TimeGridContainer } from "./TimeGridStyles";
import idMaker from "@melodev/id-maker";
import { DefaultTheme } from "solid-styled-components";
import { HALF_SLOT, MIN_SLOT_DURATION, MODAL_HEIGHT, MODAL_WIDTH } from "../../lib/constants";

// interface IProps {
//   cols: IWeekday[];
//   minHour: number;
//   maxHour: number;
//   locale: string;
//   colWidth: number;
//   colHeight: number;
//   headerHeight: number;
//   widgetHeight: number;
//   firstDay: IWeekday;
//   theme: DefaultTheme;
//   palette: IPalette;
//   onChange: (store: IStore) => void;
// }

const TimeGrid = (props) => {
  let gridRef: HTMLDivElement;

  // const rect = () => getElementRect(gridRef);

  const HOURS = () => getHours(props.minHour, props.maxHour, props.locale);

  function handleColumnClick(e, pos) {
    props.onColumnClick(e, pos);
  }
  {
    // function handlePointerMove(e) {
    //   if (store.gesture === "idle") return;
    //   if (store.gesture === "drag:ready") {
    //     const actions = {
    //       top_resize_handle: "drag:top",
    //       bottom_resize_handle: "drag:bottom",
    //       middle: "drag:middle",
    //     };
    //     setStore("gesture", actions[e.srcElement.classList[0]]);
    //     return;
    //   }
    //   const timeDiff = yPosToTime(e.movementY, 0, props.maxHour - props.minHour, props.colHeight);
    //   let slotStart, slotEnd;
    //   const { id, day, start, end } = store.slot!;
    //   if (timeDiff !== 0) {
    //     if (store.gesture === "drag:top") {
    //       [slotStart, slotEnd] = [start + timeDiff, end];
    //     }
    //     if (store.gesture === "drag:bottom") {
    //       [slotStart, slotEnd] = [start, end + timeDiff];
    //     }
    //     if (store.gesture === "drag:middle") {
    //       [slotStart, slotEnd] = [start + timeDiff, end + timeDiff];
    //     }
    //     const newSlot: ITimeSlot = {
    //       id,
    //       day,
    //       start: slotStart,
    //       end: slotEnd,
    //     };
    //     setStore("slot", newSlot);
    //     setStore(day as IWeekday, (prev) => [...prev.filter((s) => s.id !== id), newSlot]);
    //   }
    // }
    // function handleColumnClick(e: IPointerEvent, obj: IColumnClick) {
    //   // @ts-ignore
    //   columnClick = structuredClone(obj) || { ...obj };
    //   if (columnClick.clickedSlots.length) {
    //     setStore("slot", columnClick.clickedSlots.at(-1)!);
    //   } else {
    //     setStore("slot", null);
    //   }
    //   setStore("day", columnClick.day);
    //   updateModalState();
    //   props.onChange(store); // send state to parent element
    // }
    // function createNewTimeSlot() {
    //   const newTimeSlot: ITimeSlot = {
    //     id: idMaker(),
    //     start: columnClick.minutes - HALF_SLOT,
    //     end: columnClick.minutes + HALF_SLOT,
    //     day: columnClick.day,
    //   };
    //   return newTimeSlot;
    // }
    // function mergeSlots(newSlot: ITimeSlot) {
    //   const merged = getMergedTimeslots(newSlot, store[newSlot.day]);
    //   setStore(newSlot.day, merged);
    // }
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
            timeSlots={[]}
            onCancelableClick={handleColumnClick}

            // onPointerDown={handlePointerDown}
            // onColumnClick={handleColumnClick}
            // showTimeSlotModal={() => setDetailsModalOpen(true)}
            // showOverlapConfirm={() => {
            //   setCreateModalOpen(false);
            //   setMergeModalOpen(true);
            // }}
            // clickedOut={() => {
            //   setStore("gesture", "idle");

            //   if (store.slot) {
            //     const overlapping = findOverlappingSlots(store.slot!.start, store.slot!.end, store[col]).filter(
            //       (s) => s.id !== store.slot!.id
            //     );

            //     // console.log("call clickedOut", overlapping);
            //     if (overlapping.length > 0) {
            //       console.log("we have overlapping timeslots on this drop !");
            //       setMergeModalOpen(true);
            //     }
            //   }
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
