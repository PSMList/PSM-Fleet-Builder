import IconButton from "@/components/commons/IconButton";
import { createContext, createEffect, For, JSX, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";
import './Modal.css';


type ModalProperties = {
    id: string
    inside: JSX.Element,
    title: string,
    onClose?: () => void
};

type ModalState = ModalProperties & { visible: boolean };

export const ModalContext = createContext({
    // createModal(properties: ModalProperties) { },
    showModal(properties: ModalProperties) { },
    hideModal(id: string) { },
});

type ModalProps = {
    properties: ModalState
}

const Modal = (props: ModalProps) => {

    const modalContext = useContext(ModalContext);

    return (
        <div classList={{ "modal-shadow": true, hidden: !props.properties.visible }} id={ props.properties.id }>
            <div class="modal-container">
                <h2 class="modal-header">
                    <span class="modal-title">{props.properties.title}</span>
                    <div class="modal-actions">
                        <IconButton
                            class="modal-close"
                            onClick={() => {
                                if (props.properties.onClose) props.properties.onClose();
                                modalContext.hideModal(props.properties.id);
                            }}
                            iconID="window-close" />
                    </div>
                </h2>
                <div class="modal-content">
                    {props.properties.inside}
                </div>
            </div>
        </div>
    );
}

export const ModalRoot = () => {

    const modalContext = useContext(ModalContext);
    const [modals, setModals] = createStore<ModalState[]>([]);

    modalContext.showModal = (properties: ModalProperties) => {
        setModals(produce( _modals => {
            const modal = _modals.find( modal => modal.id === properties.id);
            if (modal) {
                modal.visible = true;
            }
            else {
                const newModal: ModalState = {
                    ...properties,
                    visible: true
                }
                _modals.push(newModal);
            }
        }));
    }

    modalContext.hideModal = (id: string) => {
        setModals(produce( _modals => {
            const modal = _modals.find( modal => modal.id === id);
            if (modal) {
                modal.visible = false;
            }
            setModals(() => _modals);
        }));
    }

    // disable scrolling on the main window
    createEffect(() => {
        document.body.style.overflowY = modals.some( modal => modal.visible) ? 'hidden' : '';
    });

    return (
        <div id="modal-root">
            <For each={ modals }>
                {
                    modal => <Modal properties={ modal } />
                }
            </For>
        </div>
    )
}