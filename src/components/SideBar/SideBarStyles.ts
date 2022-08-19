import { DefaultTheme, styled } from "solid-styled-components";
interface IProps {
  height: number;
  colWidth: number;
  theme: DefaultTheme;
  palette: "light" | "dark";
  itemCount: number;
}

const color = (props: IProps, color: string) =>
  props.theme[props.palette][color];

// border: 1px solid ${(props) => color(props, "primary")};

const SideBarContainer = styled.div<IProps>`
  width: ${(props) => props.colWidth + "px"};
  height: ${(props) => props.height + "px"};
  display: inline-block;
  position: sticky;
  left: 0;
  z-index: 5;
  background: ${(props) => color(props, "accent2")};
  opacity: 0.8;

  .hour {
    font-size: small;
    border-top: 1px solid ${(props) => color(props, "accent")};
    height: ${(props) => props.height / props.itemCount + "px"};
    display: flex;
    justify-content: center;
  }
`;

export { SideBarContainer };
