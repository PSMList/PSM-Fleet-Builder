import Toast, { ToastPosition, ToastType } from "@/components/commons/Toast";
import { createContext, For, JSX, onCleanup, onMount, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";
import './Toast.css';

// source: https://github.com/uzoeddie/react-toast/blob/master/src/components/toast/Toast.js

type ToastsProps = {
    position: ToastPosition,
    autoDeleteTime?: number
}

export const ToastContext = createContext({
    createToast(properties: ToastType) { },
});

const Toasts = (props: ToastsProps) => {

    const toastContext = useContext(ToastContext);

    const [toastList, setToastList] = createStore<{ id: number, element: JSX.Element }[]>([]);

    if (props.autoDeleteTime) {
        let timeout = -1;
        onMount(() => {
            const toastListCount = toastList.length;
            timeout = setTimeout(() => {
                if (toastList.length !== toastListCount) return;
                setToastList(produce(toastList => {
                    const container = document.getElementById('notification-container');
                    toastList.filter( (_, index, _toastList) => {
                        const toastElement = container?.querySelector(`:nth-child(${index * 2 + 1})`);
                        if (toastElement && !toastElement.classList.contains('hide')) {
                            _toastList.splice(index, 1);
                        }
                    });
                }));
            }, props.autoDeleteTime);
        });
        onCleanup(() => clearTimeout(timeout));
    }

    const deleteToast = (id: number) => {
        const toastIndex = toastList.findIndex(toast => toast.id === id);
        if (toastIndex >= 0) {
            const container = document.getElementById('notification-container');
            const toastElement = container?.querySelector(`.notification:nth-child(${toastIndex * 2 + 1})`);
            if (toastElement) {
                toastElement.classList.add('hide');
            }
        }
    }

    const createToast = (properties: ToastType) => {
        const id = Math.random();
        const newToast = {
            id,
            element: 
                <>
                    <Toast { ...{
                        ...properties,
                        id,
                        position: props.position,
                        deleteToast
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