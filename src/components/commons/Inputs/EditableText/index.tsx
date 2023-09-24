import Input from "@/components/commons/Inputs/Input";
import { createSignal, Show } from "solid-js";
import "./EditableText.css";

interface EditableTextProps {
  onEdit: (newValue: string) => boolean;
  value: string;
}

const EditableText = (props: EditableTextProps) => {
  const [isEditing, setIsEditing] = createSignal(false);

  const handleTyping = (event: KeyboardEvent) => {
    if (event.key === "Escape") return setIsEditing(() => false);
    if (event.key !== "Enter") return;
    const element = event.target as HTMLInputElement;
    const confirm = props.onEdit(element.value);
    if (confirm) {
      setIsEditing(() => false);
    }
  };

  return (
    <Show
      when={isEditing()}
      fallback={
        <span onDblClick={() => setIsEditing(() => true)}>{props.value}</span>
      }
    >
      <Input
        type="text"
        onKeyPress={(event) => handleTyping(event as KeyboardEvent)}
        onfocusout={() => setIsEditing(() => false)}
        value={props.value}
      />
    </Show>
  );
};

export default EditableText;
