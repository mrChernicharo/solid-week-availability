import { createEffect, createSignal, onCleanup, onMount, Show } from "solid-js";
import { createStore, unwrap } from "solid-js/store";
import { useTheme } from "solid-styled-components";
import { getWeekDays } from "../../lib/helpers";
import { IWeekday, IStore, IPalette } from "../../lib/types";
import TimeGrid from "../TimeGrid/TimeGrid";
import SideBar from "../SideBar/SideBar";
import TopBar from "../TopBar/TopBar";
import { Container } from "./ContainerStyles";
const initialStore = { slot: null, day: "Mon", gesture: "idle" };

interface IProps {
  locale: string;
  dayCols: IWeekday[];
  firstDay: IWeekday;
  open: boolean;
  minHour: number;
  maxHour: number;
  widgetHeight: number;
  headerHeight: number;
  colHeight: number;
  colMinWidth: number;
  minSnap: number;
  onChange: any;
  palette: IPalette;
}

const WeeklyAvailability = (props: IProps) => {
  const theme = useTheme();

  // let isMobile = () => window.matchMedia("(any-pointer:coarse)").matches;
  // setInterval(() => {
  //   console.log({ isMobile: isMobile() });
  // }, 2000);

  const [store, setStore] = createStore(initialStore as IStore);

  function handlePointerDown(e) {
    // console.log("handlePointerDown", e);
    // Mobile -> doesn't fire after touchcancel has been emitted
    // DRAG
    // SCROLL
  }
  function handleClick(e) {
    // Mobile Behavior -> fires only if you clicked briefly
    //
    // Desktop Behavior -> fires on click up, always
    //
    // WE WANT THIS TO FIRE RELIABLY -> ONLY IF WE CLICKED BRIEFLY
    // clearTimeout(clickTimeout);
    // OPEN/CLOSE MODAL
  }

  function handleTouchStart(e) {
    // console.log("handleTouchStart", e);
  }

  function handlePointerCancel(e) {
    // console.log("handlePointerCancel", e); // fires on mobile only
    // started moving
  }
  function handlePointerUp(e) {
    // console.log("handlePointerUp", e);
    // Mobile Behavior -> fires on click-up, if brief
    //                    if long,
    //                         emits pointercancel if you move,
    //                         emits contextmenu if you hold still
    //
    // Desktop Behavior -> fires on click-up always
    // CLEAN STUFF
  }
  function handleTouchEnd(e) {
    // console.log("handleTouchEnd", e);
  }

  function onColumnClick(e) {
    console.log(e);
  }

  onMount(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("pointercancel", handlePointerCancel);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);
  });
  onCleanup(() => {
    document.removeEventListener("pointerup", handlePointerUp);
    document.removeEventListener("pointerdown", handlePointerDown);
    document.removeEventListener("pointercancel", handlePointerCancel);
    document.removeEventListener("click", handleClick);
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("touchstart", handleTouchStart);
  });

  // touchend + pointerup

  const cols = () =>
    getWeekDays(props.dayCols, {
      firstDay: props.firstDay,
    }) as IWeekday[];

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
          <TimeGrid
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
            onColumnClick={onColumnClick}
            onChange={() => {
              console.log({ ...store });
              props.onChange(store);
            }}
          />
        </div>
      </Container>
    </Show>
  );
};

export default WeeklyAvailability;
