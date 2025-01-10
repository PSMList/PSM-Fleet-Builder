import "./Modal.scss";

import { createContext, createEffect, For, JSX, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";

import { IconButton } from "@/common/Icon/IconButton/IconButton";

type CommonModal = {
  id: string;
  title: JSX.Element;
  subtitle?: JSX.Element;
};

type PromptModal = {
  content?: never;
  prompt: true;
  onClose: (result: boolean) => void;
} & CommonModal;

type ContentModal = {
  content?: () => JSX.Element;
  prompt?: false;
  onClose?: (() => void) | boolean;
} & CommonModal;

export type Modal = ContentModal | PromptModal;

export type VisibleModal = Modal & {
  visible: boolean;
};

export const ModalContext = createContext<{
  show: (properties: Modal) => void;
  hide: (id: string) => void;
}>({
  show() {
    //
  },
  hide() {
    //
  },
});

export function ModalProvider() {
  const [modals, setModals] = createStore<VisibleModal[]>([]);

  function show(properties: Modal) {
    setModals(
      produce((_modals) => {
        const modal = _modals.find((modal) => modal.id === properties.id);

        if (modal) {
          modal.visible = true;
          modal.onClose = properties.onClose;
          modal.title = properties.title;
        } else {
          _modals.push({
            ...properties,
            visible: true,
          });
        }
      }),
    );
  }

  function hide(id: string) {
    setModals(
      produce((_modals) => {
        const modal = _modals.find((modal) => modal.id === id);

        if (modal) {
          modal.visible = false;
        }
      }),
    );
  }

  // disable scrolling on the main window
  createEffect(() => {
    if (modals.some((modal) => modal.visible)) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "";
    }
  });

  const modalContext = useContext(ModalContext);

  modalContext.show = show;
  modalContext.hide = hide;

  function close(modal: PromptModal, result: boolean) {
    return function () {
      modal.onClose(result);
      hide(modal.id);
    };
  }

  return (
    <ModalContext.Provider value={modalContext}>
      <div class="modal_container">
        <For each={modals}>
          {(modal) => (
            <dialog
              open={modal.visible}
              id={modal.id}
              class="modal"
              onClick={(event) => {
                if (event.target === event.currentTarget) {
                  hide(modal.id);
                }
              }}
              ref={(ref) => {
                if (!ref) return;

                // change focus to dialog when it opens
                // next tab will focus the close button
                setTimeout(() => {
                  ref.setAttribute("tabindex", "32767");
                  ref.focus();
                  ref.removeAttribute("tabindex");
                });
              }}
            >
              <div class="wrapper">
                <div class="header">
                  <div class="title">
                    <h2>{modal.title}</h2>
                    {modal.subtitle && <h3>{modal.subtitle}</h3>}
                  </div>
                  {modal.onClose && !modal.prompt && (
                    <IconButton
                      class="close"
                      onClick={() => {
                        if (typeof modal.onClose === "function") {
                          modal.onClose();
                        }
                        hide(modal.id);
                      }}
                      id="window-close"
                      title="Close"
                    />
                  )}
                </div>
                {modal.content && <div class="content">{modal.content()}</div>}
                {modal.prompt && (
                  <div class="prompt">
                    <IconButton
                      onClick={close(modal, false)}
                      id="times-circle"
                      title="Confirm"
                    />
                    <IconButton
                      onClick={close(modal, true)}
                      id="check-circle"
                      title="Cancel"
                    />
                  </div>
                )}
              </div>
            </dialog>
          )}
        </For>
      </div>
    </ModalContext.Provider>
  );
}
