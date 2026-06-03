import type { Runtime } from "effect";
import { createContext } from "react";

import type { AppServices } from "./types";

const AppRuntimeContext = createContext<Runtime.Runtime<AppServices> | null>(
    null,
);

export default AppRuntimeContext;
