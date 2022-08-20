import { For } from "solid-js";
import { getHours, getWeekDays } from "../../lib/helpers";
import DayColumn from "../DayColumn/DayColumn";
import { DayGridContainer } from "./DayGridStyles";

const DayGrid = (props) => {
  const HOURS = getHours(props.minHour, props.maxHour, props.locale);

  console.log("DayGridProps", { ...props });
  // const store = props.cols

  return (
    <DayGridContainer
      cols={props.localizedCols}
      colHeight={props.colHeight}
      colWidth={props.colWidth}
      theme={props.theme}
      palette={props.palette}
      itemCount={HOURS.length}
      data-cy="day_grid"
    >
      <For each={props.cols}>
        {(col, i) => (
          <DayColumn
            day={col}
            height={props.colHeight}
            width={props.colWidth}
            minHour={props.minHour}
            maxHour={props.maxHour}
            theme={props.theme}
            palette={props.palette}
            idx={i()}
          />
        )}
      </For>

      <For each={HOURS}>
        {(hour: string, i) => (
          <div
            class="grid-line"
            style={{ top: (props.colHeight / HOURS.length) * i() + "px" }}
            data-cy={`grid_line_${hour}`}
          ></div>
        )}
      </For>
    </DayGridContainer>
  );
};

export default DayGrid;
