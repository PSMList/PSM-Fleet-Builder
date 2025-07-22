import { createSignal } from "solid-js";

import { useDb } from "@/store/store";
import { Select } from "../Select/Select";
import { baseImg } from "@/utils/config";
import { FilterProps } from "../Search/Search";
import { Extension } from "@/store/data/extension";
import { LazyImg } from "../LazyImg/LazyImg";

export function useExtensionFilter(): FilterProps<{
  extension?: Extension;
}> {
  const { db } = useDb();

  const [selectedExtensionId, setSelectedExtensionId] = createSignal("-1");

  function extensionsOptions() {
    const extensions = Array.from(db.extensions.values());

    extensions.unshift({
      id: -1,
      name: "All expansions",
      icon: "",
    } as Extension);

    return extensions.map((extension) => ({
      id: extension.id.toString(),
      display: (
        <span>
          <LazyImg
            src={`${baseImg}/${extension.icon}`}
            alt=""
            width="24px"
            height="24px"
            class="extension"
          />
          {extension.name}
        </span>
      ),
    }));
  }

  return {
    button: (
      <Select
        defaultSelectText="Select expansion"
        class="search_extension"
        onOptionSelect={setSelectedExtensionId}
        options={extensionsOptions()}
      />
    ),
    pipe: (items) => {
      const _selectedExtensionId = selectedExtensionId();
      if (_selectedExtensionId === "-1") return items;

      const selectedExtension = parseInt(_selectedExtensionId);

      return items.filter(
        (item) => item.props.extension?.id === selectedExtension,
      );
    },
  };
}
