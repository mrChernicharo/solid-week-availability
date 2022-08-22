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
  onTimeSlotHover: any;
}

export default function TimeSlot(props: ITimeSlotProps) {
  const [hover, setHover] = createSignal<string | null>(null);

  createEffect(() => {
    // console.log(hover());
    props.onTimeSlotHover(hover());
  });

  return (
    <TimeSlotContainer
      id={`timeSlot_${props.id}`}
      top={props.top}
      bottom={props.bottom}
      theme={props.theme}
      palette={props.palette}
      data-hover={hover()}
      onPointerDown={(e) => {
        // console.log("oooooh");
        // e.preventDefault();
      }}
      onPointerOut={(e) => setHover(null)}
    >
      <div class="timeSlot_content">
        <div
          class="top_resize_handle"
          onPointerOver={(e) => setHover(`${props.id}_top`)}
        ></div>
        <div
          class="middle"
          onPointerOver={(e) => setHover(`${props.id}_middle`)}
        >
          <div style={{ "pointer-events": "none" }}>
            <span>
              {readableTime(props.timeSlot.start, props.locale)} -
              {readableTime(props.timeSlot.end, props.locale)}
            </span>
          </div>
        </div>
        <div
          class="bottom_resize_handle"
          onPointerOver={(e) => setHover(`${props.id}_bottom`)}
        ></div>
      </div>
    </TimeSlotContainer>
  );
}
