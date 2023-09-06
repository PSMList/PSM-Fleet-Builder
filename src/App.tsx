import { ModalRoot } from "@/components/commons/Modal";
import Toasts from "@/components/commons/Toasts";
import Ship from "@/components/Ship";
import "./App.css";
import { ParentComponent, createContext, createSignal, useContext } from "solid-js";

export const [hash, slug] = window.location.pathname.split("/").splice(-2, 2);
export const onlyDisplay = !/self\/show\/\d+\/[^/]+$/.test(window.location.pathname);
export const fleetMaxpointsMin = window.fleetMaxpointsMin;
export const fleetMaxpointsMax = window.fleetMaxpointsMax;
export const baseUrl = window.baseUrl;

declare global {
  interface Window {
    fleetMaxpointsMin: number;
    fleetMaxpointsMax: number;
    fleetNameMinlength: number;
    fleetNameMaxlength: number;
    baseUrl: string;
  }
}

const [collapse, setCollapse] = createSignal(false);

export const CardCollapseContext = createContext({
  collapse,
  toggle: function () {
    setCollapse(() => !collapse());
  },
});

const CardsCollapseProvider: ParentComponent = (props) => {
  const state = useContext(CardCollapseContext);
  return <CardCollapseContext.Provider value={state}>{props.children}</CardCollapseContext.Provider>;
};

export function App() {
  return (
    <>
      <CardsCollapseProvider>
        <Toasts position="top-right" autoDeleteTime={8000} />
        <ModalRoot />
        <Ship />
      </CardsCollapseProvider>
    </>
  );
}
