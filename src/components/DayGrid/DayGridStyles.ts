import { DefaultTheme, styled } from "solid-styled-components";

interface IProps {
  cols: string[];
  colWidth: number;
  colHeight: number;
  theme: DefaultTheme;
  itemCount: number;
  palette: "light" | "dark";
}

const color = (props: IProps, color: string) =>
  props.theme[props.palette][color];

const DayGridContainer = styled.div<IProps>`
  position: relative;
  width: ${(props) => props.colWidth * props.cols.length + "px"};
  height: ${(props) => props.colHeight + "px"};
  display: inline-block;
  border-bottom: 1px solid ${(props) => color(props, "primary")};

  .grid-line {
    position: absolute;
    width: ${(props) => props.colWidth * props.cols.length + "px"};
    height: 1px;
    background: ${(props) => color(props, "lightText")};
    z-index: 0;
  }
`;

const MarkerOverlay = styled.div`
  position: absolute;
  width: 100000px;
  height: 100000px;
  opacity: 0.1;
  background: red;
  top: -10000px;
  left: -10000px;
  z-index: 30;
`;

export { DayGridContainer, MarkerOverlay };
