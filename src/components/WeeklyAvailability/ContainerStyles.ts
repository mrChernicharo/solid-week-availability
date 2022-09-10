import { DefaultTheme, styled } from "solid-styled-components";
import { SCROLL_BAR } from "../../lib/constants";
import { IPalette } from "../../lib/types";

interface IProps {
  cols: string[];
  colWidth: number;
  // height: number;
  widgetHeight: number;
  headerHeight: number;
  colHeight: number;
  theme: DefaultTheme;
  palette: IPalette;
  colMinWidth: number;
}

const color = (props: IProps, color: string) => props.theme[props.palette][color];

const Container = styled.div<IProps>`
  /* border: 1px dashed ${(props) => color(props, "text")}; */
  background: ${(props) => color(props, "bg")};
  color: ${(props) => color(props, "text")};

  width: min(
    ${(props) => {
      if (props.widgetHeight + SCROLL_BAR >= props.colHeight + props.headerHeight) {
        return props.colWidth * (props.cols.length + 0.5) + "px";
      } else {
        return props.colWidth * (props.cols.length + 0.5) + SCROLL_BAR + 2 + "px";
      }
    }},
    96vw
  );
  height: ${(props) => props.widgetHeight + SCROLL_BAR + 2 + "px"};

  overflow: auto;
  margin: 0 auto;
  white-space: nowrap;
  display: flex;
  flex-direction: column;

  .columns-wrapper {
    display: inline-flex;
    width: ${(props) => props.colMinWidth * (props.cols.length + 0.5) + "px"};
  }

  @media (min-width: ${(props) => props.colWidth * (props.cols.length + 0.5) * 1.04 + "px"}) {
    height: ${(props) => props.widgetHeight + "px"};
  }
`;
export { Container };
