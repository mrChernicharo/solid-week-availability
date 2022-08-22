import { DefaultTheme, styled } from "solid-styled-components";
import { SCROLL_BAR } from "../../lib/constants";
import { IPalette } from "../../lib/types";

interface IProps {
  id: string;
  top: number;
  bottom: number;
  theme: DefaultTheme;
  palette: IPalette;
}

const color = (props: IProps, color: string) =>
  props.theme[props.palette][color];

const TimeSlotContainer = styled.div<IProps>`
  position: absolute;

  top: ${(props) => props.top + "px"};
  height: ${(props) => props.bottom - props.top + "px"};
  width: 100%;
  background: dodgerblue;
  /* pointer-events: none; */
  opacity: 0.8;
  font-size: small;

  .timeSlot_content {
    position: relative;
    height: 100%;

    .middle {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
    }
    .top_resize_handle,
    .bottom_resize_handle {
      position: absolute;
      height: min(33%, 16px);
      border: 1px dashed red;
      width: 100%;
      z-index: 10;
    }

    .top_resize_handle {
      top: 0;
      z-index: 12;
    }
    .bottom_resize_handle {
      bottom: 0;
      z-index: 12;
    }
  }
`;

export { TimeSlotContainer };
