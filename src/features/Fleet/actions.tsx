import { produce } from "solid-js/store";

import { useDb, useFleet } from "@/store/store";
import { IconButton } from "@/common/Icon/IconButton/IconButton";
import { Input } from "@/common/Input/Input";
import { useModal } from "@/common/Modal/hooks";
import { useToast } from "@/common/Toast/ToastProvider";
import { fleetDataToString, parseFleetData } from "@/utils/parse";
import { Harbor } from "@/features/Harbor/Harbor";
import { ItemsProvider } from "@/common/Item/ItemsProvider";
import { Settings } from "@/common/Settings/Settings";
import { baseUrl, isOwn, slugname } from "@/utils/config";

export function CopyFleet() {
  const modal = useModal();
  const toast = useToast();
  const { fleet } = useFleet();

  function copyFleet() {
    let textareaRef!: HTMLTextAreaElement;

    const copyText = async () => {
      if (!navigator.clipboard) {
        textareaRef.focus();
        textareaRef.select();

        return;
      }

      await navigator.clipboard.writeText(textareaRef.innerHTML);

      toast.show({
        id: "success-copy-fleet",
        title: "Copied fleet data",
        type: "success",
      });
    };

    modal.show({
      id: "copy-fleet",
      onClose: true,
      title: (
        <>
          Copy fleet as text
          <IconButton id="clipboard" onClick={copyText} title="Copy as text" />
        </>
      ),
      content: () => (
        <Input
          type="textarea"
          ref={(ref) => {
            setTimeout(() => {
              textareaRef = ref;

              copyText();
            }, 150);
          }}
        >
          {`[${fleet.name}](${location.href})\n\n`}
          {fleet.description ? `${fleet.description}\n\n` : ""}
          {fleet.data.reduce(
            (output, ship) =>
              `${output}(${ship.points}p) ${ship.name} #${ship.extension.short}${ship.numid} - ${ship.faction.name}\n` +
              `${ship.crew.reduce(
                (output, crew) =>
                  `${output}  (${crew.points}p) ${crew.name} #${crew.extension.short}${crew.numid} - ${crew.faction.name}\n`,
                "",
              )}` +
              `${ship.equipment.reduce(
                (output, equipment) =>
                  `${output}  (${equipment.points}p) ${equipment.name} #${equipment.extension.short}${equipment.numid}\n`,
                "",
              )}\n`,
            "",
          )}
          {fleet.harbor.length
            ? fleet.harbor.reduce(
                (output, item) =>
                  `${output}  ${item.name} #${item.extension.short}${item.numid}\n`,
                "\nHarbor:\n",
              )
            : ""}
        </Input>
      ),
    });
  }

  return <IconButton id="clipboard" onClick={copyFleet} title="Copy as text" />;
}

export function ShareFleet() {
  if (!("clipboard" in navigator || "share" in navigator)) {
    return null;
  }

  const toast = useToast();
  const { fleet } = useFleet();

  const shareFleet = async () => {
    const url = location.href;

    if (typeof navigator.share === "function") {
      await navigator.share({
        title: fleet.name,
        text: fleet.description,
        url,
      });

      return;
    }

    if (navigator.clipboard !== undefined) {
      await navigator.clipboard.writeText(url);

      toast.show({
        id: "success-clear-fleet",
        type: "success",
        title: "Share my fleet",
        description: "Link copied to clipboard.",
      });

      return;
    }

    toast.show({
      id: "error-share",
      type: "error",
      title: "Share my fleet",
      description: "Impossible to share, please copy the browser URL.",
    });
  };

  return (
    <IconButton
      id="share-nodes"
      onClick={shareFleet}
      title="Share your fleet"
    />
  );
}

export function ExportFleet() {
  const toast = useToast();
  const { fleet } = useFleet();

  function exportFleet() {
    const fleetStr = fleetDataToString(fleet);

    if (!fleetStr) {
      return toast.show({
        id: "error-export-fleet",
        type: "error",
        title: "Export fleet data",
        description: "Save your fleet, reload page and retry.",
      });
    }

    const a = document.createElement("a");
    a.download = "fleet_data.json";
    a.href = "data:text/json;charset=utf-8," + encodeURIComponent(fleetStr);
    a.click();

    toast.show({
      id: "success-load-fleet",
      type: "success",
      title: "Export fleet data",
      description: "Verify your download folder.",
    });
  }

  return (
    <IconButton id="download" onClick={exportFleet} title="Export as file" />
  );
}

