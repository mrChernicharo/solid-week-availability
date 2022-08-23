import {
  FaSolidBrazilianRealSign,
  FaSolidCalendarPlus,
  FaSolidCheck,
  FaSolidLayerGroup,
  FaSolidNoteSticky,
  FaSolidPaperclip,
  FaSolidX,
} from "solid-icons/fa";
import { createEffect, createSignal, For, on, onCleanup, onMount, Show } from "solid-js";
import { createStore, SetStoreFunction, unwrap } from "solid-js/store";
import {
  findOverlappingSlots,
  getElementRect,
  getHours,
  getMergedTimeslots,
  getWeekDays,
  localizeWeekday,
  readableTime,
  yPosToTime,
} from "../../lib/helpers";
import { IColumnClick, IWeekday, IPalette, IPointerEvent, IPos, IStore, ITimeSlot } from "../../lib/types";
import DayColumn from "../DayColumn/DayColumn";
import { TimeGridContainer, MarkerOverlay, ModalContainer } from "./TimeGridStyles";
import idMaker from "@melodev/id-maker";
import { DefaultTheme } from "solid-styled-components";
import { HALF_SLOT, MODAL_HEIGHT, MODAL_WIDTH } from "../../lib/constants";

interface IProps {
  cols: IWeekday[];
  minHour: number;
  maxHour: number;
  locale: string;
  colWidth: number;
  colHeight: number;
  headerHeight: number;
  widgetHeight: number;
  firstDay: IWeekday;
  theme: DefaultTheme;
  palette: IPalette;
  onChange: (store: IStore) => void;
}

const initialStore = { slot: null, day: "Mon", gesture: "idle" };

