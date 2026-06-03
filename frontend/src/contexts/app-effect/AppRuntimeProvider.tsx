import { Effect, Layer } from "effect";
import React, { useMemo } from "react";

import AppRuntimeContext from "./AppRuntimeContext";
import type { AppServices } from "./types";

type Props = {
    children: React.ReactNode;
    layer: Layer.Layer<AppServices>;
};

export const AppRuntimeProvider = ({ children, layer }: Props) => {
    const runtime = useMemo(
        () => Effect.runSync(Layer.toRuntime(layer).pipe(Effect.scoped)),
        [layer],
    );

    return <AppRuntimeContext value={runtime}>{children}</AppRuntimeContext>;
};
