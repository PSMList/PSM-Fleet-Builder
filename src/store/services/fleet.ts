import { createEffect, createSignal, untrack } from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import { trackStore } from '@solid-primitives/deep';

import { Ship } from '../data/ship';
import { baseUrl, slugname } from '@/utils/config';
import { fleetDataToString, parseFleetData } from '@/utils/parse';
import { useToast } from '@/common/Toast/ToastProvider';
import { getFleetPoints } from '@/utils/points';
import { useDb } from '../store';
import { Item } from '@/common/Item/ItemCard';
import { Crew } from '../data/crew';
import { Equipment } from '../data/equipment';
import { fetchWithTimeout } from '@/utils/fetch';

export type FleetShip = Ship & {
  crew: Crew[];
  equipment: Equipment[];
  room?: () => number;
};

export interface FleetDataType {
  name: string;
  points: {
    current: number;
    max: number;
  };
  ispublic: boolean;
  data: FleetShip[];
  harbor: Item[];
  description: string;
}

export interface FleetSavedDataType {
  name: string;
  maxpoints: number;
  data: {
    id: number;
    crew?: { id: number }[];
    equipment?: { id: number }[];
  }[];
  ispublic: boolean;
  description: string;
}

const [fleet, setFleet] = createStore<FleetDataType>({
  name: 'My fleet',
  points: {
    current: 0,
    max: 40,
  },
  ispublic: false,
  data: [],
  harbor: [],
  description: '',
});

const [saved, setSaved] = createSignal(true);

const fleetDataRequest = fetch(`${baseUrl}/fleet/get/${slugname}`);

async function getFleetData() {
  let response;

  try {
    response = await fleetDataRequest;
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

  let data: FleetSavedDataType;

  try {
    data = await response.json();
  } catch {
    return 'Invalid fleet data.';
  }

  return data;
}

const loadingFleet = new Promise<void>(async (resolve) => {
  const toast = useToast();

  const result = await getFleetData();

  if (typeof result === 'string') {
    toast.show({
      id: result.toLowerCase().split(' ').slice(0, 4).join('-'),
      type: 'error',
      title: 'Loading fleet data',
      description: result,
    });

    return resolve();
  }

  const { db, loadingPromise: loadingDb } = useDb();

  await loadingDb;

  const newFleet = parseFleetData(result ?? {}, db);

  createEffect(() => {
    // track changes of deeply nested objects
    trackStore(fleet);

    untrack(() => {
      setFleet(
        produce((_fleet) => {
          _fleet.points.current = getFleetPoints(_fleet);
        }),
      );
    });

    setSaved(() => false);
  });

  setFleet(() => newFleet);
  setSaved(() => true);

  toast.show({
    id: 'success-load-fleet',
    type: 'success',
    title: 'Fleet data loaded',
    description: `${newFleet.name}`,
  });

  resolve();
});

async function save() {
  const fleetStr = fleetDataToString(fleet);

  const res = await fetchWithTimeout(`${baseUrl}/fleet/self/set/${slugname}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: fleetStr,
  });

  if (res.ok) {
    setSaved(() => true);
  }

  return res;
}

export const FleetService = {
  fleet,
  setFleet,
  saved,
  save,
  loadingPromise: loadingFleet,
};
