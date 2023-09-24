import {
  createContext,
  createEffect,
  createResource,
  onMount,
  ParentComponent,
  useContext,
} from "solid-js";
import { DatabaseService } from "./DatabaseService";
import { ModalContext } from "@/components/commons/Modal";

export interface RootState {
  databaseService: typeof DatabaseService;
}

const rootState: RootState = {
  databaseService: DatabaseService,
};

const StoreContext = createContext<RootState>(rootState);

export const useStore = () => useContext(StoreContext);

export const StoreProvider: ParentComponent = (props) => {
  const [data] = createResource(() => rootState.databaseService.loadingPromise);

  const modalContext = useContext(ModalContext);

  onMount(() => {
    modalContext.showModal({
      id: "start-setup",
      title: "Loading the Fleet Builder...",
      onClose: false,
    });
  });

  createEffect(() => {
    switch (data.state) {
      case "ready":
        modalContext.closeModal("start-setup");
        break;
      case "errored":
      case "unresolved":
        modalContext.showModal({
          id: "start-setup",
          content:
            "Please check your Internet connection and refresh, or contact administators...",
          title: "Failed to load data from PSMList.",
        });
        break;
    }
  });

  return (
    <StoreContext.Provider value={rootState}>
      {props.children}
    </StoreContext.Provider>
  );
};
