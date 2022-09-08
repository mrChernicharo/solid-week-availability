import { DefaultTheme, styled } from "solid-styled-components";
import { IPalette } from "../../lib/types";

interface IProps {
  width: number;
  height: number;
  theme: DefaultTheme;
  palette: IPalette;
  idx: number;
}

interface IMarkerProps {
  x: number;
  y: number;
  iconSize: number;
}

const color = (props: IProps, color: string) => props.theme[props.palette][color];

const DayColumnContainer = styled.div<IProps>`
  border-left: 1px solid ${(props) => color(props, "primary")};
  width: ${(props) => props.width + "px"};
  height: ${(props) => props.height + "px"};
  display: inline-block;

  position: absolute;
  left: ${(props) => props.width * props.idx + "px"};
  z-index: 2;

  /* touch-action: none; */
`;

const Marker = styled.div<IMarkerProps>`
  position: absolute;
  z-index: 50;
  top: ${(props) => props.y + "px"};
  left: ${(props) => props.x + "px"};
  /* pointer-events: none; */
  user-select: none;
`;

export { DayColumnContainer, Marker };
