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
      height: min(100%, 24px);
      /* border: 1px dashed red; */
      width: 50%;
      z-index: 10;
      transition: transform 0.3s;

      &:hover {
        background: orange;
      }
    }

    .top_resize_handle {
      top: 0;
      z-index: 12;
      &:hover,
      &:active {
        transform: scale(1.5);
        /* transform: translateY(-50%); */
      }
    }
    .bottom_resize_handle {
      bottom: 0;
      right: 0;
      z-index: 12;
      &:hover,
      &:active {
        transform: scale(1.5);
        /* transform: translateY(50%); */
      }
    }
  }
`;

export { TimeSlotContainer };
