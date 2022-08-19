import { DayColumnContainer } from "./DayColumnStyles";

const DayColumn = (props) => {
  return (
    <DayColumnContainer
      height={props.height}
      width={props.width}
      theme={props.theme}
      palette={props.palette}
      data-cy={`day_column_${props.day}`}
    >
      {props.day}
    </DayColumnContainer>
  );
};

export default DayColumn;
