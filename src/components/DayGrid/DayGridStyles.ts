import { DefaultTheme, styled } from "solid-styled-components";

interface IProps {
  cols: string[];
  colWidth: number;
  colHeight: number;
  itemCount: number;
  theme: DefaultTheme;
  palette: "light" | "dark";
}

interface IModalProps {
  id: string;
  width: number;
  height: number;
  top: number;
  left: number;
  theme: DefaultTheme;
  palette: "light" | "dark";
}

const color = (props: IProps | IModalProps, color: string) =>
  props.theme[props.palette][color];

const DayGridContainer = styled.div<IProps>`
  position: relative;
  width: ${(props) => props.colWidth * props.cols.length + "px"};
  height: ${(props) => props.colHeight + "px"};
  display: inline-block;
  border-bottom: 1px solid ${(props) => color(props, "primary")};

  .grid-line {
    position: absolute;
    width: ${(props) => props.colWidth * props.cols.length + "px"};
    height: 1px;
    background: ${(props) => color(props, "lightText")};
    z-index: 0;
  }
`;

const ModalContainer = styled.div<IModalProps>`
  position: absolute;
  width: ${(props) => props.width + "px"};
  height: ${(props) => props.height + "px"};
  z-index: 50;
  top: ${(props) => props.top + "px"};
  left: ${(props) => props.left + "px"};

  > div {
    background: ${(props) => color(props, "bg2")};
    height: ${(props) => props.height + "px"};

    button {
      background: none;
      border: none;
      color: ${(props) => color(props, "text")};
      transition: 0.25s;
      cursor: pointer;

      &[data-cy="close_modal_btn"] {
        position: absolute;
        top: 0;
        right: 0;
        padding: 6px 6px 0 0;
      }

      &:hover {
        opacity: 0.7;
      }
    }

    main {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;

      .details_form {
        border: 1px solid;

        input {
          width: 40px;
        }
      }

      h3 {
        margin: 0;
        font-size: small;
      }
      p {
        margin: 0;
        font-size: 12px;
      }
    }
  }
`;

const MarkerOverlay = styled.div`
  position: fixed;
  width: 10000px;
  height: 10000px;
  opacity: 0.1;
  background: lightblue;
  top: 0;
  left: 0;
  z-index: 30;
`;

export { DayGridContainer, ModalContainer, MarkerOverlay };
