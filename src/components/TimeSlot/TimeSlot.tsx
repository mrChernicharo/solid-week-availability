import { createEffect, createSignal, ParentProps } from "solid-js";
import { DefaultTheme } from "solid-styled-components";
import { readableTime } from "../../lib/helpers";
import { IPalette, ITimeSlot } from "../../lib/types";
import { TimeSlotContainer } from "./TimeSlotStyles";

interface ITimeSlotProps extends ParentProps {
  id: string;
  top: number;
  bottom: number;
  timeSlot: ITimeSlot;
  locale: string;
  theme: DefaultTheme;
  palette: IPalette;
  onSlotClick: any;
  width: number;
}

export default function TimeSlot(props: ITimeSlotProps) {
  function handlePointerDown(e) {
    if (e.buttons === 2) return; // no right click
    props.onSlotClick(e, props.timeSlot);
  }

  createEffect(() => {
    // console.log(hover());
  });

  return (
    <TimeSlotContainer
      id={`timeSlot_${props.id}`}
      top={props.top}
      bottom={props.bottom}
      theme={props.theme}
      palette={props.palette}
      onPointerDown={handlePointerDown}
      colWidth={props.width}
    >
      <div class="timeSlot_content">
        <div class="top_resize_handle"></div>
        <div class="middle">
          <div style={{ "pointer-events": "none" }}>
            <span>
              {readableTime(props.timeSlot.start, props.locale)} - {readableTime(props.timeSlot.end, props.locale)}
            </span>
          </div>
        </div>
        <div class="bottom_resize_handle"></div>
      </div>
    </TimeSlotContainer>
  );
}
