import { createSignal, Show } from "solid-js";
import { MARKER_TIME } from "../../lib/constants";
import { getElementRect, yPosToTime } from "../../lib/helpers";
import { IPointerEvent, IPos } from "../../lib/types";
import { DayColumnContainer, MarkerOverlay } from "./DayColumnStyles";
import { FaSolidPlus } from "solid-icons/fa";

const ICON_SIZE = 16;

const DayColumn = (props) => {
  let columnRef: HTMLDivElement;
  let timeout;
  const rect = () => getElementRect(columnRef);

  const [clickedPos, setClickedPos] = createSignal<IPos | null>(null);

  function handleColumnClick(e: IPointerEvent) {
    const clickTime = yPosToTime(
      e.offsetY, // offsetY gets click pos relative to clicked node
      props.minHour,
      props.maxHour,
      rect().height
    );

    setClickedPos({
      x: Math.round(e.offsetX - ICON_SIZE / 2 - 1),
      y: Math.round(e.offsetY - ICON_SIZE / 2 - 2),
    });
    clearTimeout(timeout);
    timeout = setTimeout(() => setClickedPos(null), MARKER_TIME);

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
      onPointerDown={handleColumnClick}
      data-cy={`day_column_${props.day}`}
      idx={props.idx}
    >
      <Show when={clickedPos() !== null}>
        <FaSolidPlus
          size={ICON_SIZE}
          style={{
            position: "absolute",
            top: clickedPos()?.y + "px",
            left: clickedPos()?.x + "px",
          }}
        />
        <MarkerOverlay></MarkerOverlay>
      </Show>
    </DayColumnContainer>
  );
};

export default DayColumn;