const TimeGrid = (props: IProps) => {
  props.cols.forEach((col: IWeekday) => {
    initialStore[col] = [];
  });

  let gridRef: HTMLDivElement;
  let columnClick: IColumnClick;
  let modalPos: IPos = { x: 0, y: 0 };

  const [store, setStore] = createStore(initialStore as IStore);

  const [createModalOpen, setCreateModalOpen] = createSignal(false);
  const [mergeModalOpen, setMergeModalOpen] = createSignal(false);
  const [detailsModalOpen, setDetailsModalOpen] = createSignal(false);

  createEffect(() => {
    gridRef.addEventListener("pointermove", handlePointerMove);
  });

  onCleanup(() => {
    gridRef.removeEventListener("pointermove", handlePointerMove);
  });

  createEffect(() => {});

  const HOURS = () => getHours(props.minHour, props.maxHour, props.locale);

  function handlePointerMove(e) {
    if (store.gesture === "idle") return;

    if (store.gesture === "drag:ready") {
      const actions = {
        top_resize_handle: "drag:top",
        bottom_resize_handle: "drag:bottom",
        middle: "drag:middle",
      };
      setStore("gesture", actions[e.srcElement.classList[0]]);
      return;
    }
    const timeDiff = yPosToTime(e.movementY, 0, props.maxHour - props.minHour, props.colHeight);

    let slotStart, slotEnd;
    const { id, day, start, end } = store.slot!;

    if (timeDiff !== 0) {
      if (store.gesture === "drag:top") {
        [slotStart, slotEnd] = [start + timeDiff, end];
      }
      if (store.gesture === "drag:bottom") {
        [slotStart, slotEnd] = [start, end + timeDiff];
      }
      if (store.gesture === "drag:middle") {
        [slotStart, slotEnd] = [start + timeDiff, end + timeDiff];
      }

      const newSlot: ITimeSlot = {
        id,
        day,
        start: slotStart,
        end: slotEnd,
      };

      setStore("slot", newSlot);
      setStore(day as IWeekday, (prev) => [...prev.filter((s) => s.id !== id), newSlot]);
    }
  }

  function handleColumnClick(e: IPointerEvent, obj: IColumnClick) {
    // @ts-ignore
    columnClick = structuredClone(obj) || { ...obj };

    if (columnClick.clickedSlots.length) {
      setStore("slot", columnClick.clickedSlots.at(-1)!);
    } else {
      setStore("slot", null);
    }
    setStore("day", columnClick.day);
    updateModalState();
    props.onChange(store); // send state to parent element
  }

  function createNewTimeSlot() {
    const newTimeSlot: ITimeSlot = {
      id: idMaker(),
      start: columnClick.minutes - HALF_SLOT,
      end: columnClick.minutes + HALF_SLOT,
      day: columnClick.day,
    };

    return newTimeSlot;
  }

  function mergeSlots(newSlot: ITimeSlot) {
    const merged = getMergedTimeslots(newSlot, store[newSlot.day]);
    setStore(newSlot.day, merged);
  }

  function updateModalState() {
    const widgetEl = () => document.querySelector("#widget_root_element");
    const wRect = () => getElementRect(widgetEl() as HTMLDivElement);

    const scrollOffsetY = widgetEl()?.scrollTop || 0;
    const scrollOffsetX = widgetEl()?.scrollLeft || 0;

    modalPos.x = columnClick.pos.x + props.colWidth * columnClick.colIdx;
    modalPos.x = modalPos.x - scrollOffsetX < wRect().width / 2 ? modalPos.x : modalPos.x - MODAL_WIDTH;

    modalPos.y = columnClick.pos.y;
    modalPos.y = modalPos.y < wRect().height / 2 + scrollOffsetY ? modalPos.y : modalPos.y - MODAL_HEIGHT;

    if (columnClick.clickedOnExistingSlot) {
      // console.log("WE HAVE OVERLAPPING TIMESLOTS!");
      setStore("gesture", "drag:ready");
      return;
    }
    if (!mergeModalOpen()) setCreateModalOpen(true);
  }

  // createEffect(() => {});

  return (
    <TimeGridContainer
      ref={gridRef!}
      cols={props.cols}
      colHeight={props.colHeight}
      colWidth={props.colWidth}
      theme={props.theme}
      palette={props.palette}
      itemCount={HOURS().length}
      data-cy="day_grid"
    >
      {/* DAY COLUMNS */}
      <For each={props.cols}>
        {(col: IWeekday, i) => (
          <DayColumn
            day={col}
            colIdx={i()}
            locale={props.locale}
            height={props.colHeight}
            headerHeight={props.headerHeight}
            width={props.colWidth}
            minHour={props.minHour}
            maxHour={props.maxHour}
            theme={props.theme}
            palette={props.palette}
            timeSlots={store[col]}
            onColumnClick={handleColumnClick}
            showTimeSlotModal={() => setDetailsModalOpen(true)}
            showOverlapConfirm={() => {
              setCreateModalOpen(false);
              setMergeModalOpen(true);
            }}
            clickedOut={() => {
              setStore("gesture", "idle");

              if (store.slot) {
                const overlapping = findOverlappingSlots(store.slot!.start, store.slot!.end, store[col]).filter(
                  (s) => s.id !== store.slot!.id
                );

                // console.log("call clickedOut", overlapping);
                if (overlapping.length > 0) {
                  console.log("we have overlapping timeslots on this drop !");
                  setMergeModalOpen(true);
                }
              }
            }}
          />
        )}
      </For>

      {/* GRID LINES */}
      <For each={HOURS()}>
        {(hour: string, i) => (
          <div
            class="grid-line"
            style={{ top: (props.colHeight / HOURS().length) * i() + "px" }}
            data-cy={`grid_line_${hour}`}
          />
        )}
      </For>

      {/* MODALS */}
      <Show when={createModalOpen() || mergeModalOpen() || detailsModalOpen()}>
        <ModalContainer
          id="modal"
          width={MODAL_WIDTH}
          height={MODAL_HEIGHT}
          top={modalPos.y}
          left={modalPos.x}
          theme={props.theme}
          palette={props.palette}
        >
          <div>
            {/* CREATE MODAL */}
            <Show when={createModalOpen()}>
              <button
                data-cy="close_modal_btn"
                onclick={(e) => {
                  setCreateModalOpen(false);
                }}
              >
                <FaSolidX />
              </button>
              <main>
                <button
                  onclick={(e) => {
                    const newSlot = createNewTimeSlot();
                    setStore(newSlot.day, (slots) => [...slots, newSlot]);
                    setCreateModalOpen(false);
                  }}
                >
                  <FaSolidCalendarPlus size={24} />
                </button>
              </main>
            </Show>

            {/* MERGE MODAL */}
            <Show when={mergeModalOpen() && !detailsModalOpen()}>
              <button
                data-cy="close_modal_btn"
                onclick={(e) => {
                  setMergeModalOpen(false);
                }}
              >
                <FaSolidX />
              </button>
              <main>
                {/* Merge */}
                <button
                  onclick={(e) => {
                    const newSlot = columnClick.clickedSlots.length
                      ? store[store.day].find((s) => s.id === store.slot!.id)!
                      : createNewTimeSlot();

                    mergeSlots(newSlot);
                    setMergeModalOpen(false);
                  }}
                >
                  <FaSolidLayerGroup size={24} />
                </button>

                {/* Create New */}
                <button
                  onclick={(e) => {
                    if (!columnClick.clickedSlots.length) {
                      const newSlot = createNewTimeSlot();
                      setStore(newSlot.day, (slots) => [...slots, newSlot]);
                    }
                    setMergeModalOpen(false);
                  }}
                >
                  <FaSolidCalendarPlus size={24} />
                </button>
              </main>
            </Show>

            {/* DETAILS MODAL */}
            <Show when={detailsModalOpen() && store.slot !== null}>
              <main>
                {() => {
                  const slot = () => store.slot!;
                  const slotIdx = () => store[store.day].findIndex((s) => s.id === slot().id) || 0;

                  const [sh, sm] = [() => Math.floor(slot().start / 60), () => slot().start % 60];
                  const [eh, em] = [() => Math.floor(slot().end / 60), () => slot().end % 60];

                  return (
                    <>
                      <button
                        data-cy="close_modal_btn"
                        onclick={(e) => {
                          setDetailsModalOpen(false);
                        }}
                      >
                        <FaSolidX />
                      </button>
                      <p>{localizeWeekday(slot().day as IWeekday, props.locale, "long")}</p>
                      <p>
                        {() => readableTime(store[slot().day!][slotIdx()].start, props.locale)} -
                        {readableTime(store[slot().day!][slotIdx()].end, props.locale)}
                      </p>
                      <div class="details_form">
                        <p>from</p>
                        <label for="details_start_hour">H</label>
                        <input
                          id="details_start_hour"
                          type="number"
                          value={sh()}
                          onInput={(e) => {
                            const hour = +e.currentTarget.value;
                            let newTime = hour * 60 + sm();

                            // console.log({ hour, newTime, slot: slot(), slotIdx: slotIdx(), sh: sh() });

                            setStore(slot().day as IWeekday, slotIdx(), "start", newTime);
                            setStore("slot", "start", newTime);

                            props.onChange(store);
                          }}
                        />
                        <label for="details_start_minute">m</label>
                        <input
                          id="details_start_minute"
                          type="number"
                          value={sm()}
                          onInput={(e) => {
                            const mins = +e.currentTarget.value;
                            const newTime = sh() * 60 + mins;

                            setStore(slot().day as IWeekday, slotIdx(), "start", newTime);
                            setStore("slot", "start", newTime);

                            props.onChange(store);
                          }}
                        />

                        <p>to</p>
                        <label for="details_end_hour">H</label>
                        <input
                          id="details_end_hour"
                          type="number"
                          value={eh()}
                          onInput={(e) => {
                            const hour = +e.currentTarget.value;
                            const newTime = hour * 60 + em();

                            setStore(slot().day as IWeekday, slotIdx(), "end", newTime);
                            setStore("slot", "end", newTime);

                            props.onChange(store);
                          }}
                        />
                        <label for="details_end_minute">m</label>
                        <input
                          id="details_end_minute"
                          type="number"
                          value={em()}
                          onInput={(e) => {
                            const mins = +e.currentTarget.value;
                            const newTime = eh() * 60 + mins;

                            setStore(slot().day as IWeekday, slotIdx(), "end", newTime);
                            setStore("slot", "end", newTime);

                            props.onChange(store);
                          }}
                        />
                      </div>
                      <button
                        onclick={(e) => {
                          setDetailsModalOpen(false);

                          if (findOverlappingSlots(slot().start, slot().end, store[store.day])) {
                            setMergeModalOpen(true);
                          }
                        }}
                      >
                        <FaSolidCheck size={24} />
                      </button>
                    </>
                  );
                }}
              </main>
            </Show>
          </div>
        </ModalContainer>

        {/* OVERLAY */}
        <MarkerOverlay
          onPointerDown={(e) => {
            setCreateModalOpen(false);
            setMergeModalOpen(false);
            setDetailsModalOpen(false);
          }}
        />
      </Show>
    </TimeGridContainer>
  );
};

export default TimeGrid;
