import { batch, createSignal, For, JSX, onCleanup, onMount } from "solid-js";
import "./Select.css";

type Option = { value: string; display: string | JSX.Element };

type SelectProps = {
  defaultSelectText?: string;
  defaultSelectOption?: string;
  optionsList: Option[];
  onOptionSelect?: (value: string) => void;
} & JSX.IntrinsicAttributes &
  JSX.HTMLAttributes<HTMLDivElement>;

// based on https://medium.com/@swapnesh/creating-custom-select-component-in-reactjs-a56ba68b055a

const Select = (props: SelectProps) => {
  const [selectedOption, setSelectedOption] = createSignal<Option>({
    value: props.defaultSelectText || "",
    display: props.defaultSelectText,
  });
  const [showOptionList, setShowOptionList] = createSignal(false);

  let containerRef: HTMLDivElement;
  let selectRef: HTMLSelectElement;

  const handleClickOutside = (event: MouseEvent) => {
    const element = event.target as HTMLElement;

    if (!(element === containerRef || containerRef?.contains(element))) {
      setShowOptionList(() => false);
    }
  };

  onMount(() => {
    document.addEventListener("click", handleClickOutside);

    if (props.defaultSelectOption) {
      const defaultOption = props.optionsList.find((option) => option.value === props.defaultSelectOption);
      if (defaultOption) {
        setSelectedOption(() => ({
          value: defaultOption.value,
          display:
            typeof defaultOption.display === "string"
              ? defaultOption.display
              : (defaultOption.display as Node).cloneNode(true),
        }));
        if (props.onOptionSelect) {
          props.onOptionSelect(defaultOption.value);
        }
      }
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
    const value = target.dataset.name!;
    if (props.onOptionSelect) props.onOptionSelect(value);
    batch(() => {
      const option = props.optionsList.find((option) => option.value === value);
      if (!option) return;
      setSelectedOption(() => ({
        value: option.value,
        display: typeof option.display === "string" ? option.display : (option.display as Node).cloneNode(true),
      }));
      setShowOptionList(() => false);
    });
  };

  return (
    <div
      classList={{ [props.class || ""]: !!props.class }}
      class={"select-container"}
      ref={(ref) => {
        containerRef = ref;
      }}
    >
      <select
        class={props.class}
        style="display: none"
        ref={(ref) => {
          selectRef = ref;
        }}
      >
        {selectedOption().value === props.defaultSelectText && <option></option>}
        <For each={props.optionsList}>
          {(option) => (
            <option value={option.value} selected={selectedOption().value === option.value}>
              {option.value}
            </option>
          )}
        </For>
      </select>
      <div class={"selected-text" + (showOptionList() ? " active" : "")} onClick={handleListDisplay}>
        {selectedOption().display}
      </div>
      {showOptionList() && (
        <ul class="select-options">
          <For each={props.optionsList}>
            {(li) => (
              <li class="select-option" data-name={li.value} onClick={handleOptionClick}>
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
