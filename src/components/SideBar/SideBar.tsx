import { For } from "solid-js";
import { SideBarContainer } from "./SideBarStyles";

const SideBar = (props) => {
  console.log("SideBarProps", { ...props });

  const HOURS = (minHour: number, maxHour: number) => {
    const hours: string[] = [];
    let curr = minHour;

    while (curr <= maxHour) {
      let hour = "";
      if (props.locale === "en") {
        if (curr === 0) hour = "12 AM";
        if (curr === 12) hour = "12 PM";
        if (curr !== 0 && curr !== 12)
          hour = curr < 12 ? curr + " AM" : curr - 12 + " PM";
      } else {
        hour = curr + ":00";
      }

      hours.push(hour);
      curr++;
    }

    return hours;
  };

  return (
    <SideBarContainer
      theme={props.theme}
      palette={props.palette}
      height={props.colHeight}
      colWidth={props.colWidth / 2}
      itemsCount={HOURS(props.minHour, props.maxHour).length}
    >
      <For each={HOURS(props.minHour, props.maxHour)}>
        {(hour: string) => <div class="hour">{hour}</div>}
      </For>
    </SideBarContainer>
  );
};

export default SideBar;
