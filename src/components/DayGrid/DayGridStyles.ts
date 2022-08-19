import { DefaultTheme, styled } from "solid-styled-components";

interface IProps {
  cols: string[];
  colWidth: number;
  colHeight: number;
  theme: DefaultTheme;
  palette: "light" | "dark";
}

const color = (props: IProps, color: string) =>
  props.theme[props.palette][color];

// border: 1px solid ${(props) => color(props, "primary")};
const DayGridContainer = styled.div<IProps>`
  width: ${(props) => props.colWidth * props.cols.length + "px"};
  height: ${(props) => props.colHeight + "px"};
  display: inline-block;
`;

export { DayGridContainer };
