import { createStore, produce } from 'solid-js/store';
import { crewDataPromise } from './crew';
import { extensionDataPromise } from './extension';
import { factionDataPromise } from './faction';
import { rarityDataPromise } from './rarity';
import { shipDataPromise } from './ship';
import { treasureDataPromise } from './treasure';
import { equipmentDataPromise } from './equipment';

interface Database {
  extensions: Awaited<typeof extensionDataPromise>;
  factions: Awaited<typeof factionDataPromise>;
  rarities: Awaited<typeof rarityDataPromise>;
  crews: Awaited<typeof crewDataPromise>;
  treasures: Awaited<typeof treasureDataPromise>;
  equipments: Awaited<typeof equipmentDataPromise>;
  ships: Awaited<typeof shipDataPromise>;
}

// eslint-disable-next-line solid/reactivity
const [database, setDatabase] = createStore<Database>({
  extensions: new Map(),
  factions: new Map(),
  rarities: new Map(),
  crews: new Map(),
  ships: new Map(),
  treasures: new Map(),
  equipments: new Map(),
});

const loadingPromise = new Promise((resolve, reject) => {
  setDatabase(
    produce(async (_database) => {
      try {
        _database.extensions = await extensionDataPromise;
        _database.factions = await factionDataPromise;
        _database.rarities = await rarityDataPromise;
        _database.treasures = await treasureDataPromise;
        _database.equipments = await equipmentDataPromise;
        _database.crews = await crewDataPromise;
        _database.ships = await shipDataPromise;
      } catch {
        reject();
      }

      // delay to avoid flickering
      setTimeout(() => {
        resolve({});
      }, 700);
    })
  );
});

export const DatabaseService = { database, loadingPromise };
