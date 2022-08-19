import { For } from "solid-js";
import DayColumn from "../DayColumn/DayColumn";
import { DayGridContainer } from "./DayGridStyles";

const DayGrid = (props) => {
  //   console.log("DayGridProps", { ...props });

  return (
    <DayGridContainer
      cols={props.cols}
      colHeight={props.colHeight}
      colWidth={props.colWidth}
      theme={props.theme}
      palette={props.palette}
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
    </DayGridContainer>
  );
};

export default DayGrid;

// cols: string[];
// colHeight: number;
// theme: DefaultTheme;
// palette: "light" | "dark";
