import { Effect, Layer, Runtime } from "effect";
import { useCallback, useState } from "react";

import AppContext from "./AppContext";
import { AppLayer, type AppService } from "./AppLayer";

const runtime = Effect.runSync(Layer.toRuntime(AppLayer).pipe(Effect.scoped));

type Props = {
    children: React.ReactNode;
};

export const AppProvider = ({ children }: Props) => {
    const [isOpenSideBar, setIsOpenSideBar] = useState(false);

    const runPromise = useCallback(
        <A, E>(effect: Effect.Effect<A, E, AppService>) =>
            Runtime.runPromise(runtime)(effect),
        [],
    );

    return (
        <AppContext value={{ isOpenSideBar, setIsOpenSideBar, runPromise }}>
            {children}
        </AppContext>
    );
};
