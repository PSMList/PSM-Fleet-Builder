import { render } from "solid-js/web";
import { App } from "./app";
import './index.css'

render(() => <App />, document.getElementById('fleet_builder') as HTMLElement)
