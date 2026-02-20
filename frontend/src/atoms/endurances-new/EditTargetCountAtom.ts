import { pipe, Schema, Either } from "effect";
import { atom } from "jotai";

import { EnduranceTargetCountSchema } from "@/domain/endurances/tables/EnduranceSettings";
import type { EnduranceUnitsSchema } from "@/domain/endurances-new/tables/EnduranceUnits";

const baseTargetCountAtom = atom<typeof EnduranceUnitsSchema.Type.target_count>(
    Schema.decodeSync(EnduranceTargetCountSchema)(1),
);
export const editTargetCountErrorAtomNew = atom<string | null>(null);

export const editTargetCountAtomNew = atom(
    (get) => get(baseTargetCountAtom),
    (
        _,
        set,
        newTargetCount: typeof EnduranceUnitsSchema.Encoded.target_count,
    ) => {
        pipe(
            newTargetCount,
            Schema.decodeEither(EnduranceTargetCountSchema),
            Either.match({
                onRight: (targetCount) => {
                    set(baseTargetCountAtom, targetCount);
                    set(editTargetCountErrorAtomNew, null);
                },
                onLeft: (error) => {
                    set(editTargetCountErrorAtomNew, error.message);
                },
            }),
        );
    },
);
