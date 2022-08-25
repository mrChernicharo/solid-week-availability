import { createEffect, createSignal, onCleanup, onMount, Show, splitProps } from "solid-js";
import { createStore, unwrap } from "solid-js/store";
import { useTheme } from "solid-styled-components";
import {
  findOverlappingSlots,
  getMergedTimeslots,
  getWeekDays,
  isMobile,
  mergeTimeslots,
  timeToYPos,
  yPosToTime,
} from "../../lib/helpers";
import { IWeekday, IStore, IPalette, ITimeSlot } from "../../lib/types";
import TimeGrid from "../TimeGrid/TimeGrid";
import SideBar from "../SideBar/SideBar";
import TopBar from "../TopBar/TopBar";
import { Container } from "./ContainerStyles";
import { HALF_SLOT, WEEKDAYS } from "../../lib/constants";
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
  minSnap: number;
  onChange: any;
  palette: IPalette;
}

const WeeklyAvailability = (props: IProps) => {
  const initialStore = {
    slotId: "",
    day: "Mon",
    gesture: "idle",
    lastPos: { x: 0, y: 0, time: props.minHour },
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
    findOverlappingSlots(clickTime - HALF_SLOT, clickTime + HALF_SLOT, store[store.day]);

  const isModalOpen = () =>
    store.modal.create || store.modal.merge || store.modal.details || store.modal.confirm || store.modal.drop;
  ///// *************** *************** *************** *************** /////

  function handlePointerDown(e) {}

  function handleTouchStart(e) {
    // console.log("handleTouchStart", { e });
  }

  function handlePointerCancel(e) {
    // setTimeout(() => e.preventDefault(), 100);
    // console.log("handlePointerCancel", { e });
  }

  function _handleColumnClick(e, day, pos, colIdx) {
    setStore("lastPos", pos);
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
      const actions = {
        top_resize_handle: "drag:top",
        bottom_resize_handle: "drag:bottom",
        middle: "drag:middle",
      };
      setStore("gesture", actions[e.srcElement.classList[0]]);
      return;
    }

    let slotStart, slotEnd;
    const timeDiff = yPosToTime(e.movementY, 0, props.maxHour - props.minHour, props.colHeight);
    const [day, id] = [store.day, store.slotId];
    const { start, end } = getSlot(day, id)!;
    const [topLimit, bottomLimit] = [props.minHour * 60, props.maxHour * 60];

    if (timeDiff !== 0) {
      if (store.gesture === "drag:top") {
        [slotStart, slotEnd] = [start + timeDiff, end];
        if (slotStart < topLimit || slotStart > slotEnd - HALF_SLOT) return;
      }
      if (store.gesture === "drag:bottom") {
        [slotStart, slotEnd] = [start, end + timeDiff];
        if (slotEnd > bottomLimit || slotEnd < slotStart + HALF_SLOT) return;
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

    // console.log("drag");
  }

  function handleDragEnd() {
    const slot = getSlot(store.day, store.slotId);
    if (!slot || !slot.start) return;

    const overlapping = findOverlappingSlots(
      slot.start,
      slot.end,
      store[store.day].filter((s) => s.id !== slot.id)
    );

    if (overlapping.length > 0) {
      setStore("lastPos", { ...store.lastPos, time: slot.start + (slot.end - slot.start) });
      setStore("slotId", store.slotId);

      // if (store.modal.details) return;
      console.log(store.gesture);
      if (store.gesture !== "idle" && store.gesture !== "drag:ready") {
        // setStore("modal", "details", true);
        setStore("modal", "drop", true);
      }
    }

    setStore("gesture", "idle");
  }

  function handleModalClose(closeAction: "create" | "merge" | "details" | "confirm" | "drop" | "overlay") {
    console.log(closeAction);
    if (closeAction === "overlay") {
      // @ts-ignore
      ["drop", "confirm", "create", "merge", "details"].forEach((action) => setStore("modal", action, false));
    } else {
      setStore("modal", closeAction, false);
    }
  }

  function handleCreateNewTimeSlot(newSlot) {
    setStore(newSlot.day, (slots) => [...slots, newSlot]);
    setStore("modal", "create", false);
  }

  function handleMergeSlots(newSlot: ITimeSlot) {
    console.log("handleMergeSlots", newSlot);
    const merged = getMergedTimeslots(newSlot, store[store.day]);
    setStore(store.day, merged);
  }

  function handleTimeSlotChange(newTime: number, slotIdx: number, time: "start" | "end") {
    setStore(store.day, slotIdx, time, newTime);
  }

  function handleDetailsModalConfirm(e, slot) {
    console.log("handleDetailsModalClose", slot);

    const overlapping = findOverlappingSlots(slot.start, slot.end, store[store.day]).filter((s) => s.id !== slot.id);

    if (overlapping.length) {
      setStore("modal", "confirm", true);
    }
  }

  createEffect(() => {
    props.onChange(store);
    // console.log(store.gesture);
  });
  onMount(() => {
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("pointerup", handleDragEnd);
    document.addEventListener("touchend", handleDragEnd);

    // document.addEventListener("click", handleClick);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("pointercancel", handlePointerCancel);
  });
  onCleanup(() => {
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerdown", handlePointerDown);
    document.removeEventListener("pointerup", handleDragEnd);
    document.removeEventListener("touchend", handleDragEnd);

    // document.removeEventListener("click", handleClick);
    document.removeEventListener("touchstart", handleTouchStart);
    document.removeEventListener("pointercancel", handlePointerCancel);
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
            "touch-action": store.gesture !== "idle" ? "none" : "manipulation",
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
            // onChange={() => {
            //   // props.onChange(store);
            // }}
          />
          <Show when={isModalOpen()}>
            {() => {
              const slot = () => getSlot(store.day, store.slotId)!;
              return (
                <Modal
                  // slotId={store.slotId}
                  openedModals={Object.keys(store.modal).filter((t) => store.modal[t])}
                  lastPos={store.lastPos}
                  day={store.day}
                  maxHour={props.maxHour}
                  minHour={props.minHour}
                  slot={slot()}
                  slotIdx={store[store.day].findIndex((s) => s.id === slot()!.id) || 0}
                  theme={theme}
                  headerHeight={props.headerHeight}
                  colWidth={props.colMinWidth}
                  palette={props.palette}
                  onClose={handleModalClose}
                  onCreateTimeSlot={handleCreateNewTimeSlot}
                  onMergeTimeSlots={handleMergeSlots}
                  onSlotTimeChange={handleTimeSlotChange}
                  onDetailsConfirm={handleDetailsModalConfirm}
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
