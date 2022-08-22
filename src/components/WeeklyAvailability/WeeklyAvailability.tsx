import { createEffect, onMount, Show } from "solid-js";
import { createStore, unwrap } from "solid-js/store";
import { useTheme } from "solid-styled-components";
import { getWeekDays } from "../../lib/helpers";
import { IDayName } from "../../lib/types";
import DayGrid from "../DayGrid/DayGrid";
import SideBar from "../SideBar/SideBar";
import TopBar from "../TopBar/TopBar";
import { Container } from "./ContainerStyles";

const WeeklyAvailability = (props) => {
  const theme = useTheme();

  const cols = () =>
    getWeekDays(props.dayCols, {
      firstDay: props.firstDay,
    }) as IDayName[];

  // createEffect(() => {
  //   setStore;
  //   store.day;
  //   // store.Mon[0]?.start;
  //   console.log(store, store.Mon[0]?.start);
  //   // console.log({ s: props.minHour, e: props.maxHour });
  //   // console.log(store.Mon, store.gesture, store.day);
  //   // console.log(unwrap(store.slot));
  // });

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
          firstDay={props.firstDay}
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
            cols={cols()}
            minHour={props.minHour}
            maxHour={props.maxHour}
            locale={props.locale}
            colWidth={props.colMinWidth}
            colHeight={props.colHeight}
            headerHeight={props.headerHeight}
            widgetHeight={props.widgetHeight}
            firstDay={props.firstDay}
            theme={theme}
            palette={props.palette}
            onChange={(state) => {
              console.log("hey", { ...state });
            }}
          />
        </div>
      </Container>
    </Show>
  );
};

export default WeeklyAvailability;
