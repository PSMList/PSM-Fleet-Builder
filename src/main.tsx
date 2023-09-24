import { render } from "solid-js/web";
import { App } from "./App";
import "./index.css";

const root = document.getElementById("fleet_builder");

if (root) {
  render(() => <App />, root);
}
