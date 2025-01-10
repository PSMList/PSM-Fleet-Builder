import { FleetDataType } from '@/store/services/fleet';

export function getShipCost(ship: Partial<FleetDataType['data'][0]>) {
  let current = 0;

  for (const crew of ship.crew ?? []) {
    current += crew.points;
  }

  for (const equipment of ship.equipment ?? []) {
    current += equipment.points;
  }

  return current;
}

export function getFleetPoints(fleet: Partial<FleetDataType>) {
  let current = 0;

  for (const ship of fleet.data ?? []) {
    current += ship.points;
    current += getShipCost(ship);
  }

  return current;
}
