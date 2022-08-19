import { For } from "solid-js";
import { TopBarContainer } from "./TopBarStyles";

const TopBar = (props) => {
  // console.log("TopBarProps", { ...props });

  return (
    <TopBarContainer
      theme={props.theme}
      palette={props.palette}
      height={props.height}
      colWidth={props.colWidth}
      cols={props.cols}
    >
      <div class="shim"></div>
      <For each={props.cols}>
        {(col: string) => <div class="weekday">{col}</div>}
      </For>
    </TopBarContainer>
  );
};

export default TopBar;
