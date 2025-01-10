import { createEffect } from 'solid-js';
import { createStore } from 'solid-js/store';
import { trackStore } from '@solid-primitives/deep';

import { baseUrl } from '@/utils/config';
import { parseCollectionData } from '@/utils/parse';
import { Item } from '@/common/Item/ItemCard';
import { useDb } from '../store';

export type CollectionDataType = {
  name: string;
  ispublic: boolean;
  description: string;
  items: Item[];
}[];

export type CollectionSavedDataType = {
  name: string;
  data: {
    id: number;
    count: number;
    info: string;
  }[];
  ispublic: boolean;
  description: string;
}[];

const [collections, setCollections] = createStore<CollectionDataType>([]);

const collectionDataRequest = fetch(`${baseUrl}/collection/get`);

async function getCollectionData() {
  let response;

  try {
    response = await collectionDataRequest;
  } catch (error) {
    console.log(error);

    return 'Network error.';
  }

  if (!response.ok) {
    switch (response.status) {
      case 403:
        return 'Unauthorized or unauthenticated.';
      case 408:
        return 'Network error.';
      case 500:
        return 'Server error. Please try again later or contact support.';
    }
  }

  let data: CollectionSavedDataType;

  try {
    data = await response.json();
  } catch {
    return 'Invalid collection data.';
  }

  return data;
}

const loadingPromise = new Promise<void>(async (resolve) => {
  const result = await getCollectionData();

  if (typeof result === 'string') {
    return resolve();
  }

  const { db, loadingPromise: loadingDb } = useDb();

  await loadingDb;

  const newCollections = parseCollectionData(result ?? {}, db);

  createEffect(() => {
    // track changes of deeply nested objects
    trackStore(collections);
  });

  setCollections(() => newCollections);

  resolve();
});

export const CollectionService = {
  collections,
  setCollections,
  loadingPromise,
};