function saveFleet() {
  const { save } = useFleet();
  const toast = useToast();

  save().then(async (res) => {
    if (res.ok) {
      return toast.show({
        id: "success-saving-data",
        type: "success",
        title: "Save fleet data",
        description: "",
      });
    }
    switch (res.status) {
      case 400: {
        let messages: string[] | undefined;
        try {
          messages = JSON.parse(await res.text()) as string[];
        } catch {
          //
        }

        if (!Array.isArray(messages) || messages.length === 0) {
          messages = ["Invalid fleet data."];
        }

        for (const message of messages) {
          toast.show({
            id:
              "error-saving-data-" +
              // trying to create different id for each error message
              message.split(" ").slice(0, 2).join("-").toLocaleLowerCase(),
            type: "error",
            title: "Save fleet data",
            description: message,
          });
        }

        break;
      }
      case 408:
        toast.show({
          id: "error-saving-data-network",
          type: "error",
          title: "Save fleet data",
          description: "Network error.",
        });

        break;
      default:
        toast.show({
          id: "error-saving-data-unknown",
          type: "error",
          title: "Save fleet data",
          description: "Internal error. Please contact administrators.",
        });
    }
  });
}

export function SaveFleet() {
  if (!isOwn) return;

  const { saved } = useFleet();

  return (
    <IconButton
      id="save"
      onClick={saveFleet}
      title="Save"
      data-unsaved={saved() ? null : true}
    />
  );
}

export function ImportFleet() {
  if (!isOwn) return;

  const toast = useToast();
  const { db } = useDb();
  const { setFleet } = useFleet();

  function importFleet() {
    const inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.accept = "application/json";

    inputFile.addEventListener("change", async () => {
      const file = inputFile.files?.item(0);

      if (!file) {
        return toast.show({
          id: "error-import-missing-file",
          type: "error",
          title: "Import fleet data",
          description: "No file provided.",
        });
      }

      if (file?.type !== "application/json") {
        return toast.show({
          id: "error-import-wrong-format",
          type: "warning",
          title: "Import fleet data",
          description: "Please provide a valid file (.json)",
        });
      }

      try {
        const newFleet = parseFleetData(JSON.parse(await file.text()), db);

        setFleet(() => newFleet);

        return toast.show({
          id: "success-import-fleet",
          type: "success",
          title: "Import fleet data",
          description: `Loaded from ${newFleet.name} (not saved).`,
        });
      } catch {
        toast.show({
          id: "error-import-fleet",
          type: "error",
          title: "Import fleet data",
          description: "Please verify the imported file and try again.",
        });
      }
    });

    inputFile.click();
  }

  return (
    <IconButton
      id="cloud-upload"
      onClick={importFleet}
      title="Import from file"
    />
  );
}

export function ShowHarbor() {
  const modal = useModal();
  const { fleet, setFleet } = useFleet();

  function showHarbor() {
    modal.show({
      id: "harbor",
      title: "Harbor",
      subtitle: "Items stored outside of your fleet",
      onClose: true,
      content: () => (
        <ItemsProvider
          items={fleet.harbor}
          onChange={(items) =>
            setFleet(produce((_fleet) => (_fleet.harbor = items)))
          }
        >
          <Harbor />
        </ItemsProvider>
      ),
    });
  }

  return (
    <IconButton
      id="anchor"
      onClick={showHarbor}
      title="Show harbor"
      data-harbor-count={fleet.harbor.length}
    />
  );
}

export function ShowSettings() {
  if (!isOwn) return;

  const modal = useModal();
  const { fleet, setFleet, saved } = useFleet();

  function showSettings() {
    modal.show({
      id: "settings",
      title: "Fleet settings",
      onClose: true,
      content: () => (
        <Settings
          saved={saved()}
          data={{
            name: {
              name: "Fleet name",
              type: "text",
              value: fleet.name,
              maxlength: window.fleetNameMaxlength,
              minlength: window.fleetNameMinlength,
            },
            maxpoints: {
              name: "Max points",
              type: "number",
              value: fleet.points.max,
              min: window.fleetMaxpointsMin,
              max: window.fleetMaxpointsMax,
            },
            ispublic: {
              name: "Public",
              type: "checkbox",
              checked: fleet.ispublic,
            },
            description: {
              name: "Description",
              type: "textarea",
              value: fleet.description,
            },
          }}
          onData={(data) => {
            setFleet(
              produce((_data) => {
                _data.name = data.name.value as string;
                // @ts-expect-error checked should appear in input props
                _data.ispublic = !!data.ispublic.checked;
                _data.points.max = data.maxpoints.value as number;
                _data.description = data.description.value as string;
              }),
            );
          }}
          onSave={saveFleet}
        >
          <IconButton
            id="trash"
            onClick={() =>
              (window.location.href = `${baseUrl}/fleet/self/delete/${slugname}`)
            }
            title="Delete this fleet"
          >
            Delete this fleet
          </IconButton>
        </Settings>
      ),
    });
  }

  return (
    <div class="settings">
      <IconButton id="cog" title="Edit fleet settings" onClick={showSettings} />
    </div>
  );
}
