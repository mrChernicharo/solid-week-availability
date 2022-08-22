import { createEffect, createSignal, For, ParentProps, Show } from "solid-js";
import { HALF_SLOT, MARKER_TIME } from "../../lib/constants";
import {
  findOverlappingSlots,
  getElementRect,
  localizeWeekday,
  readableTime,
  timeToYPos,
  yPosToTime,
} from "../../lib/helpers";
import {
  IColumnClick,
  IDayName,
  IPalette,
  IPointerEvent,
  IPos,
  ITimeSlot,
} from "../../lib/types";
import { DayColumnContainer, Marker } from "./DayColumnStyles";
import { FaSolidPlus } from "solid-icons/fa";
import { unwrap } from "solid-js/store";
import { DefaultTheme } from "solid-styled-components";
interface ITimeSlotProps extends ParentProps {
  id: string;
  top: number;
  bottom: number;
  timeSlot: ITimeSlot;
  locale: string;
}
interface IProps {
  day: IDayName;
  locale: string;
  colIdx: number;
  minHour: number;
  maxHour: number;
  timeSlots: ITimeSlot[];
  palette: IPalette;
  width: number;
  height: number;
  headerHeight: number;
  theme: DefaultTheme;

  clickedOut: () => void;
  showTimeSlotModal: () => void;
  showOverlapConfirm: () => void;
  onColumnClick: (e: IPointerEvent, obj: IColumnClick) => void;
  // columnHeight: number;
}

const ICON_SIZE = 16;

const TimeSlot = (props: ITimeSlotProps) => {
  // timeToYPos(props.timeSlot.start);
  // console.log("timeslot", { ...props });

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
        {readableTime(props.timeSlot.start, props.locale)} -
        {readableTime(props.timeSlot.end, props.locale)}
      </span>
    </div>
  );
};

const DayColumn = (props: IProps) => {
  let columnRef: HTMLDivElement;
  let timeout;

  const rect = () => getElementRect(columnRef);

  const [clickedPos, setClickedPos] = createSignal<IPos | null>(null);

  const getOverlappingSlots = (clickTime: number) =>
    findOverlappingSlots(clickTime, clickTime, props.timeSlots);

  const getSlotsNearby = (clickTime: number) =>
    findOverlappingSlots(
      clickTime - HALF_SLOT,
      clickTime + HALF_SLOT,
      props.timeSlots
    );

  const getTime = () =>
    yPosToTime(
      clickedPos()?.y!, // offsetY gets click pos relative to clicked node
      props.minHour,
      props.maxHour,
      rect().height
    );

  createEffect(() => {
    // console.log(clickedPos());
    // setClickedPos(null);
    // console.log({ ...props });
  });

  function handlePointerDown(e: IPointerEvent) {
    console.log("pointerDown", { pos: clickedPos(), e });

    setClickedPos({
      x: e.offsetX,
      y: e.offsetY,
    });

    const clickTime = () => getTime();

    let clickedOnExistingSlot = false;
    if (getOverlappingSlots(clickTime()).length) {
      clickedOnExistingSlot = true;
    } else if (getSlotsNearby(clickTime()).length) {
      props.showOverlapConfirm();
    }

    // columnClick marker
    const colClick: IColumnClick = {
      minutes: clickTime(),
      pos: clickedPos()!,
      day: props.day,
      colIdx: props.colIdx,
      clickedSlots: unwrap(getOverlappingSlots(clickTime())),
      clickedOnExistingSlot,
      nearbySlots: [...unwrap(getSlotsNearby(clickTime()))],
    };
    props.onColumnClick(e, colClick);

    // make X icon disappear
    clearTimeout(timeout);
    timeout = setTimeout(() => setClickedPos(null), MARKER_TIME);
  }

  function handlePointerUp(e: IPointerEvent) {
    const clickTime = () => getTime();

    if (getOverlappingSlots(clickTime()).length) {
      props.showTimeSlotModal();
    }

    props.clickedOut();
  }

  return (
    <DayColumnContainer
      ref={columnRef!}
      height={props.height}
      width={props.width}
      theme={props.theme}
      palette={props.palette}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      data-cy={`day_column_${props.day}`}
      idx={props.colIdx}
    >
      {localizeWeekday(props.day as IDayName, props.locale, "long")}
      {/* X Marker */}
      <Show when={clickedPos() !== null}>
        {() => {
          const [x, y] = [
            () => Math.round((clickedPos()?.x || 0) - (ICON_SIZE / 2 - 2)),
            () => Math.round((clickedPos()?.y || 0) - (ICON_SIZE / 2 - 1)),
          ];

          return (
            <Marker x={x()} y={y()} iconSize={ICON_SIZE}>
              <FaSolidPlus size={ICON_SIZE} />
            </Marker>
          );
        }}
      </Show>

      {/* TimeSlots */}
      <For each={props.timeSlots}>
        {(slot: ITimeSlot) => (
          <TimeSlot
            id={`timeSlot_${slot.id}`}
            top={timeToYPos(
              slot.start,
              props.minHour,
              props.maxHour,
              props.height
            )}
            bottom={timeToYPos(
              slot.end,
              props.minHour,
              props.maxHour,
              props.height
            )}
            timeSlot={slot}
            locale={props.locale}
          ></TimeSlot>
        )}
      </For>
    </DayColumnContainer>
  );
};

export default DayColumn;
