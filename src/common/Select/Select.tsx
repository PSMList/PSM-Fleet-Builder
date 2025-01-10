import "./Select.scss";

import {
  batch,
  createEffect,
  createSignal,
  For,
  JSX,
  onCleanup,
  onMount,
} from "solid-js";

export interface Option {
  id: string;
  display: string | JSX.Element;
}

function cloneNode(node: JSX.Element): JSX.Element | JSX.Element[] {
  return node instanceof Node
    ? node.cloneNode(true)
    : Array.isArray(node)
      ? node.map(cloneNode)
      : node;
}

function cloneOption(option: Option): Option {
  return {
    id: option.id,
    display: cloneNode(option.display),
  };
}

type SelectProps = {
  defaultSelectText?: string;
  defaultSelectOption?: string;
  options: Option[];
  onOptionSelect?: (value: string | number) => void;
  value?: string;
} & JSX.IntrinsicAttributes &
  JSX.HTMLAttributes<HTMLDivElement>;

// based on https://medium.com/@swapnesh/creating-custom-select_component-in-reactjs-a56ba68b055a

export function Select(props: SelectProps) {
  const [selectedOption, setSelectedOption] = createSignal<Option>({
    id: props.defaultSelectText ?? "",
    display: props.defaultSelectText,
  });

  const [showList, setShowOption] = createSignal(false);

  let containerRef: HTMLDivElement;

  function handleClickOutside(event: MouseEvent) {
    const element = event.target as HTMLElement;

    if (!(element === containerRef || containerRef.contains(element))) {
      setShowOption(() => false);
    }
  }

  onMount(() => {
    document.addEventListener("click", handleClickOutside);

    if (!props.defaultSelectOption) return;

    const defaultOption = props.options.find(
      (option) => option.id === props.defaultSelectOption,
    );

    if (!defaultOption) return;

    setSelectedOption(() => cloneOption(defaultOption));
    props.onOptionSelect?.(defaultOption.id);
  });

  onCleanup(() => {
    document.removeEventListener("click", handleClickOutside);
  });

  createEffect(() => {
    if (props.value === selectedOption().id) return;

    const option = props.options.find(
      (option) => option.id === props.value && option.id,
    );

    if (!option) return;

    setSelectedOption(() => cloneOption(option));
  });

  function handleListDisplay() {
    setShowOption((previous) => !previous);
  }

  function handleOptionClick(value: string) {
    if (props.onOptionSelect && value) props.onOptionSelect(value);

    batch(() => {
      const option = props.options.find((option) => option.id === value);

      if (!option) return;

      setSelectedOption(() => cloneOption(option));
      setShowOption(() => false);
    });
  }

  return (
    <div
      class={`select_container ${props.class ?? ""}`}
      ref={(ref) => {
        containerRef = ref;
      }}
    >
      <select>
        {selectedOption().id === props.defaultSelectText && <option />}
        <For each={props.options}>
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
        classList={{ selected_text: true, active: showList() }}
        onClick={handleListDisplay}
      >
        {selectedOption().display}
      </div>
      <ul class="select_options">
        <For each={props.options}>
          {(li) => (
            <li class="select_option" onClick={() => handleOptionClick(li.id)}>
              {li.display}
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}
