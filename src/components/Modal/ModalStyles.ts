import { DefaultTheme, styled } from "solid-styled-components";
import { IPalette } from "../../lib/types";

interface IModalProps {
  top: number;
  left: number;
  theme: DefaultTheme;
  palette: IPalette;
}

const color = (props: IModalProps, color: string) => props.theme[props.palette][color];

const ModalContainer = styled.div<IModalProps>`
  position: absolute;
  z-index: 50;
  top: ${(props) => props.top + "px"};
  left: ${(props) => props.left + "px"};
  padding: 1rem;

  background: ${(props) => color(props, "bg2")};

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
      /* padding: 6px 6px 0 0; */
      padding: 6px;
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
      fieldset {
        border: none;
        display: flex;
        padding: 0;
        margin: 8px 0 8px 0;

        .separator {
          width: 6px;
          text-align: center;
        }
        input {
          width: 34px;
          border: none;
        }
      }
    }

    h3 {
      margin: 0;
      font-size: small;
    }
    p,
    span {
      margin: 0;
      font-size: 12px;
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

export { ModalContainer, MarkerOverlay };
