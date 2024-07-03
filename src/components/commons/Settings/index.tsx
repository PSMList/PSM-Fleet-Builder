import IconButton from "@/components/commons/IconButton";
import Input, {
  InputProps,
  InputTypes,
} from "@/components/commons/Inputs/Input";
import { For } from "solid-js";
import { createStore } from "solid-js/store";
import "./Settings.css";
import { baseUrl, slugname } from "@/App";

export type Data = Record<
  string,
  Exclude<InputProps<InputTypes>, "onValidate">
>;

interface SettingsProps {
  data: Data;
  onSave: () => void;
  onInput: (data: Data) => void;
  saved: boolean;
}

const Settings = (props: SettingsProps) => {
  const data = () => props.data;
  const [settings, setSettings] = createStore(data());

  return (
    <div class="settings_container whitebox">
      <div class="settings_header">
        <h3>
          <IconButton
            onClick={() => props.onSave()}
            iconID="save"
            title="Save"
            data-unsaved={!props.saved ? "" : null}
            primary
          />
          Save&nbsp;
        </h3>
        <b>Valid special characters: ' : " _ - and accents</b>
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
                      setSettings(key, "checked", () => target.checked);
                    }
                    if ("value" in target) {
                      setSettings(key, "value", () => target.value);
                    }
                    props.onInput(settings);
                  }}
                />
              </>
            );
          }}
        </For>
      </form>
      <div class="settings_footer">
        <IconButton
          id="delete_fleet"
          onClick={() =>
            (window.location.href = `${baseUrl}/fleet/self/delete/${slugname}`)
          }
          iconID="trash"
          title="Delete this fleet"
        >
          Delete this fleet
        </IconButton>
      </div>
    </div>
  );
};

export default Settings;
