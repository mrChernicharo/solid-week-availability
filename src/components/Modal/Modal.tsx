import { props } from "cypress/types/bluebird";
import { FaSolidX, FaSolidCalendarPlus } from "solid-icons/fa";
import { Show } from "solid-js";
import { MODAL_WIDTH, MODAL_HEIGHT, HALF_SLOT } from "../../lib/constants";
import { ITimeSlot, IWeekday } from "../../lib/types";
import { MarkerOverlay, ModalContainer } from "./ModalStyles";
import idMaker from "@melodev/id-maker";

const CloseButton = (props) => (
  <button data-cy="close_modal_btn" onclick={(e) => props.onClick()}>
    <FaSolidX />
  </button>
);

export default function Modal(props) {
  function createNewTimeSlot(day: IWeekday, time: number) {
    const newTimeSlot: ITimeSlot = {
      id: idMaker(),
      start: time - HALF_SLOT,
      end: time + HALF_SLOT,
      day,
    };
    return newTimeSlot;
  }
  return (
    <div>
      {/* MODALS */}
      {/* <Show when={props.status !== "closed"}> */}
      <Show when={true}>
        <ModalContainer
          id="modal"
          width={MODAL_WIDTH}
          height={MODAL_HEIGHT}
          top={props.lastPos.y}
          left={props.lastPos.x}
          theme={props.theme}
          palette={props.palette}
        >
          {props.type}
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

          <Show when={props.type === "merge"}>
            <main></main>
          </Show>

          {/* DETAILS MODAL */}
          <Show when={props.type === "details"}>
            <main>
              {/* 
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
                    {readableTime(store[slot().day!][slotIdx()].start, props.locale)} -
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

                        // handle start > end (crossing)
                        if (+e.currentTarget.value * 60 > slot().end) {
                          e.currentTarget.value = String(+e.currentTarget.value - 1);
                          newTime = slot().end - MIN_SLOT_DURATION;
                        }

                        // handle start < minHour (top overflow)
                        if (+e.currentTarget.value < props.minHour) {
                          newTime = props.minHour * 60;
                          e.currentTarget.value = String(props.minHour);
                        }

                        if (newTime < slot().end) {
                          setStore(slot().day as IWeekday, slotIdx(), "start", newTime);
                          setStore("slot", "start", newTime);

                          props.onChange(store);
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

                        if (newTime < slot().end - MIN_SLOT_DURATION) {
                          setStore(slot().day as IWeekday, slotIdx(), "start", newTime);
                          setStore("slot", "start", newTime);

                          props.onChange(store);
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
                        if (+e.currentTarget.value * 60 < slot().start) {
                          e.currentTarget.value = String(+e.currentTarget.value + 1);
                          newTime = slot().start + MIN_SLOT_DURATION;
                        }

                        // handle end > maxHour (bottom overflow)
                        if (newTime > props.maxHour * 60) {
                          newTime = props.maxHour * 60;
                          e.currentTarget.value = String(props.maxHour);
                        }

                        if (newTime > slot().start) {
                          setStore(slot().day as IWeekday, slotIdx(), "end", newTime);
                          setStore("slot", "end", newTime);

                          props.onChange(store);
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

                        if (newTime > slot().start + MIN_SLOT_DURATION) {
                          setStore(slot().day as IWeekday, slotIdx(), "end", newTime);
                          setStore("slot", "end", newTime);

                          props.onChange(store);
                        } else {
                          e.currentTarget.value = String(mins + 1);
                        }
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
            */}
            </main>
          </Show>
        </ModalContainer>

        {/* OVERLAY */}
        <MarkerOverlay onPointerDown={(e) => props.onClose()} />
      </Show>
    </div>
  );

  //     <div>

  //       {/* MERGE MODAL */}
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
  //           {/* Merge */}
  //           <button
  //             onclick={(e) => {
  //               const newSlot = columnClick.clickedSlots.length
  //                 ? store[store.day].find((s) => s.id === store.slot!.id)!
  //                 : createNewTimeSlot();

  //               mergeSlots(newSlot);
  //               setMergeModalOpen(false);
  //             }}
  //           >
  //             <FaSolidLayerGroup size={24} />
  //           </button>

  //           {/* Create New */}
  //           <button
  //             onclick={(e) => {
  //               if (!columnClick.clickedSlots.length) {
  //                 const newSlot = createNewTimeSlot();
  //                 setStore(newSlot.day, (slots) => [...slots, newSlot]);
  //               }
  //               setMergeModalOpen(false);
  //             }}
  //           >
  //             <FaSolidCalendarPlus size={24} />
  //           </button>
  //         </main>
  //       </Show>

  //       {/* DETAILS MODAL */}
  //
  //     </div>
  //   </ModalContainer>
}
