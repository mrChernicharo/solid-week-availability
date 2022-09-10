import { DefaultTheme, styled } from "solid-styled-components";
import { SCROLL_BAR } from "../../lib/constants";
import { IPalette } from "../../lib/types";

interface IProps {
  id: string;
  top: number;
  left: number;
  width: number;
  bottom: number;
  theme: DefaultTheme;
  palette: IPalette;
  colWidth: number;
  // isActive: boolean;
}

const color = (props: IProps, color: string) => props.theme[props.palette][color];

const TimeSlotContainer = styled.div<IProps>`
  position: absolute;

  top: ${(props) => props.top + "px"};
  height: ${(props) => props.bottom - props.top + "px"};
  width: ${(props) => props.width + "px"};
  left: ${(props) => props.left + "px"};
  font-size: small;
  user-select: none;
  opacity: 0.8;
  transition: all 0.5s;

  .timeSlot_content {
    position: relative;
    height: 100%;
    background: dodgerblue;
    border-radius: 4px;

    .middle {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
      cursor: grab;

      /* z-index: 30; */

      .hour-text {
        text-align: center;
        width: 100%;
        white-space: normal;
        font-size: 12px;
        pointer-events: none;
      }
    }
    &.isActive {
      background: coral;

      .top_resize_handle,
      .bottom_resize_handle {
        transition: 0.5s;
        opacity: 0.8;
      }
    }
    .top_resize_handle,
    .bottom_resize_handle {
      position: absolute;
      border-radius: 50%;
      background: royalblue;
      /* border: 4px solid royalblue; */
      height: min(${(props) => props.colWidth / 3 + "px"}, 24px);
      width: min(${(props) => props.colWidth / 3 + "px"}, 24px);
      opacity: 0;
    }

    .top_resize_handle {
      top: 0;
      left: 10%;
      transform: translateY(max(${(props) => -props.colWidth / 6 + "px"}, -12px));
      cursor: n-resize;

      z-index: 12;
    }
    .bottom_resize_handle {
      bottom: 0;
      right: 10%;
      transform: translateY(min(${(props) => props.colWidth / 6 + "px"}, 12px));
      cursor: s-resize;

      z-index: 12;
    }
  }
`;

export { TimeSlotContainer };
/* opacity: ${(props) => (props.isActive ? 0.8 : 0)}; */
/* background: ${(props) => (props.isActive ? "coral" : "dodgerblue")}; */
