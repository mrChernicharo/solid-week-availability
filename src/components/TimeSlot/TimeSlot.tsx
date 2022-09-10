import { createEffect, createSignal, onMount, ParentProps } from "solid-js";
import { DefaultTheme } from "solid-styled-components";
import { readableTime } from "../../lib/helpers";
import { IPalette, ITimeSlot } from "../../lib/types";
import { TimeSlotContainer } from "./TimeSlotStyles";

interface ITimeSlotProps extends ParentProps {
  id: string;
  top: number;
  left: number;
  bottom: number;
  timeSlot: ITimeSlot;
  locale: string;
  theme: DefaultTheme;
  palette: IPalette;
  onSlotClick: any;
  width: number;
  onSlotHover;
  onSlotHoverEnd;
}

export default function TimeSlot(props: ITimeSlotProps) {
  function handlePointerDown(e) {
    if (e.buttons === 2) return; // no right click
    props.onSlotClick(e, props.timeSlot);
  }

  onMount(() => {
    document.getElementById(`timeSlot_${props.id}`)?.addEventListener("pointermove", (e) => {
      props.onSlotHover(props.timeSlot);
    });
    document.getElementById(`timeSlot_${props.id}`)?.addEventListener("pointerleave", (e) => {
      props.onSlotHoverEnd(props.timeSlot);
    });
  });

  return (
    <TimeSlotContainer
      id={`timeSlot_${props.id}`}
      top={props.top}
      left={props.left}
      width={props.width}
      bottom={props.bottom}
      theme={props.theme}
      palette={props.palette}
      onPointerDown={handlePointerDown}
      colWidth={props.width}
      isActive={props.timeSlot.isActive || false}
    >
      <div class="timeSlot_content">
        <div class="top_resize_handle"></div>
        <div class="middle">
          <div class="hour-text">
            {readableTime(props.timeSlot.start, props.locale)} - {readableTime(props.timeSlot.end, props.locale)}
          </div>
        </div>
        <div class="bottom_resize_handle"></div>
      </div>
    </TimeSlotContainer>
  );
}
