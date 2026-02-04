import { pipe, Schema, Either } from "effect";
import { atom } from "jotai";

import {
    EnduranceTargetCountSchema,
    type EnduranceSettingsSchema,
} from "@/domain/endurances/tables/EnduranceSettings";

const baseTargetCountAtom = atom<
    typeof EnduranceSettingsSchema.Type.target_count
>(1 as typeof EnduranceSettingsSchema.Type.target_count);
export const editTargetCountErrorAtom = atom<string | null>(null);

export const editTargetCountAtom = atom(
    (get) => get(baseTargetCountAtom),
    (
        _,
        set,
        newTargetCount: typeof EnduranceSettingsSchema.Encoded.target_count,
    ) => {
        pipe(
            newTargetCount,
            Schema.decodeEither(EnduranceTargetCountSchema),
            Either.map((targetCount) => {
                set(baseTargetCountAtom, targetCount);
                set(editTargetCountErrorAtom, null);
            }),
            Either.mapLeft((error) => {
                set(editTargetCountErrorAtom, error.message);
            }),
        );
    },
);
