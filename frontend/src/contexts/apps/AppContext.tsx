import type { Effect } from "effect";
import { createContext } from "react";

import type { AppService } from "./AppLayer";

type AppContextType = {
    isOpenSideBar: boolean;
    setIsOpenSideBar: (v: boolean) => void;
    runPromise: <A, E>(effect: Effect.Effect<A, E, AppService>) => Promise<A>;
};

const AppContext = createContext<AppContextType | null>(null);

export default AppContext;
