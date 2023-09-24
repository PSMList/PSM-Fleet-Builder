import { ModalRoot } from "@/components/commons/Modal";
import Toasts from "@/components/commons/Toasts";
import Ship from "@/components/Ship";
import "@/App.css";
import { JSX, createContext, createSignal, useContext } from "solid-js";
import { StoreProvider } from "@/data/store";

export const [hash, slug] = window.location.pathname.split("/").splice(-2, 2);
export const onlyDisplay = !/self\/show\/\d+\/[^/]+$/.test(
  window.location.pathname
);
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

interface CardCollapseContextProps {
  children?: JSX.Element;
  collapse?: boolean;
}

function setDefaultCardsCollapseContext(_collapse?: boolean) {
  const [collapse, setCollapse] = createSignal(_collapse ?? false);
  return [
    collapse,
    {
      toggle: () => {
        setCollapse((_collapse) => !_collapse);
      },
    },
  ] as const;
}

export const CardCollapseContext = createContext(
  setDefaultCardsCollapseContext()
);

export const CardsCollapseProvider = (props: CardCollapseContextProps) => {
  const collapse = () => props.collapse;
  const value = setDefaultCardsCollapseContext(collapse());
  return (
    <CardCollapseContext.Provider value={value}>
      {props.children}
    </CardCollapseContext.Provider>
  );
};

export const useCardsCollapse = () => useContext(CardCollapseContext);

export function App() {
  return (
    <StoreProvider>
      <Toasts position="top-right" autoDeleteTime={8000} />
      <ModalRoot />
      <Ship />
    </StoreProvider>
  );
}
