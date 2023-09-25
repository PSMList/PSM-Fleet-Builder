import { onlyDisplay, useCardsCollapse } from "@/App";
import IconButton from "@/components/commons/IconButton";
import Search, { SearchItemType } from "@/components/commons/Search";
import { TreasureItemsContext } from "@/components/Treasure";
import TreasureItem from "@/components/Treasure/TreasureItem";
import { TreasureType } from "@/data/treasure";
import { useStore } from "@/data/store";
import { createEffect, createSignal, useContext } from "solid-js";
import "./TreasureSearch.css";

const TreasureSearch = () => {
  // eslint-disable-next-line solid/components-return-once
  if (onlyDisplay) return <></>;

  const treasureItemsContext = useContext(TreasureItemsContext);
  const [cardsCollapse] = useCardsCollapse();

  const { database } = useStore().databaseService;

  const selectItem = (treasure: TreasureType) => {
    treasureItemsContext.add(treasure);
  };

  const [elements, setElements] = createSignal([] as SearchItemType[]);
  createEffect(() => {
    const treasures = Array.from(database.treasures.values());
    setElements(() =>
      treasures.map(
        (treasure: TreasureType) =>
          ({
            item: treasure,
            search_field: treasure.fullname,
            element: (
              <TreasureItem
                data={treasure}
                actions={
                  <IconButton
                    iconID="plus-square"
                    onClick={() => selectItem(treasure)}
                    title="Add treasure"
                  />
                }
                collapse={cardsCollapse()}
              />
            ),
          } as SearchItemType)
      )
    );
  });

  return (
    <Search
      placeholder="Search by treasure name or ID"
      items={elements()}
      hideFactionFilter={true}
    />
  );
};

export default TreasureSearch;
