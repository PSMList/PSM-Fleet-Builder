import { onlyDisplay, useCardsCollapse } from "@/App";
import IconButton from "@/components/commons/IconButton";
import Search, { SearchItemType } from "@/components/commons/Search";
import { CrewItemsContext } from "@/components/Crew";
import CrewItem from "@/components/Crew/CrewItem";
import { CrewType } from "@/data/crew";
import { useStore } from "@/data/store";
import { createEffect, createSignal, useContext } from "solid-js";
import "./CrewSearch.css";

interface CrewSearchProps {
  defaultFactionID: string;
}

const CrewSearch = (props: CrewSearchProps) => {
  // eslint-disable-next-line solid/components-return-once
  if (onlyDisplay) return <></>;

  const crewItemsContext = useContext(CrewItemsContext);
  const [cardsCollapse] = useCardsCollapse();

  const { database } = useStore().databaseService;

  const selectItem = (crew: CrewType) => {
    crewItemsContext.add(crew);
  };

  const [elements, setElements] = createSignal([] as SearchItemType[]);
  createEffect(() => {
    const crews = Array.from(database.crews.values());
    setElements(() =>
      crews.map(
        (crew: CrewType) =>
          ({
            item: crew,
            search_field: crew.fullname,
            element: (
              <CrewItem
                data={crew}
                actions={
                  <IconButton
                    iconID="plus-square"
                    onClick={() => selectItem(crew)}
                    title="Add crew"
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
      placeholder="Search by crew name or ID"
      defaultFactionID={props.defaultFactionID}
      items={elements()}
    />
  );
};

export default CrewSearch;
