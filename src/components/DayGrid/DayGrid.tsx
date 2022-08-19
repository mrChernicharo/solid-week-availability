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
      DayGrid
    </DayGridContainer>
  );
};

export default DayGrid;

// cols: string[];
// colHeight: number;
// theme: DefaultTheme;
// palette: "light" | "dark";
