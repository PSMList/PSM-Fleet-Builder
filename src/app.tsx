import { ModalRoot } from "@/components/commons/Modal";
import Toasts from "@/components/commons/Toasts";
import Ship from "@/components/Ship";
import { Show } from "solid-js";
import './App.css';

export const [hash, slug] = window.location.pathname.split('/').splice(-2, 2);
export const onlyDisplay = !/self\/show\/\d+\/[^/]+$/.test(window.location.pathname);
export const fleetMaxpointsMin = window.fleetMaxpointsMin;
export const fleetMaxpointsMax = window.fleetMaxpointsMax;
export const baseUrl = window.baseUrl;
export const isOwn = window.isOwn;

declare global {
  interface Window {
    fleetMaxpointsMin: number
    fleetMaxpointsMax: number
    baseUrl: string
    isOwn: boolean
  }
}

export function App() {

  return (
    <>
      <Toasts position='top-right' autoDeleteTime={ 8000 } />
      <ModalRoot />
      <Show when={ onlyDisplay && window.isOwn }>
        &emsp;&emsp;You own this fleet. You can <a href={ `${baseUrl}/fleet/self/show/${hash}/${slug}` }>edit it</a>.
        <br/><br/>
      </Show>
      <Ship />
    </>
  );
}