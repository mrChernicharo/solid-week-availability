import { For } from "solid-js";
import { getHours } from "../../lib/helpers";
import { SideBarContainer } from "./SideBarStyles";

const SideBar = (props) => {
  // console.log("SideBarProps", { ...props });

  const HOURS = () => getHours(props.minHour, props.maxHour, props.locale);

  return (
    <SideBarContainer
      theme={props.theme}
      palette={props.palette}
      height={props.colHeight}
      colWidth={props.colWidth / 2}
      itemCount={HOURS().length}
      data-cy="side_bar"
    >
      <For each={HOURS()}>
        {(hour: string) => (
          <div class="hour" data-cy={`side_bar_${hour}`}>
            <span>{hour}</span>
          </div>
        )}
      </For>
    </SideBarContainer>
  );
};

export default SideBar;
