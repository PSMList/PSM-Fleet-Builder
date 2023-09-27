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

  const [toastList, setToastList] = createStore<
    Record<string, ToastInstanceType | undefined>
  >({});

  const deleteToast = (id: string) => {
    const toast = toastList[id];
    if (toast) {
      setToastList(
        produce((toastList) => {
          const toast = toastList[id];
          if (toast) {
            toast.properties.hide = true;
          }
        })
      );
      setTimeout(() => {
        setToastList(
          produce((toastList) => {
            toastList[id] = undefined;
          })
        );
      }, 1000);
    }
  };

  const createToast = (properties: ToastType) => {
    const _properties = () => properties;
    const currentToast = toastList[properties.id];
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
          toastList[properties.id] = newToast;
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
        <For each={Object.values(toastList)}>
          {(toast) =>
            toast && (
              <>
                <Toast {...toast.properties} />
                <hr />
              </>
            )
          }
        </For>
      </ToastContext.Provider>
    </div>
  );
};

export default Toasts;
