import {
  createContext,
  createEffect,
  createResource,
  ParentComponent,
  useContext,
} from "solid-js";
import { DatabaseService } from "./services/database";
import { useModal } from "@/common/Modal/hooks";
import { FleetService } from "./services/fleet";
import { CollectionService } from "./services/collection";

const rootState = {
  databaseService: DatabaseService,
  fleetService: FleetService,
  collectionService: CollectionService,
};

const StoreContext = createContext(rootState);

export function useDb() {
  return useContext(StoreContext).databaseService;
}
export function useFleet() {
  return useContext(StoreContext).fleetService;
}
export function useCollections() {
  return useContext(StoreContext).collectionService;
}

export const StoreProvider: ParentComponent = (props) => {
  const [data] = createResource(() =>
    Promise.all(
      Object.values(rootState).map((service) => service.loadingPromise),
    ),
  );

  const modal = useModal();

  createEffect(() => {
    switch (data.state) {
      case "refreshing":
      case "pending":
        modal.show({
          id: "start-setup",
          title: "Loading data...",
        });
        break;
      case "ready":
        modal.hide("start-setup");
        break;
      case "errored":
      case "unresolved":
        modal.show({
          id: "start-setup",
          content: () =>
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
