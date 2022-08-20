import {
  createEffect,
  createSignal,
  For,
  ParentProps,
  PropsWithChildren,
  Show,
} from "solid-js";
import { HALF_SLOT, MARKER_TIME } from "../../lib/constants";
import {
  findOverlappingSlots,
  getElementRect,
  readableTime,
  timeToYPos,
  yPosToTime,
} from "../../lib/helpers";
import { IPointerEvent, IPos, ITimeSlot } from "../../lib/types";
import { DayColumnContainer } from "./DayColumnStyles";
import { FaSolidPlus } from "solid-icons/fa";
import { unwrap } from "solid-js/store";

interface IProps extends ParentProps {
  id: string;
  timeSlot: ITimeSlot;
  top: number;
  bottom: number;
  locale: string;
  // minHour: number;
  // maxHour: number;
  // columnHeight: number;
}

const ICON_SIZE = 16;

const TimeSlot = (props: IProps) => {
  // timeToYPos(props.timeSlot.start);
  // console.log("timeslot", { ...props });
  readableTime(props.timeSlot.start, props.locale);

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: props.bottom - props.top + "px",
        background: "lightgreen",
        top: props.top + "px",
        "pointer-events": "none",
        opacity: 0.8,
      }}
    >
      <span style={{ "font-size": "small" }}>
        {readableTime(props.timeSlot.start, props.locale)} -{" "}
        {readableTime(props.timeSlot.end, props.locale)}
      </span>
    </div>
  );
};

const DayColumn = (props) => {
  let columnRef: HTMLDivElement;
  let timeout;
  let prevClickPos: IPos;
  const rect = () => getElementRect(columnRef);

  const [clickedPos, setClickedPos] = createSignal<IPos | null>(null);

  createEffect(() => {
    setClickedPos(null);
  });

  function handleClick(e: IPointerEvent) {
    setClickedPos({
      x: e.offsetX,
      y: e.offsetY,
    });

    const clickTime = yPosToTime(
      e.offsetY, // offsetY gets click pos relative to clicked node
      props.minHour,
      props.maxHour,
      rect().height
    );

    const overlappingSlots = findOverlappingSlots(
      clickTime,
      clickTime,
      props.timeSlots
    );
    const slotsNearby = findOverlappingSlots(
      clickTime - HALF_SLOT,
      clickTime + HALF_SLOT,
      props.timeSlots
    );

    let clickedOnExistingSlot = false;
    if (overlappingSlots.length) {
      clickedOnExistingSlot = true;
    } else if (slotsNearby.length) {
      props.showOverlapConfirm();
    }
    console.log({ clickTime, slotsNearby, overlappingSlots });

    if (clickedPos() !== null) prevClickPos = clickedPos()!;

    // columnClick marker
    clearTimeout(timeout);
    timeout = setTimeout(() => setClickedPos(null), MARKER_TIME);
    props.onColumnClick(e, {
      minutes: clickTime,
      pos: clickedPos(),
      day: props.day,
      idx: props.idx,
      clickedOnExistingSlot,
      nearbySlots: [...unwrap(slotsNearby)],
    });
  }

  return (
    <DayColumnContainer
      ref={columnRef!}
      height={props.height}
      width={props.width}
      theme={props.theme}
      palette={props.palette}
      onPointerDown={handleClick}
      data-cy={`day_column_${props.day}`}
      idx={props.idx}
    >
      <Show when={clickedPos() !== null}>
        <div
          style={{
            position: "absolute",
            "z-index": 50,
            top:
              Math.round((clickedPos()?.y || 0) - (ICON_SIZE / 2 - 2)) + "px",
            left:
              Math.round((clickedPos()?.x || 0) - (ICON_SIZE / 2 - 1)) + "px",
            "pointer-events": "none",
          }}
        >
          <FaSolidPlus size={ICON_SIZE} />
        </div>
      </Show>

      <For each={props.timeSlots}>
        {(slot: ITimeSlot) => {
          const topPos = timeToYPos(
            slot.start,
            props.minHour,
            props.maxHour,
            props.height
          );
          const bottomPos = timeToYPos(
            slot.end,
            props.minHour,
            props.maxHour,
            props.height
          );

          return (
            <TimeSlot
              id={`timeSlot_${slot.id}`}
              top={topPos}
              bottom={bottomPos}
              timeSlot={slot}
              locale={props.locale}
            ></TimeSlot>
          );
        }}
      </For>
    </DayColumnContainer>
  );
};

export default DayColumn;
