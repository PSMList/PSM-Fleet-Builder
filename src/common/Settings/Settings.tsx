import "./Settings.scss";

import { For, JSX } from "solid-js";
import { createStore } from "solid-js/store";

import { Input, InputProps, InputTypes } from "@/common/Input/Input";
import { IconButton } from "../Icon/IconButton/IconButton";

export type Data = Record<
  string,
  Exclude<InputProps<InputTypes>, "onValidate">
>;

interface SettingsProps {
  data: Data;
  onData: (data: Data) => void;
  saved: boolean;
  onSave: () => void;
  children?: JSX.Element;
}

export function Settings(props: SettingsProps) {
  const [settings, setSettings] = createStore(props.data);

  return (
    <div class="settings_container">
      <div class="settings_header">
        <IconButton
          onClick={() => props.onSave()}
          id="save"
          title="Save"
          data-unsaved={props.saved ? null : ""}
          primary
        />
        <h2>Save&nbsp;</h2>
      </div>
      <form class="settings_inputs">
        <For each={Object.entries(settings)}>
          {([key, input]) => {
            return (
              <>
                <span>{input.name}:</span>
                <Input
                  {...input}
                  onInput={(event: InputEvent) => {
                    const target = event.currentTarget as
                      | HTMLInputElement
                      | HTMLTextAreaElement;
                    if ("checked" in target) {
                      // @ts-expect-error mismatch with input and textarea union
                      setSettings(key, "checked", target.checked);
                    }
                    if ("value" in target) {
                      setSettings(key, "value", target.value);
                    }

                    props.onData(settings);
                  }}
                />
              </>
            );
          }}
        </For>
      </form>
      <div class="settings_rules">
        Valid special characters: ' : " _ - and accents
      </div>
      {props.children && <div class="more_settings">{props.children}</div>}
    </div>
  );
}
