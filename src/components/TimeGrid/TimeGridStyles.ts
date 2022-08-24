import { DefaultTheme, styled } from "solid-styled-components";
import { IPalette } from "../../lib/types";

interface IProps {
  cols: string[];
  colWidth: number;
  colHeight: number;
  itemCount: number;
  theme: DefaultTheme;
  palette: IPalette;
}

const color = (props: IProps, color: string) => props.theme[props.palette][color];

const TimeGridContainer = styled.div<IProps>`
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

export { TimeGridContainer };
