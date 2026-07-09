import { Component } from "solid-js";
import { render } from "solid-js/web";

import { ToastProvider } from "@/common/Toast/ToastProvider";
import { ModalProvider } from "@/common/Modal/ModalProvider";
import { StoreProvider } from "@/store/store";
import { DatabaseProvider } from "@/store/services/database";
import { CollectionProvider } from "@/store/services/collection";

// Shared provider tree for every entry (fleet, collection and the dev router).
// Global styles ship via store.tsx, so no entry needs to import index.scss.
export function renderBuilder(Builder: Component) {
  render(
    () => (
      <StoreProvider>
        <DatabaseProvider>
          <CollectionProvider>
            <Builder />
            <ModalProvider />
            <ToastProvider position="top-right" autoDeleteTime={4000} />
          </CollectionProvider>
        </DatabaseProvider>
      </StoreProvider>
    ),
    document.getElementById("builder")!,
  );
}
