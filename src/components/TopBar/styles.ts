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

const TopBarContainer = styled.div<IProps>`
  border: 1px solid ${(props) => color(props, "primary")};
  height: ${(props) => props.height + "px"};
  width: ${(props) => props.colWidth * (props.cols.length + 0.5) + "px"};
  display: inline-flex;
  position: sticky;
  top: 0;

  .shim {
    width: ${(props) => props.colWidth / 2 + "px"};
    height: 100%;
    display: inline-flex;
  }

  .weekday {
    border-left: 1px solid ${(props) => color(props, "accent")};
    width: ${(props) => props.colWidth + "px"};
    height: 100%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
`;

export { TopBarContainer };
