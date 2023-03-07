import Toast, { ToastPosition, ToastType } from "@/components/commons/Toast";
import { createContext, createSignal, For, JSX, onCleanup, onMount, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";
import './Toast.css';

// source: https://github.com/uzoeddie/react-toast/blob/master/src/components/toast/Toast.js

type ToastsProps = {
    position: ToastPosition,
    autoDeleteTime?: number
}

type ToastInstanceType = {
    id: string,
    addCount: () => void,
    element: JSX.Element
}

export const ToastContext = createContext({
    createToast(properties: ToastType) { },
});

const Toasts = (props: ToastsProps) => {

    const toastContext = useContext(ToastContext);

    const [toastList, setToastList] = createStore<ToastInstanceType[]>([]);

    const deleteToast = (id: string) => {
        setToastList(produce((toastList) => {
            const toastIndex = toastList.findIndex(toast => toast.id === id);
            if (toastIndex >= 0) {
                toastList.splice(toastIndex, 1);
                const container = document.getElementById('notification-container');
                const toastElement = container?.querySelector(`.notification:nth-child(${toastIndex * 2 + 1})`);
                if (toastElement) {
                    toastElement.classList.add('hide');
                }
            }
        }));
    }

    const createToast = (properties: ToastType) => {
        const currentToast = toastList.find( toast => toast.id === properties.id);
        if (currentToast) {
            currentToast.addCount();
        }
        else {
            const [ count, setCount ] = createSignal(1);
            const newToast: ToastInstanceType = {
                id: properties.id,
                addCount: () => setCount((oldCount: number) => oldCount + 1),
                element: 
                    <>
                        <Toast { ...{
                            ...properties,
                            position: props.position,
                            deleteToast,
                            count
                        } } />
                        <hr />
                    </>
            }
            setToastList(produce(toastList => {
                toastList.push(newToast);
            }));

            if (!props.autoDeleteTime) return;
            setTimeout(() => {
                deleteToast(newToast.id);
            }, props.autoDeleteTime);
        }
    }

    toastContext.createToast = createToast;

    return (
        <div class={ props.position } id="notification-container">
            <For each={
                toastList
            }>
                {
                    toast => toast.element
                }
            </For>
        </div>
    );
}

export default Toasts;