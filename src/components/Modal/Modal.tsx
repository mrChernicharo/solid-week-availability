import { props } from "cypress/types/bluebird";
import { FaSolidX, FaSolidCalendarPlus, FaSolidLayerGroup, FaSolidCheck } from "solid-icons/fa";
import { createEffect, createSignal, Show } from "solid-js";
import { MODAL_WIDTH, MODAL_HEIGHT, HALF_SLOT, MIN_SLOT_DURATION } from "../../lib/constants";
import { ITimeSlot, IWeekday } from "../../lib/types";
import { MarkerOverlay, ModalContainer } from "./ModalStyles";
import idMaker from "@melodev/id-maker";
import { findOverlappingSlots, getElementRect, localizeWeekday, readableTime } from "../../lib/helpers";

const CloseButton = (props) => (
  <button data-cy="close_modal_btn" onclick={(e) => props.onClick()}>
    <FaSolidX />
  </button>
);

export default function Modal(props) {
  const [modalPos, setModalPos] = createSignal({ x: 0, y: 0 });

  function getModalPos() {
    let modalPos = { x: 0, y: 0 };
    const widgetEl = () => document.querySelector("#widget_root_element");
    const wRect = () => getElementRect(widgetEl() as HTMLDivElement);

    const scrollOffsetY = widgetEl()?.scrollTop || 0;
    const scrollOffsetX = widgetEl()?.scrollLeft || 0;

    // TODO: gotta review this
    modalPos.x = props.lastPos.x - scrollOffsetX;
    modalPos.x = modalPos.x < wRect().width / 2 ? modalPos.x : modalPos.x - MODAL_WIDTH;

    modalPos.y = props.lastPos.y + wRect().top + props.headerHeight + window.scrollY - scrollOffsetY;
    modalPos.y =
      modalPos.y - wRect().top < (wRect().height + window.scrollY) / 2 ? modalPos.y : modalPos.y - MODAL_HEIGHT;

    return setModalPos(modalPos);
  }

  function createNewTimeSlot(day: IWeekday, time: number) {
    const newTimeSlot: ITimeSlot = {
      id: idMaker(),
      start: time - HALF_SLOT,
      end: time + HALF_SLOT,
      day,
    };
    return newTimeSlot;
  }

  createEffect(() => {
    getModalPos();
  });

  return (
    <div>
      {/* MODALS */}
      {/* <Show when={props.status !== "closed"}> */}
      <ModalContainer
        id="modal"
        width={MODAL_WIDTH}
        height={MODAL_HEIGHT}
        top={modalPos().y}
        left={modalPos().x}
        theme={props.theme}
        palette={props.palette}
      >
        {/* {props.type} */}
        {/* CREATE MODAL */}
        <Show when={props.type === "create"}>
          <CloseButton onClick={props.onClose} />
          <main>
            <button
              onclick={(e) => {
                props.onCreateTimeSlot(createNewTimeSlot(props.day, props.lastPos.time));
                props.onClose();
              }}
            >
              <FaSolidCalendarPlus size={24} />
            </button>
          </main>
        </Show>

        {/* MERGE MODAL */}
        <Show when={props.type === "merge" || props.type === "drop:merge"}>
          <CloseButton onClick={props.onClose} />
          <main>
            {/* Merge */}
            <button
              onclick={(e) => {
                if (props.type === "merge") {
                  props.onMergeTimeSlots(createNewTimeSlot(props.day, props.lastPos.time));
                }
                if (props.type === "drop:merge") {
                  props.onMergeTimeSlots(props.slot);
                }

                props.onClose();
              }}
            >
              <FaSolidLayerGroup size={24} />
            </button>

            {/* Create New */}
            <button
              onclick={(e) => {
                if (props.type === "merge") {
                  props.onCreateTimeSlot(createNewTimeSlot(props.day, props.lastPos.time));
                }
                props.onClose();
              }}
            >
              <FaSolidCalendarPlus size={24} />
            </button>
          </main>
        </Show>

        {/* DETAILS MODAL */}
        <Show when={props.type === "details"}>
          <CloseButton onClick={props.onClose} />
          <main>
            {() => {
              const [sh, sm] = [() => Math.floor(props.slot.start / 60), () => props.slot.start % 60];
              const [eh, em] = [() => Math.floor(props.slot.end / 60), () => props.slot.end % 60];

              // console.log()

              return (
                <>
                  <CloseButton onClick={(e) => props.onClose()} />
                  <p>{localizeWeekday(props.slot.day, props.locale, "long")}</p>
                  <p>
                    {readableTime(props.slot.start, props.locale)} -{readableTime(props.slot.end, props.locale)}
                  </p>
                  <p>{props.slot.id}</p>
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

                        // handle start > end (crossing)
                        if (+e.currentTarget.value * 60 > props.slot.end) {
                          e.currentTarget.value = String(+e.currentTarget.value - 1);
                          newTime = props.slot.end - MIN_SLOT_DURATION;
                        }

                        console.log({ v: e.currentTarget.value, min: props.minHour });

                        // handle start < minHour (top overflow)
                        if (newTime < props.minHour * 60) {
                          newTime = props.minHour * 60;
                          e.currentTarget.value = String(props.minHour);
                        }

                        if (newTime < props.slot.end) {
                          props.onSlotTimeChange(newTime, props.slotIdx, "start");
                        }
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

                        if (newTime < props.minHour * 60) {
                          e.currentTarget.value = String(mins + 1);
                          return;
                        }

                        if (newTime < props.slot.end - MIN_SLOT_DURATION) {
                          props.onSlotTimeChange(newTime, props.slotIdx, "start");
                        } else {
                          e.currentTarget.value = String(mins - 1);
                        }
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
                        let newTime = hour * 60 + em();

                        // handle start < end (crossing)
                        if (+e.currentTarget.value * 60 < props.slot.start) {
                          e.currentTarget.value = String(+e.currentTarget.value + 1);
                          newTime = props.slot.start + MIN_SLOT_DURATION;
                        }

                        // handle end > maxHour (bottom overflow)
                        if (newTime > props.maxHour * 60) {
                          newTime = props.maxHour * 60;
                          e.currentTarget.value = String(props.maxHour);
                        }

                        if (newTime > props.slot.start) {
                          props.onSlotTimeChange(newTime, props.slotIdx, "end");
                        }
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

                        if (newTime > props.maxHour * 60) {
                          e.currentTarget.value = String(mins - 1);
                          return;
                        }

                        if (newTime > props.slot.start + MIN_SLOT_DURATION) {
                          props.onSlotTimeChange(newTime, props.slotIdx, "end");
                        } else {
                          e.currentTarget.value = String(mins + 1);
                        }
                      }}
                    />
                  </div>
                  <button
                    onclick={(e) => {
                      console.log("clickei no confima do details");
                      props.onDetailsClose(e, props.slot);
                    }}
                  >
                    <FaSolidCheck size={24} />
                  </button>
                </>
              );
            }}
          </main>
        </Show>
      </ModalContainer>

      {/* OVERLAY */}
      <MarkerOverlay onPointerDown={(e) => props.onClose()} />
    </div>
  );

  //     <div>

  //       <Show when={mergeModalOpen() && !detailsModalOpen()}>
  //         <button
  //           data-cy="close_modal_btn"
  //           onclick={(e) => {
  //             setMergeModalOpen(false);
  //           }}
  //         >
  //           <FaSolidX />
  //         </button>
  //         <main>
  //
  //         </main>
  //       </Show>

  //       {/* DETAILS MODAL */}
  //
  //     </div>
  //   </ModalContainer>
}
