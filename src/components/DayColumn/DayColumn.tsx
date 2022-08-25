import { createEffect, createSignal, For, Show } from "solid-js";
import { HALF_SLOT, MARKER_TIME } from "../../lib/constants";
import { findOverlappingSlots, getElementRect, localizeWeekday, timeToYPos, yPosToTime } from "../../lib/helpers";
import { IWeekday, IPalette, IPointerEvent, IPos, ITimeSlot, ITouchEvent } from "../../lib/types";
import { DayColumnContainer, Marker } from "./DayColumnStyles";
import { FaSolidPlus } from "solid-icons/fa";
import { unwrap } from "solid-js/store";
import { DefaultTheme } from "solid-styled-components";
import TimeSlot from "../TimeSlot/TimeSlot";

// interface IProps {
//   day: IWeekday;
//   locale: string;
//   colIdx: number;
//   minHour: number;
//   maxHour: number;
//   timeSlots: ITimeSlot[];
//   palette: IPalette;
//   width: number;
//   height: number;
//   headerHeight: number;
//   theme: DefaultTheme;

const ICON_SIZE = 16;

const DayColumn = (props) => {
  let columnRef: HTMLDivElement;
  let clickMoment = 0;

  const rect = () => getElementRect(columnRef);

  function handlePointerDown(e) {
    clickMoment = Date.now();
  }
  function handleCancelableClick(e) {
    let clickFinish = Date.now();

    if (clickFinish - clickMoment < 500) {
      const y = Math.round(e.clientY - rect().top);
      const pos = {
        // x: e.offsetX,
        x: props.width * props.colIdx + props.width * 0.5 + e.offsetX,
        y,
        time: yPosToTime(y, props.minHour, props.maxHour, props.height),
      };

      props.onCancelableClick(e, props.day, pos, props.colIdx);
    }
  }

  createEffect(() => {
    // console.log(props.timeSlots);
  });

  return (
    <DayColumnContainer
      ref={columnRef!}
      height={props.height}
      width={props.width}
      theme={props.theme}
      palette={props.palette}
      onClick={handleCancelableClick}
      onPointerDown={handlePointerDown}
      data-cy={`day_column_${props.day}`}
      idx={props.colIdx}
      style={{ "touch-action": props.isDragging ? "none" : "manipulate" }}
    >
      {/* <div style={{ "pointer-events": "none" }}>{localizeWeekday(props.day as IWeekday, props.locale, "long")}</div> */}
      {/* X Marker */}
      {/* <Show when={clickedPos() !== null}>
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
      </Show> */}

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
            onSlotClick={props.onSlotClick}
            width={props.width}
          ></TimeSlot>
        )}
      </For>
    </DayColumnContainer>
  );
};

export default DayColumn;
