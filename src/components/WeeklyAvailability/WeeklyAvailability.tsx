import { createEffect, onMount, Show } from "solid-js";
import { createStore, unwrap } from "solid-js/store";
import { useTheme } from "solid-styled-components";
import { getWeekDays } from "../../lib/helpers";
import { IDayName, ITimeSlot } from "../../lib/types";
import DayGrid from "../DayGrid/DayGrid";
import SideBar from "../SideBar/SideBar";
import TopBar from "../TopBar/TopBar";
import { Container } from "./ContainerStyles";
type IStore = {
  [k in IDayName]: ITimeSlot[];
} & { slot: ITimeSlot | null; day: IDayName; gesture: "idle" | "drag:ready" };
const initialStore = { slot: null, day: "Mon", gesture: "idle" };

const WeeklyAvailability = (props) => {
  props.dayCols.forEach((col: IDayName) => {
    initialStore[col] = [];
  });
  const theme = useTheme();

  const [store, setStore] = createStore(initialStore as IStore);

  const cols = () =>
    getWeekDays(props.dayCols, {
      firstDay: props.firstDay,
      locale: props.locale,
      format: "long",
    });

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
            headerHeight={props.headerHeight}
            widgetHeight={props.widgetHeight}
            firstDay={props.firstDay}
            theme={theme}
            palette={props.palette}
            store={store}
            setStore={setStore}
            onChange={() => props.onChange(store)}
          />
        </div>
      </Container>
    </Show>
  );
};

export default WeeklyAvailability;
