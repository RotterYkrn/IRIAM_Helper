import { clsx, type ClassValue } from "clsx";
import { Effect, Exit } from "effect";
import { twMerge } from "tailwind-merge";

import { AppEffect, type AppService } from "@/contexts/apps/AppService";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const runEffectWithThrow = async <A, E>(
    effect: Effect.Effect<A, E, AppService>,
) => {
    const result = await AppEffect.runPromiseExit(effect);
    if (Exit.isFailure(result)) {
        console.error(result.cause);
        throw result.cause;
    }
    return result.value;
};
