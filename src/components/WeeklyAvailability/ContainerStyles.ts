import { DefaultTheme, styled } from "solid-styled-components";
import { SCROLL_BAR } from "../../lib/constants";

interface IProps {
  cols: string[];
  colWidth: number;
  height: number;
  widgetHeight: number;
  theme: DefaultTheme;
  palette: "light" | "dark";
}

const color = (props: IProps, color: string) =>
  props.theme[props.palette][color];

const Container = styled.div<IProps>`
  border: 1px dashed ${(props) => color(props, "text")};
  background: ${(props) => color(props, "bg")};
  color: ${(props) => color(props, "text")};

  width: min(
    ${(props) =>
      props.colWidth * (props.cols.length + 0.5) + SCROLL_BAR + "px"},
    96vw
  );
  height: ${(props) => props.widgetHeight + SCROLL_BAR + "px"};
  overflow: auto;
  margin: 0 auto;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
`;
export { Container };
