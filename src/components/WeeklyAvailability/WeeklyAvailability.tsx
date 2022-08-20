import { createEffect, onMount, Show } from "solid-js";
import { useTheme } from "solid-styled-components";
import { getWeekDays } from "../../lib/helpers";
import DayGrid from "../DayGrid/DayGrid";
import SideBar from "../SideBar/SideBar";
import TopBar from "../TopBar/TopBar";
import { Container } from "./ContainerStyles";

const WeeklyAvailability = (props) => {
  const theme = useTheme();

  const cols = () =>
    getWeekDays(props.dayCols, {
      firstDay: props.firstDay,
      locale: props.locale,
      format: "long",
    });

  return (
    <Show when={props.open}>
      <Container
        id="widget_root_element"
        theme={theme}
        palette={props.palette}
        cols={cols()}
        colWidth={props.colMinWidth}
        height={props.headerHeight + props.colHeight}
        widgetHeight={props.widgetHeight}
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
          data-cy="columns_wrapper"
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
            cols={props.dayCols}
            localizedCols={cols()}
            minHour={props.minHour}
            maxHour={props.maxHour}
            locale={props.locale}
            colWidth={props.colMinWidth}
            colHeight={props.colHeight}
            widgetHeight={props.widgetHeight}
            firstDay={props.firstDay}
            theme={theme}
            palette={props.palette}
          />
        </div>
      </Container>
    </Show>
  );
};

export default WeeklyAvailability;
