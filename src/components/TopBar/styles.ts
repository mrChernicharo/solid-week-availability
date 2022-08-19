import { DefaultTheme, styled } from "solid-styled-components";

interface IProps {
  theme: DefaultTheme;
  palette: "light" | "dark";
  height: number;
  colWidth: number;
}

const color = (props: IProps, color: string) =>
  props.theme[props.palette][color];

const TopBarContainer = styled.div<IProps>`
  border: 1px solid ${(props) => color(props, "primary")};
  height: ${(props) => props.height + "px"};
  display: inline-flex;

  .shim {
    border: 1px solid ${(props) => color(props, "accent")};
    width: ${(props) => props.colWidth / 2 + "px"};
    height: 100%;
    display: inline-block;
  }

  .weekday {
    border: 1px solid ${(props) => color(props, "accent")};
    width: ${(props) => props.colWidth + "px"};
    height: 100%;
    display: inline-block;
  }
`;

export { TopBarContainer };
