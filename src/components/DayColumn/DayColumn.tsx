import { createEffect, For } from "solid-js";
import { getElementRect, timeToYPos, yPosToTime } from "../../lib/helpers";
import { ITimeSlot } from "../../lib/types";
import { DayColumnContainer } from "./DayColumnStyles";
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
// onSlotHover
// }

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
      style={{ "touch-action": props.isDragging ? "none" : "" }}
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
            width={props.width * 0.9}
            left={props.width * 0.05}
            id={slot.id}
            timeSlot={slot}
            locale={props.locale}
            theme={props.theme}
            palette={props.palette}
            onSlotClick={props.onSlotClick}
            onSlotHover={(slot) => props.onSlotHover(slot, props.day)}
          ></TimeSlot>
        )}
      </For>
    </DayColumnContainer>
  );
};

export default DayColumn;
