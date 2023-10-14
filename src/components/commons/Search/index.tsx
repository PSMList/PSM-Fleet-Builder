import Input from "@/components/commons/Inputs/Input";
import Items from "@/components/commons/Items";
import { useStore } from "@/data/store";
import { capitalize } from "@/utils";
import { createMemo, createSignal, For, JSX, Show } from "solid-js";
import Icon from "../Icon";
import IconButton from "../IconButton";
import Select from "../Inputs/Select";
import { ItemType } from "../Item";
import "./Search.css";
import { baseUrl, useCardsCollapse } from "@/App";

export interface SearchItemType {
  element: JSX.Element;
  item: ItemType;
}

interface SearchProps {
  additionalInputs?: JSX.Element;
  placeholder: string;
  items: SearchItemType[];
  defaultFactionID?: string;
  hideFactionFilter?: true;
}

const defaultSearchQuery = new RegExp("", "i");

const Custom = {
  Official: "0",
  Custom: "1",
  Both: "2",
} as const;

type CustomKeys = (typeof Custom)[keyof typeof Custom];

const Search = (props: SearchProps) => {
  const [showFilters, setShowFilters] = createSignal(false);

  const [searchQuery, setQuery] = createSignal(defaultSearchQuery);

  const [factionFilter, setFactionFilter] = createSignal(
    parseInt(props.defaultFactionID ?? "-1")
  );
  const [extensionFilter, setExtensionFilter] = createSignal<number>(-1);
  const [sortFilter, setSortFilter] = createSignal("no-order");
  const [customFilter, setCustomFilter] = createSignal<CustomKeys>(Custom.Both);

  const { database } = useStore().databaseService;
  const extensions = () => Array.from(database.extensions.values());

  const [cardsCollapse, { toggle: toggleCardsCollapse }] = useCardsCollapse();

  const factionOptions = createMemo(() => {
    const _factions = Array.from(database.factions.values());
    const _factionOptions = _factions.map((faction) => ({
      id: faction.id.toString(),
      display: (
        <span>
          <img
            src={faction.icon ? `${baseUrl}/${faction.icon}` : undefined}
            onError={(event) => {
              event.currentTarget.style.height = "0";
              event.currentTarget.removeAttribute("src");
            }}
          />
          {faction.defaultname}
        </span>
      ),
    }));
    _factionOptions.unshift({
      id: "-1",
      display: (
        <span>
          <img />
          All factions
        </span>
      ),
    });

    return _factionOptions;
  });

  const extensionOptions = createMemo(() => {
    const _custom = !!+customFilter();
    const _extensions = (
      customFilter() === Custom.Both
        ? extensions()
        : extensions().filter((extension) => extension.custom === _custom)
    ).sort((a, b) => {
      if (a.searchsort != b.searchsort) {
        return a.searchsort - b.searchsort;
      }
      return a.name.localeCompare(b.name);
    });

    if (
      customFilter() !== Custom.Both &&
      !_extensions.some((extension) => extension.id === extensionFilter())
    ) {
      setExtensionFilter(() => -1);
    }

    const _extensionOptions = _extensions.map((extension) => ({
      id: extension.id.toString(),
      display: (
        <span>
          <img
            src={extension.icon ? `${baseUrl}/${extension.icon}` : undefined}
            onError={(event) => {
              event.currentTarget.style.height = "0";
              event.currentTarget.removeAttribute("src");
            }}
          />
          {extension.name}
        </span>
      ),
    }));
    _extensionOptions.unshift({
      id: "-1",
      display: (
        <span>
          <img />
          All expansions
        </span>
      ),
    });

    return _extensionOptions;
  });

  const sortOptions = createMemo(() => {
    const _filters = [{ id: "points", iconID: "coins", title: "Cost" }];
    if (!props.hideFactionFilter) {
      _filters.push({
        id: "faction.nameimg",
        iconID: "folder",
        title: "Faction",
      });
    }

    const _sortOptions = _filters
      .map((sort) => [
        {
          id: sort.id + "-up",
          display: (
            <span>
              <Icon iconID={sort.iconID} /> {capitalize(sort.title)} ascending
            </span>
          ),
        },
        {
          id: sort.id + "-down",
          display: (
            <span>
              <Icon iconID={sort.iconID} /> {capitalize(sort.title)} descending
            </span>
          ),
        },
      ])
      .flat();
    _sortOptions.unshift({
      id: "no-order",
      display: (
        <span>
          <Icon iconID="times-circle" /> No order
        </span>
      ),
    });

    return _sortOptions;
  });

  const customOptions = createMemo(() => {
    return [
      {
        id: Custom.Official,
        display: "Official",
      },
      {
        id: Custom.Custom,
        display: "Custom",
      },
      {
        id: Custom.Both,
        display: "Both",
      },
    ];
  });

  const searchByFaction = (factionID: string) => {
    setFactionFilter(() => parseInt(factionID));
  };

  const searchByExtension = (extensionID: string) => {
    setExtensionFilter(() => parseInt(extensionID));
  };

  const sortBy = (sortID: string) => {
    setSortFilter(() => sortID);
  };

  const searchByCustom = (customChoice: string) => {
    setCustomFilter(() => customChoice as CustomKeys);
  };

  const selectItems = createMemo(() => {
    const _factionFilter = factionFilter();
    const _extensionFilter = extensionFilter();
    const _custom = !!+customFilter();
    const _customBoth = customFilter() === Custom.Both;

    if (_factionFilter === -1 && _extensionFilter === -1 && _customBoth) {
      return props.items;
    }

    return props.items.filter(
      (element) =>
        (props.hideFactionFilter ||
          _factionFilter === -1 ||
          element.item.faction?.id === _factionFilter) &&
        (_extensionFilter === -1 ||
          element.item.extension.id === _extensionFilter) &&
        (_customBoth || _custom === element.item.custom)
    );
  });

  let inputRef: HTMLInputElement | HTMLTextAreaElement | undefined;

  const searchInItems = () => {
    setQuery(() => new RegExp(inputRef?.value ?? "", "i"));
  };

  const content = () => {
    const _searchQuery = searchQuery();
    if (_searchQuery === defaultSearchQuery) {
      // eslint-disable-next-line solid/components-return-once
      return (
        <h3 class="search_info">
          Enter any text in the search bar to show items.
          <br />
          (leave blank and click search to show all)
        </h3>
      );
    }

    const filteredItems: SearchItemType[] = [];

    for (const searchItem of selectItems()) {
      if (_searchQuery.test(searchItem.item.fullname)) {
        filteredItems.push(searchItem);
      }
    }

    if (!filteredItems.length) {
      // eslint-disable-next-line solid/components-return-once
      return <h3 class="search_info">No matching item.</h3>;
    }

    let sortedItems: SearchItemType[];

    const sortKey = sortFilter();

    if (sortKey === "no-order") {
      sortedItems = filteredItems;
    } else {
      const [sortID, sortOrder] = sortKey.split("-") as [
        keyof SearchItemType["item"],
        "up" | "down"
      ];

      const ordering = sortOrder === "up" ? 1 : -1;

      sortedItems = filteredItems.sort(
        (itemA, itemB) =>
          ((itemA.item[sortID] ?? "") > (itemB.item[sortID] ?? "") ? 1 : -1) *
          ordering
      );
    }

    return (
      <Items
        classList={{
          search_results: true,
          minimized: cardsCollapse(),
          maximized: !cardsCollapse(),
        }}
      >
        <For each={sortedItems}>{(item) => item.element}</For>
      </Items>
    );
  };

  return (
    <div class="search_container whitebox">
      <div class="search_inputs">
        <Input
          // @ts-expect-error ref should have the right type
          ref={inputRef}
          type="text"
          class="search_input"
          placeholder={props.placeholder}
          onValidate={searchInItems}
        />
        <IconButton
          iconID="search"
          title="Search"
          onClick={() => searchInItems()}
          primary={true}
        />
        <IconButton
          iconID={cardsCollapse() ? "expand-arrows-alt" : "compress-arrows-alt"}
          title={cardsCollapse() ? "Expand cards" : "Compress cards"}
          onClick={toggleCardsCollapse}
        />
        <IconButton
          class="toggle_filters"
          iconID="filter"
          onClick={() => setShowFilters((previous) => !previous)}
        />
        <Show when={showFilters()}>
          <Show when={!props.hideFactionFilter}>
            <Select
              defaultSelectText="Select faction"
              class="search_faction"
              onOptionSelect={searchByFaction}
              optionsList={factionOptions()}
              defaultSelectOption={props.defaultFactionID}
            />
          </Show>
          <Select
            defaultSelectText="Select custom"
            class="search_custom"
            onOptionSelect={searchByCustom}
            optionsList={customOptions()}
          />
          <Select
            defaultSelectText="Select expansion"
            class="search_extension"
            onOptionSelect={searchByExtension}
            optionsList={extensionOptions()}
            value={
              customFilter() === Custom.Both ||
              !!+customFilter() ===
                database.extensions.get(extensionFilter())?.custom
                ? ""
                : extensionFilter().toString()
            }
          />
          <Select
            defaultSelectText="Select sorting"
            class="sort_results"
            onOptionSelect={sortBy}
            optionsList={sortOptions()}
          />
          {props.additionalInputs}
        </Show>
      </div>
      {content()}
    </div>
  );
};

export default Search;
