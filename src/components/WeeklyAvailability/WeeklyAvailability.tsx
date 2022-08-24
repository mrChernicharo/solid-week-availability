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
    modal: "closed",
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

  ///// *************** *************** *************** *************** /////
  {
    // function handlePointerUp(e) {
  }

  function handlePointerDown(e) {
    // console.log(
    //   "handlePointerDown"
    //   );
    // e,
    // e.path,
    // e.path.map((el) => el.id),
    // Array.from(e.path).filter((el) => "timeSlot_".includes(el.id))
    // { el: [...e.path].find((el) => "timeSlot_".match(el.id)) }
    // if overTimeslot
    // const y = Math.round(e.clientY - rect().top);
    // if (getOverlappingSlots(clickTime).length) {
    // setStore("gesture", "drag:ready");
    // }
  }

  function _handleColumnClick(e, day, pos, colIdx) {
    setStore("lastPos", pos);
    setStore("day", day);

    if (store.modal === "closed") {
      if (getOverlappingSlots(pos.time).length) {
        setStore("modal", "details");
        return;
      }
      if (getNearbySlots(pos.time).length) {
        setStore("modal", "merge");
        return;
      }
      setStore("modal", "create");
    }
  }

  function _handleSlotClick(e, slot) {
    console.log("_handleSlotClick", { e, slot });
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

    if (timeDiff !== 0) {
      if (store.gesture === "drag:top") {
        [slotStart, slotEnd] = [start + timeDiff, end];
      }
      if (store.gesture === "drag:bottom") {
        [slotStart, slotEnd] = [start, end + timeDiff];
      }
      if (store.gesture === "drag:middle") {
        [slotStart, slotEnd] = [start + timeDiff, end + timeDiff];
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

  function handleDragEnd(e) {
    console.log("pointerUp", e);
    setStore("gesture", "idle");
    // setStore("slotId", null);
  }

  createEffect(() => {
    props.onChange(store);
    console.log(store.gesture);
  });

  onMount(() => {
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("pointerup", handleDragEnd);
    document.addEventListener("touchend", handleDragEnd);

    // document.addEventListener("touchend", handleTouchEnd);
    // document.addEventListener("click", handleClick);
    // document.addEventListener("pointercancel", handlePointerCancel);
    // document.addEventListener("touchstart", handleTouchStart);
  });
  onCleanup(() => {
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerdown", handlePointerDown);
    document.removeEventListener("pointerup", handleDragEnd);
    document.removeEventListener("touchend", handleDragEnd);

    // document.removeEventListener("pointercancel", handlePointerCancel);
    // document.removeEventListener("click", handleClick);
    // document.addEventListener("touchstart", handleTouchStart);
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
            "touch-action": store.gesture !== "idle" ? "none" : "unset",
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
          <Show when={store.modal !== "closed"}>
            <Modal
              type={store.modal}
              lastPos={store.lastPos}
              day={store.day}
              slotId={store.slotId}
              theme={theme}
              palette={props.palette}
              onClose={() => setStore("modal", "closed")}
              onCreateTimeSlot={(newSlot) => {
                setStore(newSlot.day, (slots) => [...slots, newSlot]);
                setStore("day", newSlot.day);
                setStore("slotId", newSlot.id);
              }}
              onMergeTimeSlots={(newSlot: ITimeSlot) => {
                setStore(store.day, getMergedTimeslots(newSlot, store[store.day]));
                setStore("day", newSlot.day);
                setStore("slotId", newSlot.id);
              }}
            />
          </Show>
        </div>
      </Container>
    </Show>
  );
};

export default WeeklyAvailability;
