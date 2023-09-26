import IconButton from "@/components/commons/IconButton";
import Input, {
  InputProps,
  InputTypes,
} from "@/components/commons/Inputs/Input";
import { For, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import "./Settings.css";

export type Data = Record<
  string,
  Exclude<InputProps<InputTypes>, "onValidate">
>;

interface SettingsProps {
  data: Data;
  onSave: (data: Data) => Promise<boolean>;
}

const Settings = (props: SettingsProps) => {
  const data = () => props.data;
  const [settings] = createStore(data());
  const [saved, setSaved] = createSignal(true);

  const save = () => {
    void props.onSave(settings).then((saved) => {
      setSaved(() => saved);
    });
  };

  const inputsData = (
    <For each={Object.entries(settings)}>
      {([, _input]) => {
        return (
          <>
            <span>{_input.name}:</span>
            <Input {..._input} />
          </>
        );
      }}
    </For>
  );

  return (
    <div class="settings_container">
      <div class="settings_header">
        <h3>
          <IconButton
            onClick={save}
            iconID="save"
            title="Save"
            data-unsaved={!saved() ? "" : null}
            primary={true}
          />
          Save&nbsp;
        </h3>
        <b>Valid special characters: ' : " _ - and accents</b>
      </div>
      <form
        class="settings_inputs"
        onInput={() => {
          if (!saved()) {
            setSaved(() => false);
          }
        }}
      >
        {inputsData}
      </form>
    </div>
  );
};

export default Settings;
