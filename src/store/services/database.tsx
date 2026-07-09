import { createStore, produce } from "solid-js/store";
import { crewDataPromise } from "../data/crew";
import { extensionDataPromise } from "../data/extension";
import { factionDataPromise } from "../data/faction";
import { rarityDataPromise } from "../data/rarity";
import { fortDataPromise, shipDataPromise } from "../data/ship";
import { treasureDataPromise } from "../data/treasure";
import { equipmentDataPromise } from "../data/equipment";
import { islandDataPromise } from "../data/island";
import { eventDataPromise } from "../data/event";
import { Item } from "../../common/Item/ItemCard";
import { createContext, ParentComponent, useContext } from "solid-js";
import { useStore } from "../store";

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

type DatabaseContextType = {
  db: Database;
  loadingPromise: Promise<Database>;
};

const DatabaseContext = createContext<DatabaseContextType>();

export function useDb() {
  const context = useContext(DatabaseContext);

  if (!context) {
    throw new Error("useDb must be used within a DatabaseProvider");
  }

  return context;
}

export const DatabaseProvider: ParentComponent = (props) => {
  const [db, setDb] = createStore<Database>({
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

  const loadingDb = new Promise<Database>((resolve) => {
    setDb(
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

  const { addPlugin } = useStore();

  addPlugin(loadingDb);

  return (
    <DatabaseContext.Provider value={{ db, loadingPromise: loadingDb }}>
      {props.children}
    </DatabaseContext.Provider>
  );
};
