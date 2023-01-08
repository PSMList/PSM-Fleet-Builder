import { createStore, produce } from "solid-js/store";
import { crewDataPromise } from "./crew";
import { extensionDataPromise } from "./extension";
import { factionDataPromise } from "./faction";
import { rarityDataPromise } from "./rarity";
import { shipDataPromise } from "./ship";

type Database = {
    extensions: Awaited<typeof extensionDataPromise>
    factions: Awaited<typeof factionDataPromise>
    rarities: Awaited<typeof rarityDataPromise>
    crews: Awaited<typeof crewDataPromise>
    ships: Awaited<typeof shipDataPromise>
}

const databaseStore = createStore<Database>({
    extensions: [],
    factions: [],
    raritys: [],
    crews: [],
    ships: []
} as any);

export const DatabaseService = () => {
    const [database, setDatabase] = databaseStore;

    const loadingPromise = new Promise((resolve) => {
        setDatabase(produce(async (_database) => {
            _database.extensions = await extensionDataPromise;
            _database.factions = await factionDataPromise;
            _database.rarities = await rarityDataPromise;
            _database.crews = await crewDataPromise;
            _database.ships = await shipDataPromise;

            resolve('');
        }));
    });

    return { database, loadingPromise };
}
