import { FaSolidX, FaSolidCalendarPlus, FaSolidLayerGroup, FaSolidCheck, FaSolidTrash } from "solid-icons/fa";
import { createEffect, createSignal, Show } from "solid-js";
import { ITimeSlot, IWeekday } from "../../lib/types";
import { MarkerOverlay, ModalContainer } from "./ModalStyles";
import idMaker from "@melodev/id-maker";
import { localizeWeekday, readableTime, snapTime } from "../../lib/helpers";

const CloseButton = (props) => (
  <button data-cy="close_modal_btn" onclick={(e) => props.onClick(e)}>
    <FaSolidX />
  </button>
);

export default function Modal(props) {
  const [modalPos, setModalPos] = createSignal({ x: 0, y: 0 });

  function getModalPos() {
    // const widgetEl = () => document.querySelector("#widget_root_element");
    // const wRect = () => getElementRect(widgetEl() as HTMLDivElement);
    // const scrollOffsetY = widgetEl()?.scrollTop || 0;
    // const scrollOffsetX = widgetEl()?.scrollLeft || 0;
    let modalPos = { x: 0, y: 0 };

    modalPos.x = props.lastWindowPos.x;
    modalPos.y = props.lastWindowPos.y;

    return setModalPos(modalPos);
  }

  function _createNewTimeSlot(day: IWeekday, time: number) {
    let [start, end] = [Math.round(time - props.snapTo / 2), Math.round(time + props.snapTo / 2)];

    // prevent top overflow on creation
    if (start < props.minHour * 60) {
      start = props.minHour * 60;
      end = props.minHour * 60 + props.snapTo;
    }
    // prevent bottom overflow on creation
    if (end > props.maxHour * 60) {
      end = props.maxHour * 60;
      start = props.maxHour * 60 - props.snapTo;
    } else {
      [start, end] = [snapTime(start, props.snapTo), snapTime(end, props.snapTo)];
    }

    const newTimeSlot: ITimeSlot = {
      id: idMaker(),
      start,
      end,
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
      <ModalContainer id="modal" top={modalPos().y} left={modalPos().x} theme={props.theme} palette={props.palette}>
        {/* <p>{JSON.stringify(props.openedModals)}</p> */}

        {/* CREATE MODAL */}
        <Show when={"create".includes(props.openedModals)}>
          <CloseButton onClick={(e) => props.onClose("create")} />
          <main>
            <button
              onclick={(e) => {
                props.onCreateTimeSlot(_createNewTimeSlot(props.day, props.lastPos.time));
                props.onClose("create");
              }}
            >
              <FaSolidCalendarPlus size={24} />
            </button>
          </main>
        </Show>

        {/* MERGE MODAL */}
        <Show when={"merge".includes(props.openedModals)}>
          <CloseButton onClick={(e) => props.onClose("merge")} />
          <main>
            {/* Merge */}
            <button
              onclick={(e) => {
                props.onMergeTimeSlots(_createNewTimeSlot(props.day, props.lastPos.time));
                props.onClose("merge");
              }}
            >
              <FaSolidLayerGroup size={24} />
            </button>

            {/* Create New */}
            <button
              onclick={(e) => {
                props.onCreateTimeSlot(_createNewTimeSlot(props.day, props.lastPos.time));
                props.onClose("merge");
              }}
            >
              <FaSolidCalendarPlus size={24} />
            </button>
          </main>
        </Show>

        {/* DETAILS MODAL */}
        <Show when={"details".includes(props.openedModals)}>
          <CloseButton onClick={(e) => props.onClose("details")} />
          <main>
            {() => {
              const [sh, sm] = [() => Math.floor(props.slot.start / 60), () => props.slot.start % 60];
              const [eh, em] = [() => Math.floor(props.slot.end / 60), () => props.slot.end % 60];

              return (
                <>
                  <p>{localizeWeekday(props.slot.day, props.locale, "long")}</p>
                  <p>
                    {readableTime(props.slot.start, props.locale)} -{readableTime(props.slot.end, props.locale)}
                  </p>
                  <p>{props.slot.id}</p>

                  <div class="details_form">
                    <fieldset>
                      <input
                        id="details_start_hour"
                        type="number"
                        value={sh()}
                        onChange={(e) => {
                          const hour = +e.currentTarget.value;
                          let newTime = hour * 60 + sm();

                          // handle start > end (crossing)
                          if (+e.currentTarget.value * 60 > props.slot.end) {
                            e.currentTarget.value = String(+e.currentTarget.value - 1);
                            newTime = props.slot.end - props.snapTo;
                          }

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
                      <div class="separator">:</div>
                      <input
                        id="details_start_minute"
                        type="number"
                        value={sm()}
                        onChange={(e) => {
                          const mins = +e.currentTarget.value;
                          const newTime = sh() * 60 + mins;

                          if (newTime < props.minHour * 60) {
                            e.currentTarget.value = String(mins + 1);
                            return;
                          }

                          if (newTime < props.slot.end - props.snapTo) {
                            props.onSlotTimeChange(newTime, props.slotIdx, "start");
                          } else {
                            e.currentTarget.value = String(mins - 1);
                          }
                        }}
                      />
                    </fieldset>

                    <fieldset>
                      <input
                        id="details_end_hour"
                        type="number"
                        value={eh()}
                        onChange={(e) => {
                          const hour = +e.currentTarget.value;
                          let newTime = hour * 60 + em();

                          // handle start < end (crossing)
                          if (+e.currentTarget.value * 60 < props.slot.start) {
                            e.currentTarget.value = String(+e.currentTarget.value + 1);
                            newTime = props.slot.start + props.snapTo;
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
                      <div class="separator">:</div>
                      <input
                        id="details_end_minute"
                        type="number"
                        value={em()}
                        onChange={(e) => {
                          const mins = +e.currentTarget.value;
                          const newTime = eh() * 60 + mins;

                          if (newTime > props.maxHour * 60) {
                            e.currentTarget.value = String(mins - 1);
                            return;
                          }

                          if (newTime > props.slot.start + props.snapTo) {
                            props.onSlotTimeChange(newTime, props.slotIdx, "end");
                          } else {
                            e.currentTarget.value = String(mins + 1);
                          }
                        }}
                      />
                    </fieldset>
                  </div>

                  <div>
                    <button
                      onclick={(e) => {
                        props.onDetailsConfirm(e, props.slot);
                        props.onClose("details");
                      }}
                    >
                      <FaSolidCheck size={24} />
                    </button>
                    <button
                      onclick={(e) => {
                        props.onClose("details");
                        props.onDeleteSlot(props.slot);
                      }}
                    >
                      <FaSolidTrash size={24} />
                    </button>
                  </div>
                </>
              );
            }}
          </main>
        </Show>

        {/* CONFIRM MODAL */}
        <Show when={"confirm".includes(props.openedModals)}>
          <CloseButton onClick={(e) => props.onClose("confirm")} />
          <main>
            {/* confirm */}
            <button
              onclick={(e) => {
                props.onMergeTimeSlots(_createNewTimeSlot(props.day, props.lastPos.time));
                props.onClose("confirm");
              }}
            >
              <FaSolidLayerGroup size={24} />
            </button>
          </main>
        </Show>

        {/* DROP MODAL */}
        <Show when={"drop".includes(props.openedModals)}>
          <CloseButton onClick={(e) => props.onClose("drop")} />
          <main>
            {/* drop */}
            <button
              onclick={(e) => {
                props.onMergeTimeSlots(props.slot);
                props.onClose("drop");
              }}
            >
              <FaSolidLayerGroup size={24} />
            </button>
          </main>
        </Show>
      </ModalContainer>

      {/* OVERLAY */}
      <MarkerOverlay onPointerDown={(e) => props.onClose("overlay")} />
    </div>
  );
}
