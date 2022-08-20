import { DefaultTheme, styled } from "solid-styled-components";

interface IProps {
  width: number;
  height: number;
  theme: DefaultTheme;
  palette: "light" | "dark";
  idx: number;
}

const color = (props: IProps, color: string) =>
  props.theme[props.palette][color];

const DayColumnContainer = styled.div<IProps>`
  border-left: 1px solid ${(props) => color(props, "primary")};
  width: ${(props) => props.width + "px"};
  height: ${(props) => props.height + "px"};
  display: inline-block;

  position: absolute;
  left: ${(props) => props.width * props.idx + "px"};
  z-index: 2;
`;

export { DayColumnContainer };
