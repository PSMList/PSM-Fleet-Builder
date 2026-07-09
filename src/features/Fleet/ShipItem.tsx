import { For, JSX, Show } from "solid-js";

import { ShipCard } from "../items/Ship/ShipCard/ShipCard";
import { FleetShip } from "@/store/services/fleet";
import { baseImg } from "@/utils/config";
import { plural } from "@/utils/string";

export function ShipItemBase({
  item,
  actions,
}: {
  item: FleetShip;
  actions?: JSX.Element;
}) {
  return (
    <ShipCard item={item} actions={actions}>
      <Show when={item.room?.()}>
        <ul class="cargo">
          <li class="expand">
            <span class="points">
              {item.crew.reduce((total, crew) => total + crew.points, 0) +
                item.equipment.reduce(
                  (total, equipment) => total + equipment.points,
                  0,
                )}
            </span>
            <Show when={item.crew.length}>
              <span>{item.crew.length} crew</span>
            </Show>
            <Show when={item.equipment.length}>
              <span>
                {item.equipment.length}{" "}
                {plural("equipment", item.equipment.length)}
              </span>
            </Show>
          </li>
          <For each={item.crew}>
            {(crew) => (
              <li class="collapse">
                <span class="points">{crew.points}</span>
                <span class="name">{crew.fullname}</span>
                <img
                  class="faction"
                  src={`${baseImg}/${crew.faction.icon}`}
                  alt={crew.faction.name}
                />
              </li>
            )}
          </For>
          <For each={item.equipment}>
            {(equipment) => (
              <li class="collapse">
                <span class="points">{equipment.points}</span>
                <span class="name">{equipment.fullname}</span>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </ShipCard>
  );
}
