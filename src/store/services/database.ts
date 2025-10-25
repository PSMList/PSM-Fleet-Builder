import { createStore, produce } from 'solid-js/store';
import { crewDataPromise } from '../data/crew';
import { extensionDataPromise } from '../data/extension';
import { factionDataPromise } from '../data/faction';
import { rarityDataPromise } from '../data/rarity';
import { fortDataPromise, shipDataPromise } from '../data/ship';
import { treasureDataPromise } from '../data/treasure';
import { equipmentDataPromise } from '../data/equipment';
import { islandDataPromise } from '../data/island';
import { eventDataPromise } from '../data/event';
import { Item } from '@/common/Item/ItemCard';

export interface Database {
  extensions: Awaited<typeof extensionDataPromise>;
  factions: Awaited<typeof factionDataPromise>;
  rarities: Awaited<typeof rarityDataPromise>;
  crew: Awaited<typeof crewDataPromise>;
  treasures: Awaited<typeof treasureDataPromise>;
  equipments: Awaited<typeof equipmentDataPromise>;
  ships: Awaited<typeof shipDataPromise>;
  forts: Awaited<typeof fortDataPromise>;
  islands: Awaited<typeof islandDataPromise>;
  events: Awaited<typeof eventDataPromise>;
  items: Map<number, Item>;
}

const [database, setDatabase] = createStore<Database>({
  extensions: new Map(),
  factions: new Map(),
  rarities: new Map(),
  crew: new Map(),
  ships: new Map(),
  forts: new Map(),
  treasures: new Map(),
  equipments: new Map(),
  islands: new Map(),
  items: new Map(),
  events: new Map(),
});

const loadingPromise = new Promise<Database>((resolve) => {
  setDatabase(
    produce(async (_database) => {
      _database.extensions = await extensionDataPromise;
      _database.factions = await factionDataPromise;
      _database.rarities = await rarityDataPromise;
      _database.crew = await crewDataPromise;
      _database.ships = await shipDataPromise;
      _database.forts = await fortDataPromise;
      _database.treasures = await treasureDataPromise;
      _database.equipments = await equipmentDataPromise;
      _database.islands = await islandDataPromise;
      _database.events = await eventDataPromise;

      _database.items = new Map([
        ..._database.crew,
        ..._database.ships,
        ..._database.forts,
        ..._database.treasures,
        ..._database.equipments,
        ...(_database.islands as Map<number, Item>),
        ..._database.events,
      ]);

      resolve(_database);
    }),
  );
});

export const DatabaseService = { db: database, loadingPromise };
