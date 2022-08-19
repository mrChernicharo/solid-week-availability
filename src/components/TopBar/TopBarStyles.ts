import { DefaultTheme, styled } from "solid-styled-components";

interface IProps {
  theme: DefaultTheme;
  palette: "light" | "dark";
  height: number;
  colWidth: number;
  cols: string[];
}

const color = (props: IProps, color: string) =>
  props.theme[props.palette][color];

//   border: 1px solid ${(props) => color(props, "primary")};
const TopBarContainer = styled.div<IProps>`
  height: ${(props) => props.height + "px"};
  width: ${(props) => props.colWidth * (props.cols.length + 0.5) + "px"};
  display: inline-flex;
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${(props) => color(props, "primary2")};

  .shim {
    width: ${(props) => props.colWidth / 2 + "px"};
    height: ${(props) => props.height + "px"};
    display: inline-flex;
  }

  .weekday {
    border-left: 1px solid ${(props) => color(props, "accent")};
    width: ${(props) => props.colWidth + "px"};
    height: ${(props) => props.height + "px"};
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
`;

export { TopBarContainer };