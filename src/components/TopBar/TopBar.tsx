import { For } from "solid-js";
import { getWeekDays } from "../../lib/helpers";
import { TopBarContainer } from "./TopBarStyles";

const TopBar = (props) => {
  // console.log("TopBarProps", { ...props });

  const localeCols = () =>
    getWeekDays(props.cols, {
      firstDay: props.firstDay,
      locale: props.locale,
      format: "long",
    });

  return (
    <TopBarContainer
      theme={props.theme}
      palette={props.palette}
      height={props.height}
      colWidth={props.colWidth}
      cols={props.cols}
      data-cy="top_bar"
    >
      <div class="shim" data-cy="top_bar_shim"></div>
      <For each={localeCols()}>
        {(col: string) => (
          <div class="weekday" data-cy={`top_bar_weekday_${col}`}>
            {col}
          </div>
        )}
      </For>
    </TopBarContainer>
  );
};

export default TopBar;
