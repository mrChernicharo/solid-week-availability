import { createEffect, createSignal, For, Show } from "solid-js";
import { HALF_SLOT, MARKER_TIME } from "../../lib/constants";
import { findOverlappingSlots, getElementRect, localizeWeekday, timeToYPos, yPosToTime } from "../../lib/helpers";
import { IColumnClick, IWeekday, IPalette, IPointerEvent, IPos, ITimeSlot, ITouchEvent } from "../../lib/types";
import { DayColumnContainer, Marker } from "./DayColumnStyles";
import { FaSolidPlus } from "solid-icons/fa";
import { unwrap } from "solid-js/store";
import { DefaultTheme } from "solid-styled-components";
import TimeSlot from "../TimeSlot/TimeSlot";

interface IProps {
  day: IWeekday;
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
}

const ICON_SIZE = 16;

const DayColumn = (props: IProps) => {
  let columnRef: HTMLDivElement;
  let timeout;

  const rect = () => getElementRect(columnRef);

  const [clickedPos, setClickedPos] = createSignal<IPos | null>(null);

  const getClickedTime = () =>
    yPosToTime(
      clickedPos()?.y!, // offsetY gets click pos relative to clicked node
      props.minHour,
      props.maxHour,
      rect().height
    );

  const getOverlappingSlots = (clickTime: number) => findOverlappingSlots(clickTime, clickTime, props.timeSlots);

  const getSlotsNearby = (clickTime: number) =>
    findOverlappingSlots(clickTime - HALF_SLOT, clickTime + HALF_SLOT, props.timeSlots);

  function handlePointerDown(e: IPointerEvent) {
    setClickedPos({
      x: e.offsetX,
      y: e.clientY - rect().top,
    });

    const clickTime = () => getClickedTime();

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

    console.log(e);
    props.onColumnClick(e, colClick);

    // make X icon disappear
    clearTimeout(timeout);
    timeout = setTimeout(() => setClickedPos(null), MARKER_TIME);
  }

  function handlePointerUp(e: IPointerEvent | ITouchEvent) {
    console.log(e);

    const clickTime = () => getClickedTime();

    if (getOverlappingSlots(clickTime()).length) {
      props.showTimeSlotModal();
    }

    props.clickedOut();
  }

  createEffect(() => {
    // console.log({ ...props });
  });

  return (
    <DayColumnContainer
      ref={columnRef!}
      height={props.height}
      width={props.width}
      theme={props.theme}
      palette={props.palette}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onTouchEnd={handlePointerUp}
      data-cy={`day_column_${props.day}`}
      idx={props.colIdx}
    >
      <div style={{ "pointer-events": "none" }}>{localizeWeekday(props.day as IWeekday, props.locale, "long")}</div>
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
            top={timeToYPos(slot.start, props.minHour, props.maxHour, props.height)}
            bottom={timeToYPos(slot.end, props.minHour, props.maxHour, props.height)}
            id={slot.id}
            timeSlot={slot}
            locale={props.locale}
            theme={props.theme}
            palette={props.palette}
          ></TimeSlot>
        )}
      </For>
    </DayColumnContainer>
  );
};

export default DayColumn;
