import { DefaultTheme, styled } from "solid-styled-components";

interface IProps {
  theme: DefaultTheme;
  palette: "light" | "dark";
}

const color = (props: IProps, color: string) =>
  props.theme[props.palette][color];

const Container = styled.div<IProps>`
  border: 1px solid ${(props) => color(props, "primary")};
  background: ${(props) => color(props, "bg")};
  color: ${(props) => color(props, "text")};
`;
export { Container };
