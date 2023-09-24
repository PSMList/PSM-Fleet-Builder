import Toast, {
  ToastPosition,
  ToastProps,
  ToastType,
} from "@/components/commons/Toast";
import { createContext, createSignal, For, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";
import "./Toast.css";

// source: https://github.com/uzoeddie/react-toast/blob/master/src/components/toast/Toast.js

interface ToastsProps {
  position: ToastPosition;
  autoDeleteTime?: number;
}

interface ToastInstanceType {
  properties: ToastProps;
  addCount: () => void;
}

export const ToastContext = createContext<{
  createToast: (properties: ToastType) => void;
}>({
  createToast() {
    //
  },
});

const Toasts = (props: ToastsProps) => {
  const toastContext = useContext(ToastContext);

  const [toastList, setToastList] = createStore<ToastInstanceType[]>([]);

  const deleteToast = (id: string) => {
    setToastList(
      produce((toastList) => {
        const toastIndex = toastList.findIndex(
          (toast) => toast.properties.id === id
        );
        if (toastIndex >= 0) {
          toastList.splice(toastIndex, 1);
          const container = document.getElementById("notification-container");
          const toastElement = container?.querySelector(
            `.notification:nth-child(${toastIndex * 2 + 1})`
          );
          if (toastElement) {
            toastElement.classList.add("hide");
          }
        }
      })
    );
  };

  const createToast = (properties: ToastType) => {
    const _properties = () => properties;
    const currentToast = toastList.find(
      (toast) => toast.properties.id === _properties().id
    );
    if (currentToast) {
      currentToast.addCount();
    } else {
      const [count, setCount] = createSignal(1);
      const newToast: ToastInstanceType = {
        properties: {
          ..._properties(),
          position: props.position,
          deleteToast,
          count,
        },
        addCount: () => setCount((oldCount: number) => oldCount + 1),
      };
      setToastList(
        produce((toastList) => {
          toastList.push(newToast);
        })
      );

      if (!props.autoDeleteTime) return;
      setTimeout(() => {
        deleteToast(newToast.properties.id);
      }, props.autoDeleteTime);
    }
  };

  toastContext.createToast = createToast;

  return (
    <div class={props.position} id="notification-container">
      <ToastContext.Provider value={toastContext}>
        <For each={toastList}>
          {(toast) => (
            <>
              <Toast {...toast.properties} />
              <hr />
            </>
          )}
        </For>
      </ToastContext.Provider>
    </div>
  );
};

export default Toasts;
