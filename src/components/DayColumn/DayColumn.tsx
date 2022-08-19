import { DayColumnContainer } from "./DayColumnStyles";

const DayColumn = (props) => {
  return (
    <DayColumnContainer
      height={props.height}
      width={props.width}
      theme={props.theme}
      palette={props.palette}
    >
      {props.day}
    </DayColumnContainer>
  );
};

export default DayColumn;
