import { clsx, type ClassValue } from "clsx";
import { Effect, Exit, Runtime } from "effect";
import { twMerge } from "tailwind-merge";

import type { AppServices } from "@/contexts/app-effect/types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const runEffectWithThrow =
    (runtime: Runtime.Runtime<AppServices>) =>
    async <A, E>(effect: Effect.Effect<A, E, AppServices>) => {
        const result = await Runtime.runPromiseExit(runtime)(effect);
        return Exit.getOrElse((c) => {
            console.error(c.toJSON());
            throw c;
        })(result);
    };
