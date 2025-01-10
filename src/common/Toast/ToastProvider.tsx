// source: https://github.com/uzoeddie/react-toast/blob/master/src/components/toast/Toast.js

import "./ToastProvider.scss";

import { createContext, createSignal, For, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";

import {
  Toast,
  ToastPosition,
  ToastProps,
  ToastType,
} from "@/common/Toast/Toast";

interface ToastsProps {
  position: ToastPosition;
  autoDeleteTime?: number;
}

interface ToastInstanceType {
  properties: ToastProps;
  add: () => void;
}

interface ToastContextType {
  show: (properties: ToastType) => void;
}

export const ToastContext = createContext<ToastContextType>({
  show: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider(props: ToastsProps) {
  const [toasts, setToasts] = createStore(
    {} as Record<string, ToastInstanceType>,
  );

  function editToasts(edit: (edit: typeof toasts) => void) {
    setToasts(produce(edit));
  }

  function hide(id: string) {
    const toast = toasts[id];

    if (!toast) return;

    editToasts((_toasts) => {
      const toast = _toasts[id];

      if (!toast) return;

      toast.properties.hidden = true;
    });

    setTimeout(() => {
      editToasts((_toasts) => {
        delete _toasts[id];
      });
    }, 1000);
  }

  function show(toastProps: ToastType) {
    const currentToast = toasts[toastProps.id];

    if (currentToast) {
      currentToast.add();
      return;
    }

    const [count, setCount] = createSignal(1);

    const newToast: ToastInstanceType = {
      properties: {
        ...toastProps,
        hide,
        count,
      },
      add: () => setCount((prev) => prev + 1),
    };

    editToasts((toastList) => {
      toastList[toastProps.id] = newToast;
    });

    if (!props.autoDeleteTime) return;

    setTimeout(() => {
      hide(newToast.properties.id);
    }, props.autoDeleteTime);
  }

  const toast = useToast();

  toast.show = show;

  return (
    <ToastContext.Provider value={toast}>
      <div
        classList={{
          "toast-container": true,
          [props.position]: true,
        }}
      >
        <For each={Object.values(toasts)}>
          {(toast) => (
            <>
              <Toast {...toast.properties} />
              <hr />
            </>
          )}
        </For>
      </div>
    </ToastContext.Provider>
  );
}
