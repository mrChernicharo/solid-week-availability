import { createEffect, createSignal, onCleanup, onMount, Show, splitProps } from "solid-js";
import { createStore, unwrap } from "solid-js/store";
import { useTheme } from "solid-styled-components";
import {
  findOverlappingSlots,
  getMergedTimeslots,
  getWeekDays,
  isMobile,
  mergeTimeslots,
  snapTime,
  timeToYPos,
  yPosToTime,
} from "../../lib/helpers";
import { IWeekday, IStore, IPalette, ITimeSlot, IPointerEvent } from "../../lib/types";
import TimeGrid from "../TimeGrid/TimeGrid";
import SideBar from "../SideBar/SideBar";
import TopBar from "../TopBar/TopBar";
import { Container } from "./ContainerStyles";
import { WEEKDAYS } from "../../lib/constants";
import Modal from "../Modal/Modal";

interface IProps {
  locale: string;
  dayCols: IWeekday[];
  firstDay: IWeekday;
  open: boolean;
  minHour: number;
  maxHour: number;
  widgetHeight: number;
  headerHeight: number;
  colHeight: number;
  colMinWidth: number;
  snapTo: number;
  onChange: any;
  palette: IPalette;
}

const WeeklyAvailability = (props: IProps) => {
  const initialStore = {
    slotId: "",
    day: "Mon",
    gesture: "idle",
    lastPos: { x: 0, y: 0, time: props.minHour },
    lastWindowPos: { x: 0, y: 0 },
    modal: { create: false, merge: false, details: false, confirm: false, drop: false },
  };

  const theme = useTheme();

  const [store, setStore] = createStore(initialStore as IStore);
  for (let k of WEEKDAYS) {
    setStore(k, []);
  }

  const allTimeSlots = () => {
    const copy = {};
    for (let k of WEEKDAYS) {
      copy[k] = store[k];
    }
    return copy;
  };
  const getSlot = (day: IWeekday, id: string) => store[day].find((s) => s.id === id);

  const getOverlappingSlots = (clickTime: number) => findOverlappingSlots(clickTime, clickTime, store[store.day]);
  const getNearbySlots = (clickTime: number) =>
    findOverlappingSlots(clickTime - props.snapTo, clickTime + props.snapTo, store[store.day]);

  const isModalOpen = () =>
    store.modal.create || store.modal.merge || store.modal.details || store.modal.confirm || store.modal.drop;

  function handlePointerDown(e) {}
  function handleTouchStart(e) {}

  function handlePointerCancel(e) {
    // setTimeout(() => e.preventDefault(), 100);
    setStore("gesture", "idle");
    e.preventDefault();
    // console.log("handlePointerCancel", { e });
  }

  ///// *************** *************** *************** *************** /////

  function _handleColumnClick(e: IPointerEvent, day, pos, colIdx) {
    // console.log("_handleColumnClick", e);
    setStore("lastPos", pos);
    setStore("lastWindowPos", { x: e.pageX, y: e.pageY });
    setStore("day", day);

    if (!isModalOpen()) {
      if (getOverlappingSlots(pos.time).length) {
        setStore("modal", "details", true);
        return;
      }
      if (getNearbySlots(pos.time).length) {
        setStore("modal", "merge", true);
        return;
      }
      setStore("modal", "create", true);
    }
  }

  function _handleSlotClick(e, slot) {
    // console.log("_handleSlotClick", { e, slot });
    if (store.gesture === "idle") {
      setStore("gesture", "drag:ready");
      setStore("slotId", slot.id);
      setStore("day", slot.day);
    }
  }

  function handlePointerMove(e) {
    if (store.gesture === "idle") return;

    if (store.gesture === "drag:ready") {
      const elClass = e.srcElement.classList[0] || "middle";

      const actions = {
        top_resize_handle: "drag:top",
        bottom_resize_handle: "drag:bottom",
        middle: "drag:middle",
      };

      setStore("gesture", actions[elClass]);
      return;
    }

    let slotStart, slotEnd, timeDiff;

    timeDiff = yPosToTime(e.movementY, 0, props.maxHour - props.minHour, props.colHeight);

    const [day, id] = [store.day, store.slotId];
    const { start, end } = getSlot(day, id)!;
    const [topLimit, bottomLimit] = [props.minHour * 60, props.maxHour * 60];

    if (timeDiff !== 0) {
      if (store.gesture === "drag:top") {
        [slotStart, slotEnd] = [start + timeDiff, end];
        if (slotStart < topLimit || slotStart > slotEnd - props.snapTo) return;
      }
      if (store.gesture === "drag:bottom") {
        [slotStart, slotEnd] = [start, end + timeDiff];
        if (slotEnd > bottomLimit || slotEnd < slotStart + props.snapTo) return;
      }
      if (store.gesture === "drag:middle") {
        [slotStart, slotEnd] = [start + timeDiff, end + timeDiff];
        if (slotStart < topLimit || slotEnd > bottomLimit) return;
      }

      const newSlot: ITimeSlot = {
        id,
        day,
        start: slotStart,
        end: slotEnd,
      };
      setStore(day, (prev) => [...prev.filter((s) => s.id !== id), newSlot]);
    }
  }

  function handlePointerUp(e) {
    // console.log("handlePointerUp", e);
    const slot = getSlot(store.day, store.slotId);
    if (!slot || !slot.start) return;

    if (["drag:middle", "drag:top", "drag:bottom"].includes(store.gesture)) {
      handleDragEnd(e, slot);
    }

    setStore("gesture", "idle");
  }

  function handleDragEnd(e, slot) {
    console.log("handleDragEnd", e);

    const snappedSlot: ITimeSlot = {
      id: slot.id,
      day: slot.day,
      start: snapTime(slot.start, props.snapTo),
      end: snapTime(slot.end, props.snapTo),
    };

    setStore(slot.day, (slots) => [...slots.filter((s) => s.id !== slot.id), snappedSlot]);

    const overlapping = findOverlappingSlots(
      slot.start,
      slot.end,
      store[store.day].filter((s) => s.id !== slot.id)
    );

    if (overlapping.length > 0) {
      setStore("lastPos", { ...store.lastPos, time: slot.start + (slot.end - slot.start) });
      setStore("slotId", store.slotId);

      if (store.gesture !== "idle" && store.gesture !== "drag:ready") {
        setStore("modal", "drop", true);
      }
    }
  }

  function handleModalClose(closeAction: "create" | "merge" | "details" | "confirm" | "drop" | "overlay") {
    // console.log("handleModalClose");
    if (closeAction === "overlay") {
      const actions = ["drop", "confirm", "create", "merge", "details"];
      // @ts-ignore
      actions.forEach((action) => setStore("modal", action, false));
    } else {
      setStore("modal", closeAction, false);
    }
  }

  function handle_createNewTimeSlot(newSlot: ITimeSlot) {
    console.log("handle_createNewTimeSlot", newSlot);
    setStore(newSlot.day, (slots) => [...slots, newSlot]);
    setStore("modal", "create", false);
  }

  function handleMergeSlots(newSlot: ITimeSlot) {
    // console.log("handleMergeSlots", newSlot);
    const merged = getMergedTimeslots(newSlot, store[store.day]);
    setStore(store.day, merged);
  }

  function handleTimeSlotDetailsChange(newTime: number, slotIdx: number, time: "start" | "end") {
    // console.log("handleTimeSlotDetailsChange");
    setStore(store.day, slotIdx, time, newTime);
  }

  function handleDetailsModalConfirm(e: IPointerEvent, slot) {
    // console.log("handleDetailsModalConfirm", slot);
    const overlapping = findOverlappingSlots(slot.start, slot.end, store[store.day]).filter((s) => s.id !== slot.id);

    if (overlapping.length) {
      setStore("modal", "confirm", true);
    }
  }

  function handleSlotDelete(slot: ITimeSlot) {
    // console.log(slot);
    setStore(store.day, (slots) => slots.filter((s) => s.id !== slot.id));
  }

  createEffect(() => {
    props.onChange(store);
    // console.log(store.gesture);
  });
  onMount(() => {
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("touchend", handlePointerUp);
    document.addEventListener("pointercancel", handlePointerCancel);
    // document.addEventListener("mousemove", handlePointerMove);
    // document.removeEventListener("touchmove", handlePointerMove);
    // document.addEventListener("contextmenu", (e) => e.preventDefault());
    // document.addEventListener("click", handleClick);
    // document.addEventListener("pointerdown", handlePointerDown);
    // document.addEventListener("touchstart", handleTouchStart);
  });
  onCleanup(() => {
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerup", handlePointerUp);
    document.removeEventListener("touchend", handlePointerUp);
    document.removeEventListener("pointercancel", handlePointerCancel);
    // document.removeEventListener("mousemove", handlePointerMove);
    // document.removeEventListener("touchmove", handlePointerMove);
    // document.removeEventListener("contextmenu", (e) => e.preventDefault());
    // document.removeEventListener("click", handleClick);
    // document.removeEventListener("pointerdown", handlePointerDown);
    // document.removeEventListener("touchstart", handleTouchStart);
  });

  const cols = () =>
    getWeekDays(props.dayCols, {
      firstDay: props.firstDay,
    }) as IWeekday[];

  return (
    <Show when={props.open}>
      <Container
        id="widget_root_element"
        theme={theme}
        palette={props.palette}
        cols={cols()}
        colWidth={props.colMinWidth}
        height={props.headerHeight + props.colHeight}
        widgetHeight={props.widgetHeight}
      >
        <TopBar
          cols={cols()}
          height={props.headerHeight}
          colWidth={props.colMinWidth}
          locale={props.locale}
          firstDay={props.firstDay}
          theme={theme}
          palette={props.palette}
        />
        <div
          data-cy="columns_wrapper"
          style={{
            display: "inline-flex",
            width: props.colMinWidth * (cols().length + 0.5) + "px",
          }}
        >
          <SideBar
            locale={props.locale}
            colHeight={props.colHeight}
            colWidth={props.colMinWidth}
            minHour={props.minHour}
            maxHour={props.maxHour}
            theme={theme}
            palette={props.palette}
          />
          <TimeGrid
            cols={cols()}
            firstDay={props.firstDay}
            minHour={props.minHour}
            maxHour={props.maxHour}
            colWidth={props.colMinWidth}
            colHeight={props.colHeight}
            headerHeight={props.headerHeight}
            widgetHeight={props.widgetHeight}
            theme={theme}
            palette={props.palette}
            locale={props.locale}
            timeSlots={allTimeSlots()}
            onColumnClick={_handleColumnClick}
            onSlotClick={_handleSlotClick}
            currentGesture={store.gesture}
            currentDay={store.day}
          />
          <Show when={isModalOpen()}>
            {() => {
              const slot = () => getSlot(store.day, store.slotId)!;
              return (
                <Modal
                  openedModals={Object.keys(store.modal).filter((t) => store.modal[t])}
                  lastPos={store.lastPos}
                  lastWindowPos={store.lastWindowPos}
                  day={store.day}
                  maxHour={props.maxHour}
                  minHour={props.minHour}
                  slot={slot()}
                  slotIdx={store[store.day].findIndex((s) => s.id === slot()!.id) || 0}
                  theme={theme}
                  snapTo={props.snapTo}
                  headerHeight={props.headerHeight}
                  colWidth={props.colMinWidth}
                  palette={props.palette}
                  onClose={handleModalClose}
                  onCreateTimeSlot={handle_createNewTimeSlot}
                  onMergeTimeSlots={handleMergeSlots}
                  onSlotTimeChange={handleTimeSlotDetailsChange}
                  onDetailsConfirm={handleDetailsModalConfirm}
                  onDeleteSlot={handleSlotDelete}
                />
              );
            }}
          </Show>
        </div>
      </Container>
    </Show>
  );
};

export default WeeklyAvailability;
