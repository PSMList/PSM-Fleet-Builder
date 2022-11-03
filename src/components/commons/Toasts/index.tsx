import { createContext, createRef, JSX } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import Toast, { ToastPosition, ToastProps, ToastType } from '../Toast';
import './Toast.css';

// source: https://github.com/uzoeddie/react-toast/blob/master/src/components/toast/Toast.js

type ToastsProps = {
    position: ToastPosition,
    autoDeleteTime?: number
}

export const ToastContext = createContext({
    createToast(properties: ToastType) { },
});

const Toasts = ({ position, autoDeleteTime }: ToastsProps) => {

    const toastContext = useContext(ToastContext);

    const [data, setData] = useState<{
        toastList: {
            id: number,
            element: JSX.Element
        }[]
    }>({
        toastList: []
    });

    if (autoDeleteTime) {
        useEffect(() => {
            const toastListCount = data.toastList.length;
            const timeout = setTimeout(() => {
                setData((oldData) => {
                    if (oldData.toastList.length !== toastListCount) return oldData;
                    const container = document.getElementById('notification-container');
                    const newData = {
                        toastList: oldData.toastList.filter( (_, index) => {
                            const toastElement = container?.querySelector(`:nth-child(${index * 2 + 1})`);
                            return toastElement && !toastElement.classList.contains('hide');
                        })
                    }
                    if (oldData.toastList.length !== toastListCount) return oldData;
                    return newData;
                });
            }, autoDeleteTime);

            return () => clearTimeout(timeout);
        });
    }

    const deleteToast = (id: number) => {
        const toastIndex = data.toastList.findIndex(toast => toast.id === id);
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
                        position,
                        deleteToast
                    } } />
                    <hr />
                </>
        }
        setData((oldData) => {
            oldData.toastList.push(newToast);
            return {
                toastList: oldData.toastList
            }
        });

        if (!autoDeleteTime) return;
        setTimeout(() => {
            deleteToast(newToast.id);
        }, autoDeleteTime);
    }

    toastContext.createToast = createToast;

    return (
        <>
            <div className={ position } id="notification-container">
                {
                    data.toastList.map( toast =>
                        toast.element
                    )
                }
            </div>
        </>
    );
}

export default Toasts;