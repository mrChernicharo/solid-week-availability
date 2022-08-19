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

// border: 1px solid ${(props) => color(props, "primary")};
const DayGridContainer = styled.div<IProps>`
  position: relative;
  width: ${(props) => props.colWidth * props.cols.length + "px"};
  height: ${(props) => props.colHeight + "px"};
  display: inline-block;

  .grid-line {
    position: absolute;
    width: ${(props) => props.colWidth * props.cols.length + "px"};
    height: 1px;
    background: ${(props) => color(props, "lightText")};
  }
`;
export { DayGridContainer };
