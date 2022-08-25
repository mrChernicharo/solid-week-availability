import { DefaultTheme, styled } from "solid-styled-components";
import { SCROLL_BAR } from "../../lib/constants";
import { IPalette } from "../../lib/types";

interface IProps {
  id: string;
  top: number;
  bottom: number;
  theme: DefaultTheme;
  palette: IPalette;
  colWidth: number;
}

const color = (props: IProps, color: string) => props.theme[props.palette][color];

const TimeSlotContainer = styled.div<IProps>`
  position: absolute;

  top: ${(props) => props.top + "px"};
  height: ${(props) => props.bottom - props.top + "px"};
  width: 100%;
  background: dodgerblue;
  /* opacity: 0.8; */
  font-size: small;
  user-select: none;

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
      border-radius: 50%;
      height: min(${(props) => props.colWidth / 3 + "px"}, 32px);
      width: min(${(props) => props.colWidth / 3 + "px"}, 32px);
      background: blue;
    }

    .top_resize_handle {
      top: 0;
      left: 10%;
      /* transform: translateY(-16px); */
      transform: translateY(max(${(props) => -props.colWidth / 6 + "px"}, -16px));

      z-index: 12;
    }
    .bottom_resize_handle {
      bottom: 0;
      right: 10%;
      transform: translateY(min(${(props) => props.colWidth / 6 + "px"}, 16px));

      z-index: 12;
    }
  }
`;

export { TimeSlotContainer };
