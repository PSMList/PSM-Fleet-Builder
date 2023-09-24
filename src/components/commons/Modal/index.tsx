import IconButton from "@/components/commons/IconButton";
import {
  createContext,
  createEffect,
  For,
  JSX,
  Show,
  useContext,
} from "solid-js";
import { createStore, produce } from "solid-js/store";
import "./Modal.css";

export interface ModalProperties {
  id: string;
  content?: JSX.Element;
  title: string;
  onClose?: (() => void) | false;
}

type ModalState = ModalProperties & { visible: boolean };

export const ModalContext = createContext<{
  showModal: (properties: ModalProperties) => void;
  closeModal: (id: string) => void;
}>({
  showModal() {
    //
  },
  closeModal() {
    //
  },
});

interface ModalProps {
  properties: ModalState;
}

const Modal = (props: ModalProps) => {
  const modalContext = useContext(ModalContext);

  return (
    <div
      classList={{ "modal-shadow": true, hidden: !props.properties.visible }}
      id={props.properties.id}
    >
      <div class="modal-container">
        <Show
          when={props.properties.title || props.properties.onClose !== false}
        >
          <div class="modal-header">
            <h2 class="modal-title">{props.properties.title}</h2>
            <Show when={props.properties.onClose !== false}>
              <div class="modal-actions">
                <IconButton
                  class="modal-close"
                  onClick={() => {
                    if (typeof props.properties.onClose === "function") {
                      props.properties.onClose();
                    }
                    modalContext.closeModal(props.properties.id);
                  }}
                  iconID="window-close"
                  title="Close"
                />
              </div>
            </Show>
          </div>
        </Show>
        <Show when={props.properties.content}>
          <div class="modal-content">{props.properties.content}</div>
        </Show>
      </div>
    </div>
  );
};

export const ModalRoot = () => {
  const modalContext = useContext(ModalContext);
  const [modals, setModals] = createStore<ModalState[]>([]);

  modalContext.showModal = (properties: ModalProperties) => {
    setModals(
      produce((_modals) => {
        const modal = _modals.find((modal) => modal.id === properties.id);
        if (modal) {
          modal.visible = true;
          modal.onClose = properties.onClose;
          modal.title = properties.title;
        } else {
          const newModal: ModalState = {
            ...properties,
            visible: true,
          };
          _modals.push(newModal);
        }
      })
    );
  };

  modalContext.closeModal = (id: string) => {
    setModals(
      produce((_modals) => {
        const modal = _modals.find((modal) => modal.id === id);
        if (modal) {
          modal.visible = false;
        }
      })
    );
  };

  // disable scrolling on the main window
  createEffect(() => {
    if (modals.some((modal) => modal.visible)) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "";
    }
  });

  return (
    <ModalContext.Provider value={modalContext}>
      <div id="modal-root">
        <For each={modals}>{(modal) => <Modal properties={modal} />}</For>
      </div>
    </ModalContext.Provider>
  );
};
