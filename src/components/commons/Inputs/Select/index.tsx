import {
  batch,
  createEffect,
  createSignal,
  For,
  JSX,
  onCleanup,
  onMount,
} from "solid-js";
import "./Select.css";

interface Option {
  id: string;
  display: string | JSX.Element;
}

type SelectProps = {
  defaultSelectText?: string;
  defaultSelectOption?: string;
  optionsList: Option[];
  onOptionSelect?: (value: string) => void;
  value?: string;
} & JSX.IntrinsicAttributes &
  JSX.HTMLAttributes<HTMLDivElement>;

// based on https://medium.com/@swapnesh/creating-custom-select-component-in-reactjs-a56ba68b055a

const Select = (props: SelectProps) => {
  const value = () => props.value;
  const [selectedOption, setSelectedOption] = createSignal<Option>({
    id: props.defaultSelectText ?? "",
    display: props.defaultSelectText,
  });
  const [showOptionList, setShowOptionList] = createSignal(false);

  let containerRef: HTMLDivElement;

  const handleClickOutside = (event: MouseEvent) => {
    const element = event.target as HTMLElement;

    if (!(element === containerRef || containerRef.contains(element))) {
      setShowOptionList(() => false);
    }
  };

  onMount(() => {
    document.addEventListener("click", handleClickOutside);

    if (props.defaultSelectOption) {
      const defaultOption = props.optionsList.find(
        (option) => option.id === props.defaultSelectOption
      );
      if (defaultOption) {
        setSelectedOption(() => ({
          id: defaultOption.id,
          display:
            typeof defaultOption.display === "string"
              ? defaultOption.display
              : (defaultOption.display as Node).cloneNode(true),
        }));
        if (props.onOptionSelect) {
          props.onOptionSelect(defaultOption.id);
        }
      }
    }
  });

  createEffect(() => {
    if (value() && value() !== selectedOption().id) {
      const option = props.optionsList.find(
        (option) => option.id === value() && option.id
      );
      if (!option) return;
      setSelectedOption(() => ({
        id: option.id,
        display:
          typeof option.display === "string"
            ? option.display
            : (option.display as Node).cloneNode(true),
      }));
    }
  });

  onCleanup(() => {
    document.removeEventListener("click", handleClickOutside);
  });

  const handleListDisplay = () => {
    setShowOptionList(() => !showOptionList());
  };

  const handleOptionClick = (event: Event) => {
    const target = event.target as HTMLLIElement;
    const value = target.dataset.name;
    if (props.onOptionSelect && value) props.onOptionSelect(value);
    batch(() => {
      const option = props.optionsList.find((option) => option.id === value);
      if (!option) return;
      setSelectedOption(() => ({
        id: option.id,
        display:
          typeof option.display === "string"
            ? option.display
            : (option.display as Node).cloneNode(true),
      }));
      setShowOptionList(() => false);
    });
  };

  return (
    <div
      classList={{ [props.class ?? ""]: !!props.class }}
      class={"select-container"}
      ref={(ref) => {
        containerRef = ref;
      }}
    >
      <select class={props.class} style={{ display: "none" }}>
        {selectedOption().id === props.defaultSelectText && <option />}
        <For each={props.optionsList}>
          {(option) => (
            <option
              value={option.id}
              selected={selectedOption().id === option.id}
            >
              {option.id}
            </option>
          )}
        </For>
      </select>
      <div
        class={"selected-text" + (showOptionList() ? " active" : "")}
        onClick={handleListDisplay}
      >
        {selectedOption().display}
      </div>
      {showOptionList() && (
        <ul class="select-options">
          <For each={props.optionsList}>
            {(li) => (
              <li
                class="select-option"
                data-name={li.id}
                onClick={handleOptionClick}
              >
                {li.display}
              </li>
            )}
          </For>
        </ul>
      )}
    </div>
  );
};

export default Select;
