import { FaSolidCheck, FaSolidX } from "solid-icons/fa";
import { createEffect, createSignal, For, Show } from "solid-js";
import { createStore, unwrap } from "solid-js/store";
import {
  getElementRect,
  getHours,
  getMergedTimeslots,
  getWeekDays,
  readableTime,
} from "../../lib/helpers";
import {
  IColumnClick,
  IDayName,
  IPointerEvent,
  IPos,
  ITimeSlot,
} from "../../lib/types";
import DayColumn from "../DayColumn/DayColumn";
import {
  DayGridContainer,
  MarkerOverlay,
  ModalContainer,
} from "./DayGridStyles";
import idMaker from "@melodev/id-maker";
import { DefaultTheme } from "solid-styled-components";
import { HALF_SLOT, MODAL_HEIGHT, MODAL_WIDTH } from "../../lib/constants";

type IStore = {
  [k in IDayName]: ITimeSlot[];
};

interface IProps {
  cols: IDayName[];
  localizedCols: string[];
  minHour: number;
  maxHour: number;
  locale: string;
  colWidth: number;
  colHeight: number;
  headerHeight: number;
  widgetHeight: number;
  firstDay: string;
  theme: DefaultTheme;
  palette: "light" | "dark";
}

const initialStore = {};

const DayGrid = (props: IProps) => {
  let gridRef: HTMLDivElement;
  let modalPos: IPos = { x: 0, y: 0 };

  let columnClick: IColumnClick;
  const HOURS = getHours(props.minHour, props.maxHour, props.locale);

  props.cols.forEach((col: IDayName) => {
    initialStore[col] = [];
  });

  const [store, setStore] = createStore(initialStore as IStore);

  const [createModalOpen, setCreateModalOpen] = createSignal(false);
  const [mergeModalOpen, setMergeModalOpen] = createSignal(false);
  const [detailsModalOpen, setDetailsModalOpen] = createSignal(false);

  // console.log("DayGridProps", { ...props, s: { ...unwrap(store) } });

  function handleColumnClick(e: IPointerEvent, obj: IColumnClick) {
    // console.log(obj);
    // @ts-ignore
    columnClick = structuredClone(obj) || { ...obj };
    const wRect = () =>
      getElementRect(gridRef.parentElement?.parentElement as HTMLDivElement);

    const widget = document.querySelector("#widget_root_element");
    const scrollOffsetY = widget?.scrollTop || 0;
    const scrollOffsetX = widget?.scrollLeft || 0;

    modalPos.x = columnClick.pos.x + props.colWidth * columnClick.idx;
    modalPos.x =
      modalPos.x - scrollOffsetX < wRect().width / 2
        ? modalPos.x
        : modalPos.x - MODAL_WIDTH;

    modalPos.y = columnClick.pos.y;
    modalPos.y =
      modalPos.y < wRect().height / 2 + scrollOffsetY
        ? modalPos.y
        : modalPos.y - MODAL_HEIGHT;

    console.log({ columnClick });
    if (columnClick.clickedOnExistingSlot) {
      console.log("WE HAVE OVERLAPPING TIMESLOTS!");
      return;
    }
    if (!mergeModalOpen()) setCreateModalOpen(true);
  }

  // function handleOverlap() {

  // }

  function createNewTimeSlot() {
    const newTimeSlot: ITimeSlot = {
      id: idMaker(),
      start: columnClick.minutes - HALF_SLOT,
      end: columnClick.minutes + HALF_SLOT,
      day: columnClick.day,
    };

    return newTimeSlot;
  }

  function mergeSlots() {
    const newSlot = createNewTimeSlot();
    const day = columnClick.day;
    const merged = getMergedTimeslots(newSlot, store[day]);
    setStore(day, merged);
  }

  // createEffect(() => console.log({ ...store.Mon }));

  return (
    <DayGridContainer
      ref={gridRef!}
      cols={props.localizedCols}
      colHeight={props.colHeight}
      colWidth={props.colWidth}
      theme={props.theme}
      palette={props.palette}
      itemCount={HOURS.length}
      data-cy="day_grid"
    >
      <For each={props.cols}>
        {(col: IDayName, i) => (
          <DayColumn
            day={col}
            locale={props.locale}
            height={props.colHeight}
            headerHeight={props.headerHeight}
            width={props.colWidth}
            minHour={props.minHour}
            maxHour={props.maxHour}
            theme={props.theme}
            palette={props.palette}
            onColumnClick={handleColumnClick}
            showOverlapConfirm={(e) => {
              setCreateModalOpen(false);
              setMergeModalOpen(true);
            }}
            showTimeSlotModal={(e) =>
              setTimeout(() => setDetailsModalOpen(true), 0)
            }
            timeSlots={store[col]}
            idx={i()}
          />
        )}
      </For>

      <For each={HOURS}>
        {(hour: string, i) => (
          <div
            class="grid-line"
            style={{ top: (props.colHeight / HOURS.length) * i() + "px" }}
            data-cy={`grid_line_${hour}`}
          />
        )}
      </For>

      {/* MODALS */}
      <Show when={createModalOpen() || mergeModalOpen() || detailsModalOpen()}>
        <MarkerOverlay
          onClick={(e) => {
            setCreateModalOpen(false);
            setMergeModalOpen(false);
            setDetailsModalOpen(false);
          }}
        />
        <ModalContainer
          id="modal"
          width={MODAL_WIDTH}
          height={MODAL_HEIGHT}
          top={modalPos.y}
          left={modalPos.x}
        >
          <Show when={createModalOpen()}>
            <button onclick={(e) => setCreateModalOpen(false)}>
              <FaSolidX />
            </button>
            <h3>Create new</h3>
            <button
              onclick={(e) => {
                const newSlot = createNewTimeSlot();
                setStore(columnClick.day, (slots) => [...slots, newSlot]);
                setCreateModalOpen(false);
              }}
            >
              <FaSolidCheck />
            </button>
          </Show>

          <Show when={mergeModalOpen()}>
            <button onclick={(e) => setMergeModalOpen(false)}>
              <FaSolidX />
            </button>
            <h3>Merge</h3>
            <button
              onclick={(e) => {
                mergeSlots();
                setMergeModalOpen(false);
              }}
            >
              <FaSolidCheck />
            </button>

            <h3>Overlap</h3>
            <button
              onclick={(e) => {
                const newSlot = createNewTimeSlot();
                setStore(columnClick.day, (slots) => [...slots, newSlot]);
                setMergeModalOpen(false);
              }}
            >
              <FaSolidCheck />
            </button>
          </Show>

          <Show when={detailsModalOpen()}>
            {() => {
              const slot = columnClick.clickedSlots[0];
              console.log({ columnClick, clicked: columnClick.clickedSlots });

              return (
                <>
                  <button onclick={(e) => setDetailsModalOpen(false)}>
                    <FaSolidX />
                  </button>
                  <h3>Details</h3>
                  <p>{slot.day}</p>
                  <p>{slot.id}</p>
                  <p>
                    {readableTime(slot.start)} - {readableTime(slot.end)}
                  </p>

                  <button
                    onclick={(e) => {
                      setDetailsModalOpen(false);
                    }}
                  >
                    <FaSolidCheck />
                  </button>
                </>
              );
            }}
          </Show>
        </ModalContainer>
      </Show>
    </DayGridContainer>
  );
};

export default DayGrid;
