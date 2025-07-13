import { Item } from '@/common/Item/ItemCard';
import { Crew } from '@/store/data/crew';
import { Equipment } from '@/store/data/equipment';
import {
  CollectionSavedDataType,
  CollectionDataType,
} from '@/store/services/collection';
import { Database } from '@/store/services/database';
import {
  FleetDataType,
  FleetSavedDataType,
  FleetShip,
} from '@/store/services/fleet';

export function parseFleetData(
  savedData: FleetSavedDataType,
  db: Database,
): FleetDataType {
  const ships: FleetShip[] = [];
  const harbor: Item[] = [];

  for (const { id: itemId, crew, equipment } of savedData.data) {
    const ship = db.ships.get(itemId);

    if (ship && crew && equipment) {
      const _crew = [];
      const _equipment = [];

      if (crew) {
        for (const { id: crewID } of crew) {
          const crewData = db.crew.get(crewID);

          if (!crewData) continue;

          _crew.push({
            ...crewData,
          });
        }
      }

      if (equipment) {
        for (const { id: equipmentID } of equipment) {
          const equipmentData = db.equipments.get(equipmentID);

          if (!equipmentData) continue;

          _equipment.push({
            ...equipmentData,
          });
        }
      }

      ships.push({
        ...ship,
        crew: _crew,
        equipment: _equipment,
      });

      continue;
    }

    const item = db.items.get(itemId);

    if (!item) continue;

    harbor.push({
      ...item,
    });
  }

  return {
    name: savedData.name,
    points: {
      current: 0,
      max: savedData.maxpoints,
    },
    data: ships,
    harbor,
    ispublic: savedData.ispublic,
    description: savedData.description,
  };
}

export function fleetDataToString(fleet: FleetDataType) {
  try {
    const data = [];

    for (const ship of fleet.data) {
      data.push({
        id: ship.id,
        crew: ship.crew.map(
          (crew) =>
            ({
              id: crew.id,
            }) as Crew,
        ),
        equipment: ship.equipment.map(
          (equipment) =>
            ({
              id: equipment.id,
            }) as Equipment,
        ),
      });
    }

    for (const treasure of fleet.harbor) {
      data.push({
        id: treasure.id,
      });
    }

    return JSON.stringify({
      name: fleet.name,
      maxpoints: fleet.points.max,
      data,
      ispublic: fleet.ispublic,
      description: fleet.description,
    } as FleetSavedDataType);
  } catch {
    return;
  }
}

export function parseCollectionData(
  savedData: CollectionSavedDataType,
  db: Database,
): CollectionDataType {
  const dbItems = db.items;

  const collectionsData = [];

  for (const collection of savedData) {
    const items = [];

    for (const { id: itemId } of collection.data) {
      const item = dbItems.get(itemId);

      if (!item) continue;

      items.push(item);
    }

    collectionsData.push({
      name: collection.name,
      ispublic: collection.ispublic,
      description: collection.description,
      items,
    });
  }

  return collectionsData;
}
