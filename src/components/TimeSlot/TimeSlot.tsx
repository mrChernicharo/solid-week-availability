import { createEffect, createSignal, onCleanup, onMount, ParentProps } from "solid-js";
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
  let mounted = false;
  let ref;

  const [isActive, setIsActive] = createSignal(mounted ? true : false);

  function handlePointerDown(e) {
    if (e.buttons === 2) return; // no right click
    props.onSlotClick(e, props.timeSlot);
  }

  function handleHover(e) {
    if (!isActive()) setIsActive(true);
  }

  function handleHoverEnd(e) {
    setIsActive(false);
  }

  onMount(() => {
    mounted = true;
  });

  createEffect(() => {
    ref.addEventListener("pointermove", handleHover);
    ref.addEventListener("pointerleave", handleHoverEnd);
  });

  onCleanup(() => {
    ref.removeEventListener("pointermove", handleHover);
    ref.removeEventListener("pointerleave", handleHoverEnd);
  });

  return (
    <TimeSlotContainer
      ref={ref}
      id={`timeSlot_${props.id}`}
      top={props.top}
      left={props.left}
      width={props.width}
      bottom={props.bottom}
      theme={props.theme}
      palette={props.palette}
      onPointerDown={handlePointerDown}
      colWidth={props.width}
    >
      <div classList={{ timeSlot_content: true, isActive: isActive() }}>
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
