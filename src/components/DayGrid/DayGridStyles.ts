import { DefaultTheme, styled } from "solid-styled-components";

interface IProps {
  cols: string[];
  colWidth: number;
  colHeight: number;
  theme: DefaultTheme;
  itemCount: number;
  palette: "light" | "dark";
}

interface IModalProps {
  id: string;
  width: number;
  height: number;
  top: number;
  left: number;
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

const ModalContainer = styled.div<IModalProps>`
  position: absolute;
  background: lightblue;
  width: ${(props) => props.width + "px"};
  height: ${(props) => props.height + "px"};
  z-index: 50;
  top: ${(props) => props.top + "px"};
  left: ${(props) => props.left + "px"};
`;

const MarkerOverlay = styled.div`
  position: fixed;
  width: 10000px;
  height: 10000px;
  opacity: 0.1;
  background: red;
  top: 0;
  left: 0;
  z-index: 30;
`;

export { DayGridContainer, ModalContainer, MarkerOverlay };
