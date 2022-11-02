import { createContext, JSX } from 'preact';
import { useContext, useState } from 'preact/hooks';
import IconButton from '../IconButton';
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
    // showModal(id: string) { },
    hideModal() { },
});

// type ModalProps = {
//     onOpen: () => void
// } & ModalProperties;

// const Modal = ({ id, inside, title, onClose, onOpen }: ModalProps) => {

//     const modalContext = useContext(ModalContext);

//     useEffect(() => {
//         modalContext.createModal({
//             id,
//             inside,
//             title,
//             onClose
//         });
//     });

//     modalContext.createModal();

//     return (
//         <></>
//     );
// }

// export default Modal;

type ModalContainerProps = {
    modal: ModalState
}

const ModalContainer = ({ modal }: ModalContainerProps) => {

    const modalContext = useContext(ModalContext);

    // return useMemo<JSX.Element>(() =>
    return (
        <div className={"modal-shadow" + (modal.visible ? '' : ' hidden')} id={ modal.id }>
            <div class="modal-container">
                <h3 class="modal-header">
                    <span class="modal-title">{modal.title}</span>
                    <div class="modal-actions">
                        <IconButton
                            class="modal-close"
                            onClick={() => {
                                if (modal.onClose) modal.onClose();
                                modalContext.hideModal();
                            }}
                            iconID="window-close" />
                    </div>
                </h3>
                <div class="modal-content">
                    {modal.inside}
                </div>
            </div>
        </div>
    );
        // , [modal.visible]);
}

const initialState: ModalState = { id: '', visible: false, title: '', inside: <></>, onClose: () => { } };

export const ModalRoot = () => {

    const modalContext = useContext(ModalContext);

    const [state, setState] = useState<{ currentModal: ModalState, oldModals: ModalState[] }>({
        currentModal: initialState,
        oldModals: []
    });

    modalContext.showModal = (properties: ModalProperties) => {
        const newModal: ModalState = {
            ...properties,
            visible: true
        }
        state.currentModal = newModal;
        // state.oldModals.push(newModal);
        return setState(() => ({ ...state }));
    }

    // modalContext.createModal = (properties: ModalProperties) => {
    //     const newModal: ModalState = {
    //         ...properties,
    //         visible: true
    //     }
    //     state.modals.push(newModal);
    //     return setState(() => ({ ...state }));
    // }

    // modalContext.showModal = (id: string) => {
    //     const newModal = state.modals.find(modal => modal.id === id);
    //     if (!newModal) return;
    //     state.currentModal = newModal;
    //     return setState(() => ({ ...state }));
    // }

    modalContext.hideModal = () => {
        state.currentModal.visible = false;
        return setState(() => ({ ...state }));
    }

    // disable scrolling on the main window
    document.body.style.overflowY = state.currentModal.visible ? 'hidden' : '';

    return (
        <>
            <ModalContainer modal={ state.currentModal } />
            {/* {
                state.modals.map((modal, index) =>
                    <ModalContainer modal={modal} key={index} />
                )
            } */}
        </>
    )
}