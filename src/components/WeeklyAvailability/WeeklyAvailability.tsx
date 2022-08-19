import { createEffect, onMount, Show } from "solid-js";
import { useTheme } from "solid-styled-components";
import { getLocaleWeekDays, getOrderedWeekDays } from "../../lib/helpers";
import DayGrid from "../DayGrid/DayGrid";
import SideBar from "../SideBar/SideBar";
import TopBar from "../TopBar/TopBar";
import { Container } from "./ContainerStyles";

const WeeklyAvailability = (props) => {
  const theme = useTheme();

  const cols = () => getOrderedWeekDays(props.firstDay, props.dayCols);

  return (
    <Show when={props.open}>
      <Container
        theme={theme}
        palette={props.palette}
        cols={cols()}
        colWidth={props.colMinWidth}
        height={props.headerHeight + props.colHeight}
      >
        <TopBar
          cols={cols()}
          height={props.headerHeight}
          colWidth={props.colMinWidth}
          locale={props.locale}
          theme={theme}
          palette={props.palette}
        />
        {/* <div> */}
        <div
          style={{
            display: "inline-flex",
            width: props.colMinWidth * (cols().length + 0.5) + "px",
          }}
        >
          <SideBar
            locale={props.locale}
            colHeight={props.colHeight}
            colWidth={props.colMinWidth}
            minHour={props.minHour}
            maxHour={props.maxHour}
            theme={theme}
            palette={props.palette}
          />
          <DayGrid
            cols={cols()}
            minHour={props.minHour}
            maxHour={props.maxHour}
            locale={props.locale}
            colWidth={props.colMinWidth}
            colHeight={props.colHeight}
            theme={theme}
            palette={props.palette}
          />
        </div>
      </Container>
    </Show>
  );
};

export default WeeklyAvailability;
