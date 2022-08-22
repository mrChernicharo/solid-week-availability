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
}

export default function TimeSlot(props: ITimeSlotProps) {
  const [hover, setHover] = createSignal("middle");

  createEffect(() => {
    console.log(hover());
  });

  return (
    <TimeSlotContainer
      id={`timeSlot_${props.id}`}
      top={props.top}
      bottom={props.bottom}
      theme={props.theme}
      palette={props.palette}
      data-hover={hover()}
    >
      <div class="timeSlot_content">
        <div
          class="top_resize_handle"
          onPointerOver={(e) => setHover("top")}
        ></div>
        <div class="middle" onPointerOver={(e) => setHover("middle")}>
          {readableTime(props.timeSlot.start, props.locale)} -
          {readableTime(props.timeSlot.end, props.locale)}
        </div>
        <div
          class="bottom_resize_handle"
          onPointerOver={(e) => setHover("bottom")}
        ></div>
      </div>
    </TimeSlotContainer>
  );
}
