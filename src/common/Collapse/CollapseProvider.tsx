import "./Collapse.scss";

import {
  Accessor,
  createContext,
  createSignal,
  JSX,
  useContext,
} from "solid-js";

interface CollapseContextProps {
  children?: JSX.Element;
  defaultCollapse?: boolean;
}

type CollapseContextType = [
  collapsed: Accessor<boolean>,
  toggleCollapse: () => void,
];

export const CollapseContext = createContext<CollapseContextType>();

export function CollapseProvider(props: CollapseContextProps) {
  const [collapsed, setCollapse] = createSignal(props.defaultCollapse ?? true);

  return (
    <CollapseContext.Provider
      value={[collapsed, () => setCollapse((prev) => !prev)]}
    >
      {props.children}
    </CollapseContext.Provider>
  );
}

export function useCollapse() {
  const context = useContext(CollapseContext);

  if (!context) {
    throw new Error("useCollapse must be used within a CollapseProvider.");
  }

  return context;
}
