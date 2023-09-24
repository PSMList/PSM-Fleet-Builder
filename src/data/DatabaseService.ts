import { createStore, produce } from 'solid-js/store';
import { crewDataPromise } from './crew';
import { extensionDataPromise } from './extension';
import { factionDataPromise } from './faction';
import { rarityDataPromise } from './rarity';
import { shipDataPromise } from './ship';

interface Database {
  extensions: Awaited<typeof extensionDataPromise>;
  factions: Awaited<typeof factionDataPromise>;
  rarities: Awaited<typeof rarityDataPromise>;
  crews: Awaited<typeof crewDataPromise>;
  ships: Awaited<typeof shipDataPromise>;
}

// eslint-disable-next-line solid/reactivity
const [database, setDatabase] = createStore<Database>({
  extensions: new Map(),
  factions: new Map(),
  rarities: new Map(),
  crews: new Map(),
  ships: new Map(),
});

const loadingPromise = new Promise((resolve, reject) => {
  setDatabase(
    produce(async (_database) => {
      try {
        _database.extensions = await extensionDataPromise;
        _database.factions = await factionDataPromise;
        _database.rarities = await rarityDataPromise;
        _database.crews = await crewDataPromise;
        _database.ships = await shipDataPromise;
      } catch {
        reject();
      }

      // delay to avoid flickering
      setTimeout(() => {
        resolve('');
      }, 700);
    })
  );
});

export const DatabaseService = { database, loadingPromise };
