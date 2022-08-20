import { update } from "cypress/types/lodash";
import { FaSolidCheck, FaSolidX } from "solid-icons/fa";
import { createSignal, For, Show } from "solid-js";
import { getHours, getWeekDays } from "../../lib/helpers";
import { IColumnClick } from "../../lib/types";
import DayColumn from "../DayColumn/DayColumn";
import { DayGridContainer, MarkerOverlay } from "./DayGridStyles";

const DayGrid = (props) => {
  let columnClick;
  const HOURS = getHours(props.minHour, props.maxHour, props.locale);

  const [overlayOpen, setOverlayOpen] = createSignal(false);

  console.log("DayGridProps", { ...props });
  // const store = props.cols

  function handleColumnClick(o: IColumnClick) {
    console.log(o);
    columnClick = structuredClone(o);

    setOverlayOpen(true);
  }

  function addNewTimeSlot(e) {
    console.log("addNewTimeSlot", columnClick);
  }

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
            onColumnClick={handleColumnClick}
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

      <Show when={overlayOpen()}>
        <MarkerOverlay onClick={(e) => setOverlayOpen(false)} />
        <div
          style={{
            position: "absolute",
            background: "green",
            "z-index": 50,
            top: columnClick.pos.y + "px",
            left: columnClick.pos.x + props.colWidth * columnClick.idx + "px",
          }}
        >
          <button onclick={(e) => setOverlayOpen(false)}>
            <FaSolidX />
          </button>
          <h1>Modal</h1>
          <button onclick={(e) => addNewTimeSlot(e)}>
            <FaSolidCheck />
          </button>
        </div>
      </Show>
    </DayGridContainer>
  );
};

export default DayGrid;
