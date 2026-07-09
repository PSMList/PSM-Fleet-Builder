import { trackStore } from "@solid-primitives/deep";
import {
  createContext,
  createEffect,
  ParentComponent,
  useContext,
} from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";

import { Item } from "@/common/Item/ItemCard";
import { useDb } from "@/store/services/database";
import { baseUrl, slugname } from "@/utils/config";
import { parseCollectionData } from "@/utils/parse";
import { useStore } from "../store";

export type CollectionDataType = {
  name: string;
  ispublic: boolean;
  description: string;
  slugname: string;
  items: Item[];
};

export type CollectionSavedDataType = {
  name: string;
  items: {
    id: number;
    count: number;
    info: string;
  }[];
  ispublic: boolean;
  slugname: string;
  description: string;
};

type CollectionContextType = {
  collections: CollectionDataType[];
  collection: CollectionDataType;
  setCollection: SetStoreFunction<CollectionDataType>;
};

const CollectionContext = createContext<CollectionContextType>();

export function useCollections() {
  return useContext(CollectionContext)!;
}

export const CollectionProvider: ParentComponent = (props) => {
  const [collections, setCollections] = createStore<CollectionDataType[]>([]);
  const [collection, setCollection] = createStore<CollectionDataType>({
    name: "",
    ispublic: false,
    description: "",
    slugname: "",
    items: [],
  });

  const { db, loadingPromise: loadingDb } = useDb();

  const isCollectionBuilder = location.pathname.includes("collection");

  const collectionDataRequest = fetch(
    `${baseUrl}/collection/get${isCollectionBuilder ? `/${slugname}` : ""}`,
  );

  async function getCollectionData() {
    let response;

    try {
      response = await collectionDataRequest;
    } catch {
      return "Network error.";
    }

    if (!response.ok) {
      switch (response.status) {
        case 403:
          return "Unauthorized or unauthenticated.";
        case 408:
          return "Network error.";
        case 500:
          return "Server error. Please try again later or contact support.";
      }
    }

    let data: CollectionSavedDataType[];

    try {
      data = await response.json();
    } catch {
      return "Invalid collection data.";
    }

    return data;
  }

  const loadingPromise = new Promise<void>(async (resolve) => {
    const result = await getCollectionData();

    if (typeof result === "string") {
      return resolve();
    }

    await loadingDb;

    const newCollections = parseCollectionData(result ?? [], db);

    createEffect(() => {
      // track changes of deeply nested objects
      trackStore(collections);
    });

    setCollections(() => newCollections);

    if (isCollectionBuilder) {
      const selectedCollection = newCollections.find(
        (c) => c.slugname === slugname,
      );

      if (selectedCollection) {
        setCollection(() => selectedCollection);

        document.body.querySelector("h1")!.innerText = selectedCollection.name;
      }
    }

    resolve();
  });

  const { addPlugin } = useStore();

  addPlugin(loadingPromise);

  return (
    <CollectionContext.Provider
      value={{ collections, collection, setCollection }}
    >
      {props.children}
    </CollectionContext.Provider>
  );
};
