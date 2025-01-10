import { ExtendedCard, Item, ItemValue } from "@/common/Item/ItemCard";
import { CrewCard } from "./Crew/CrewCard/CrewCard";
import { ShipCard } from "./Ship/ShipCard/ShipCard";
import { TreasureCard } from "./Treasure/TreasureCard/TreasureCard";
import { EquipmentCard } from "./Equipment/EquipmentCard/EquipmentCard";
import { IslandCard } from "./Island/IslandCard/IslandCard";

export const ItemCards = {
  [ItemValue.Crew]: CrewCard,
  [ItemValue.Ship]: ShipCard,
  [ItemValue.Treasure]: TreasureCard,
  [ItemValue.Equipment]: EquipmentCard,
  [ItemValue.Island]: IslandCard,
} as Record<ItemValue, ExtendedCard<Item>>;
