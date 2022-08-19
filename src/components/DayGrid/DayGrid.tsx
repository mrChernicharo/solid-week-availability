import { For } from "solid-js";
import { getHours } from "../../lib/helpers";
import DayColumn from "../DayColumn/DayColumn";
import { DayGridContainer } from "./DayGridStyles";

const DayGrid = (props) => {
  // console.log("DayGridProps", { ...props });
  const HOURS = getHours(props.minHour, props.maxHour, props.locale);

  return (
    <DayGridContainer
      cols={props.cols}
      colHeight={props.colHeight}
      colWidth={props.colWidth}
      theme={props.theme}
      palette={props.palette}
      itemCount={HOURS.length}
      data-cy="day_grid"
    >
      <For each={props.cols}>
        {(col) => (
          <DayColumn
            day={col}
            height={props.colHeight}
            width={props.colWidth}
            theme={props.theme}
            palette={props.palette}
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
// top: ${(props) => props.colHeight / props.itemCount + "px"};

// cols: string[];
// colHeight: number;
// theme: DefaultTheme;
// palette: "light" | "dark";
