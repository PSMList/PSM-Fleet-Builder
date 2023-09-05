import ValidationInput from "@/components/commons/Inputs/ValidationInput";
import Items from "@/components/commons/Items";
import { useStore } from "@/data/store";
import { capitalize, nestedKey } from "@/utils";
import { createMemo, createSignal, For, JSX, Show } from "solid-js";
import Icon from "../Icon";
import IconButton from "../IconButton";
import Select from "../Inputs/Select";
import { ItemType } from "../Item";
import "./Search.css";

export type SearchItemType = {
  element: JSX.Element;
  item: ItemType;
};

type SearchProps = {
  additionalInputs?: JSX.Element;
  placeholder: string;
  items: SearchItemType[];
  defaultFactionID?: string;
};

const defaultSearchQuery = new RegExp("", "i");

enum Custom {
  None = "0",
  Include = "1",
  Only = "2",
}

const Search = (props: SearchProps) => {
  const [showFilters, setShowFilters] = createSignal(false);

  const [searchQuery, setQuery] = createSignal(defaultSearchQuery);

  const [factionFilter, setFactionFilter] = createSignal(-1);
  const [extensionFilter, setExtensionFilter] = createSignal(-1);
  const [sortFilter, setSortFilter] = createSignal("");
  const [customFilter, setCustomFilter] = createSignal(Custom.Include as string);

  const { database } = useStore().databaseService;

  const factionOptions = createMemo(() => {
    const _factions = Array.from(database.factions.values());
    const _factionOptions = _factions.map((faction) => ({
      value: faction.id.toString(),
      display: (
        <span>
          <img
            src={`${window.baseUrl}/img/flag/flat/normal/${faction.nameimg}.png`}
            onError={({ target: ref }) => {
              (ref as HTMLImageElement).style.height = "0";
            }}
          />
          {faction.defaultname}
        </span>
      ),
    }));
    _factionOptions.unshift({
      value: "-1",
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
    const _extensions = Array.from(database.extensions.values());
    const _extensionOptions = _extensions.map((extension) => ({
      value: extension.id.toString(),
      display: (
        <span>
          <img
            src={`${window.baseUrl}/img/logos/logo_${extension.short.replace(/U$/, "")}.png`}
            onError={({ target: ref }) => {
              (ref as HTMLImageElement).style.height = "0";
            }}
          />
          {extension.name}
        </span>
      ),
    }));
    _extensionOptions.unshift({
      value: "-1",
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
    const _sortOptions = [
      { id: "points", iconID: "coins", title: "Cost" },
      { id: "faction.nameimg", iconID: "folder", title: "Faction" },
    ]
      .map((sort) => [
        {
          value: sort.id + "-up",
          display: (
            <span>
              <Icon iconID={sort.iconID} /> {capitalize(sort.title)} ascending
            </span>
          ),
        },
        {
          value: sort.id + "-down",
          display: (
            <span>
              <Icon iconID={sort.iconID} /> {capitalize(sort.title)} descending
            </span>
          ),
        },
      ])
      .flat();
    _sortOptions.unshift({
      value: "",
      display: (
        <span>
          <Icon iconID="times-circle" /> No sort
        </span>
      ),
    });

    return _sortOptions;
  });

  const customOptions = createMemo(() => {
    return [
      {
        value: Custom.None,
        display: "None",
      },
      {
        value: Custom.Include,
        display: "Include",
      },
      {
        value: Custom.Only,
        display: "Only",
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
    setCustomFilter(() => customChoice);
  };

  const selectItems = createMemo(() => {
    const _factionFilter = factionFilter();
    const _extensionFilter = extensionFilter();
    const _customFilter = customFilter();

    if (_factionFilter === -1 && _extensionFilter === -1 && _customFilter === Custom.Include) {
      return props.items;
    }

    return props.items.filter(
      (element) =>
        (_factionFilter === -1 || element.item.faction.id === _factionFilter) &&
        (_extensionFilter === -1 || element.item.extension.id === _extensionFilter) &&
        (_customFilter === Custom.Include || !!parseInt(_customFilter) == element.item.custom)
    );
  });

  const searchInItems = (value: string) => {
    setQuery(() => new RegExp(value, "i"));
  };

  const content = () => {
    const _searchQuery = searchQuery();
    if (_searchQuery === defaultSearchQuery) {
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
      return <h3 class="search_info">No matching item.</h3>;
    }

    let sortedItems: SearchItemType[];

    const sortKey = sortFilter();

    if (sortKey === "") {
      sortedItems = filteredItems;
    } else {
      const [sortID, sortOrder] = sortKey.split("-") as [keyof SearchItemType["item"], "up" | "down"];

      if (sortOrder === "down") {
        sortedItems = filteredItems.sort((itemA, itemB) =>
          nestedKey(itemA.item, sortID) > nestedKey(itemB.item, sortID) ? -1 : 1
        );
      } else {
        sortedItems = filteredItems.sort((itemA, itemB) =>
          nestedKey(itemA.item, sortID) > nestedKey(itemB.item, sortID) ? 1 : -1
        );
      }
    }

    return (
      <Items class="search_results">
        <For each={sortedItems}>{(item) => item.element}</For>
      </Items>
    );
  };

  return (
    <div class="search_container whitebox">
      <div class="search_inputs">
        <ValidationInput
          type="text"
          class="search_input"
          placeholder={props.placeholder}
          onValidate={searchInItems}
          validationIcon="search"
        />
        <IconButton class="toggle_filters" iconID="filter" onClick={() => setShowFilters((previous) => !previous)} />
        <Show when={showFilters()}>
          <Select
            defaultSelectText="Select faction"
            class="search_faction"
            onOptionSelect={searchByFaction}
            optionsList={factionOptions()}
            defaultSelectOption={props.defaultFactionID}
          />
          <Select
            defaultSelectText="Select expansion"
            class="search_extension"
            onOptionSelect={searchByExtension}
            optionsList={extensionOptions()}
          />
          <Select
            defaultSelectText="Select sorting"
            class="sort_results"
            onOptionSelect={sortBy}
            optionsList={sortOptions()}
          />
          <Select
            defaultSelectText="Select custom"
            class="search_custom"
            onOptionSelect={searchByCustom}
            optionsList={customOptions()}
          />
        </Show>
        {props.additionalInputs}
      </div>
      {content()}
    </div>
  );
};

export default Search;
