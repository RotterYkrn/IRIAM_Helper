import { pipe, Schema, Either } from "effect";
import { atom } from "jotai";

import {
    EnduranceTargetCountSchema,
    type EnduranceUnitsSchema,
} from "@/domain/endurances-new/tables/EnduranceUnits";

const baseTargetCountAtom = atom<typeof EnduranceUnitsSchema.Type.target_count>(
    Schema.decodeSync(EnduranceTargetCountSchema)(1),
);
/**
 * 企画目標回数入力時のバリデーションエラーメッセージを格納するAtom
 */
export const editTargetCountErrorAtomNew = atom<string | null>(null);

/**
 * 耐久企画の目標回数の入力を管理するAtom
 */
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
