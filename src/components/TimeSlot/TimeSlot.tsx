import { ParentProps } from "solid-js";
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
  return (
    <TimeSlotContainer
      id={props.id}
      top={props.top}
      bottom={props.bottom}
      theme={props.theme}
      palette={props.palette}
    >
      <div class="timeslot_content">
        <div class="top_resize_handle"></div>
        <div class="middle">
          {readableTime(props.timeSlot.start, props.locale)} -
          {readableTime(props.timeSlot.end, props.locale)}
        </div>
        <div class="bottom_resize_handle"></div>
      </div>
    </TimeSlotContainer>
  );
}
