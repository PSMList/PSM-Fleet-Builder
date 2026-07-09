// Global styles live in the shared "builder" chunk: store.tsx is imported by
// both entries, so importing index.scss here emits it into builder.css.
import "@/index.scss";

import {
  createContext,
  createEffect,
  ParentComponent,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";

import { useModal } from "@/common/Modal/ModalProvider";

type StorePromise = Promise<any>;

type StoreContextType = {
  addPlugin: (promise: StorePromise) => void;
};

const StoreContext = createContext<StoreContextType>();

export function useStore() {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }

  return context;
}

export const StoreProvider: ParentComponent = (props) => {
  const [promises, setPromises] = createStore<StorePromise[]>([]);

  const modal = useModal();

  createEffect(async () => {
    modal.show({
      id: "start-setup",
      title: "Loading data...",
    });

    try {
      const timeout = new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      await Promise.all(promises);
      await timeout;

      modal.hide("start-setup");
    } catch {
      modal.show({
        id: "start-setup",
        content: () =>
          "Please check your Internet connection and refresh, or contact administators...",
        title: "Failed to load data from PSMList.",
      });
    }
  });

  const storeContext: StoreContextType = {
    addPlugin: (promise) => {
      setPromises((prev) => [...prev, promise]);
    },
  };

  return (
    <StoreContext.Provider value={storeContext}>
      {props.children}
    </StoreContext.Provider>
  );
};
