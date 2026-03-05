import { pipe, Schema, Either, Option } from "effect";
import { atom } from "jotai";

import {
    EnduranceTargetCountSchema,
    type EnduranceUnitsSchema,
} from "@/domain/endurances-new/tables/EnduranceUnits";

type EditTargetCountState = {
    inputTargetCount: string;
    validTargetCount: Option.Option<
        typeof EnduranceUnitsSchema.Type.target_count
    >;
    error: string | null;
};

const baseEditTargetCountAtom = atom<EditTargetCountState>({
    inputTargetCount: "",
    validTargetCount: Option.none(),
    error: null,
});

/**
 * 耐久企画の目標回数の入力を管理するAtom
 */
export const editTargetCountAtom = atom(
    (get) => get(baseEditTargetCountAtom),
    (_, set, inputTargetCount: string) => {
        pipe(
            Number(inputTargetCount),
            Schema.decodeEither(EnduranceTargetCountSchema),
            (result) =>
                set(baseEditTargetCountAtom, (prev) => ({
                    ...prev,
                    inputTargetCount,
                    validTargetCount: Option.getRight(result),
                    error: Either.isLeft(result) ? result.left.message : null,
                })),
        );
    },
);

export const validEditTargetCountAtom = atom(
    (get) => get(baseEditTargetCountAtom).validTargetCount,
);

export const isValidEditTargetCountAtom = atom((get) =>
    pipe(get(validEditTargetCountAtom), Option.isSome),
);
