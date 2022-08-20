import { createEffect, createSignal, Show } from "solid-js";
import { MARKER_TIME } from "../../lib/constants";
import { getElementRect, yPosToTime } from "../../lib/helpers";
import { IPointerEvent, IPos } from "../../lib/types";
import { DayColumnContainer } from "./DayColumnStyles";
import { FaSolidPlus } from "solid-icons/fa";

const ICON_SIZE = 16;

const DayColumn = (props) => {
  let columnRef: HTMLDivElement;
  // let timeout;
  const rect = () => getElementRect(columnRef);

  const [clickedPos, setClickedPos] = createSignal<IPos | null>(null);

  createEffect(() => {
    props.canCreateNew;

    setClickedPos(null);
  });

  function handleClick(e: IPointerEvent) {
    setClickedPos({
      x: e.offsetX,
      y: e.offsetY,
    });

    // GOTTA FIGURE OUT IF THIS HAS BEEN CLICKED
    // console.log(clickedPos());

    const clickTime = yPosToTime(
      e.offsetY, // offsetY gets click pos relative to clicked node
      props.minHour,
      props.maxHour,
      rect().height
    );

    // clearTimeout(timeout);
    // timeout = setTimeout(() => setClickedPos(null), MARKER_TIME);

    props.onColumnClick({
      minutes: clickTime,
      pos: clickedPos(),
      day: props.day,
    });
  }

  return (
    <DayColumnContainer
      ref={columnRef!}
      height={props.height}
      width={props.width}
      theme={props.theme}
      palette={props.palette}
      onPointerDown={handleClick}
      data-cy={`day_column_${props.day}`}
      idx={props.idx}
    >
      <Show when={clickedPos() !== null}>
        <div
          style={{
            position: "absolute",
            background: "green",
            "z-index": 50,
            top:
              Math.round((clickedPos()?.y || 0) - (ICON_SIZE / 2 - 2)) + "px",
            left:
              Math.round((clickedPos()?.x || 0) - (ICON_SIZE / 2 - 1)) + "px",
          }}
        >
          <div
            style={{
              "pointer-events": "none",
            }}
          >
            <FaSolidPlus size={ICON_SIZE} />
            <span>new</span>
          </div>
        </div>
      </Show>
    </DayColumnContainer>
  );
};

export default DayColumn;
