import "./index.scss";

import { render } from "solid-js/web";

import { App } from "@/App";
import { ToastProvider } from "./common/Toast/ToastProvider";
import { ModalProvider } from "@/common/Modal/ModalProvider";
import { StoreProvider } from "@/store/store";

render(
  () => (
    <StoreProvider>
      <App />
      <ModalProvider />
      <ToastProvider position="top-right" autoDeleteTime={8000} />
    </StoreProvider>
  ),
  document.getElementById("fleet_builder")!,
);
