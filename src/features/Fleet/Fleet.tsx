import "./Fleet.scss";

import { Show } from "solid-js";
import { produce } from "solid-js/store";

import { ItemsProvider } from "@/common/Item/ItemsProvider";
import { FleetProvider, useFleet } from "@/store/services/fleet";
import { isOwn } from "@/utils/config";
import { FleetDisplay } from "./FleetDisplay";

function FleetBuilderContent() {
  const { fleet, setFleet } = useFleet();

  return (
    <ItemsProvider
      items={fleet.data}
      onChange={(items) => {
        setFleet(
          produce((_fleet) => {
            for (const item of items) {
              if (!item.crew) item.crew = [];
              if (!item.equipment) item.equipment = [];
            }
            _fleet.data = items;
          }),
        );
      }}
    >
      <Show when={!isOwn && fleet.description}>
        <div class="description whitebox">
          <textarea
            readonly
            ref={(ref) => {
              setTimeout(() => {
                ref.style.height = ref.scrollHeight.toString() + "px";
              });
            }}
          >
            {fleet.description}
          </textarea>
        </div>
      </Show>
      <FleetDisplay />
    </ItemsProvider>
  );
}

export function FleetBuilder() {
  return (
    <FleetProvider>
      <FleetBuilderContent />
    </FleetProvider>
  );
}
