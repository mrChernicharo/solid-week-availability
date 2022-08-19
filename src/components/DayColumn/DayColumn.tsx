import { getElementRect } from "../../lib/helpers";
import { DayColumnContainer } from "./DayColumnStyles";

const DayColumn = (props) => {
  let columnRef: HTMLDivElement;

  function handleColumnClick(e) {
    console.log({
      click: e.clientY,
      currentTarget: e.currentTarget,
      columnRef,
      rect: getElementRect(columnRef),
      e,
      props: { ...props },
    });
  }
  return (
    <DayColumnContainer
      ref={columnRef!}
      height={props.height}
      width={props.width}
      theme={props.theme}
      palette={props.palette}
      onClick={handleColumnClick}
      data-cy={`day_column_${props.day}`}
    ></DayColumnContainer>
  );
};

export default DayColumn;
