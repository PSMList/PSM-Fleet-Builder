import { lazy } from "solid-js";

import { renderBuilder } from "@/entries/render";

// Dev-only entry (referenced by index.html). Production builds use the
// dedicated fleet/collection entries; here the builder is picked at runtime
// from the path so both can be exercised through the Vite dev server.
const Builder = lazy(() =>
  location.pathname.includes("collection")
    ? import("@/features/Collection/Collection").then((m) => ({
        default: m.CollectionBuilder,
      }))
    : import("@/features/Fleet/Fleet").then((m) => ({
        default: m.FleetBuilder,
      })),
);

renderBuilder(Builder);
