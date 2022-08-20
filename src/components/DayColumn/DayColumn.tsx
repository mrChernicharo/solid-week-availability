import { getElementRect, yPosToTime } from "../../lib/helpers";
import { IPointerEvent } from "../../lib/types";
import { DayColumnContainer } from "./DayColumnStyles";

const DayColumn = (props) => {
  let columnRef: HTMLDivElement;
  const rect = () => getElementRect(columnRef);
  function handleColumnClick(e: IPointerEvent) {
    // console.log({
    //   offset: e.offsetY,
    //   page: e.pageY,
    //   h: rect().height,
    //   t: rect().top,
    // });

    yPosToTime(
      e.offsetY, // offsetY gets click pos relative to clicked node
      props.minHour,
      props.maxHour,
      rect().top,
      rect().height
    );
    // console.log({
    //   click: e.clientY,
    //   currentTarget: e.currentTarget,
    //   columnRef,
    //   rect: rect(),
    //   e,
    //   props: { ...props },
    //   time: yPosToTime(
    //     e.clientY,
    //     props.minHour,
    //     props.maxHour,
    //     rect().top,
    //     rect().height
    //   ),
    // });
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
    ></DayColumnContainer>
  );
};

export default DayColumn;
