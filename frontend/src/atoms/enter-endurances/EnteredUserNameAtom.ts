import { Chunk, Either, Option, pipe, Schema } from "effect";
import { atom } from "jotai";

import {
    EnterLogSchema,
    EnterUserNameSchema,
} from "@/domain/enter_endurances/tables/EnterLogs";

export const enteredUserNamesAtom = atom<
    Chunk.Chunk<typeof EnterLogSchema.Type.user_name>
>(Chunk.empty());

type EditEnteredUserNameState = {
    input: string;
    valid: Option.Option<typeof EnterLogSchema.Type.user_name>;
    error: string | null;
};

const baseEditEnteredUserNameAtom = atom<EditEnteredUserNameState>({
    input: "",
    valid: Option.none(),
    error: null,
});

export const initEditEnteredUserNameAtom = atom(null, (_, set) => {
    set(baseEditEnteredUserNameAtom, {
        input: "",
        valid: Option.none(),
        error: null,
    });
});

export const editEnteredUserNameAtom = atom(
    (get) =>
        pipe(get(baseEditEnteredUserNameAtom), (state) => ({
            input: state.input,
            error: state.error,
        })),
    (get, set, inputUserName: typeof EnterLogSchema.Encoded.user_name) => {
        pipe(
            inputUserName,
            Schema.decodeEither(EnterUserNameSchema),
            Either.flatMap((inputName) =>
                pipe(
                    get(enteredUserNamesAtom),
                    Chunk.findFirst((name) => name === inputName),
                    Option.match({
                        onNone: () => Either.right(inputName),
                        onSome: () =>
                            Either.left(
                                new Error("入力された名前は既に存在しています"),
                            ),
                    }),
                ),
            ),
            (result) => {
                set(baseEditEnteredUserNameAtom, (prev) => ({
                    ...prev,
                    input: inputUserName,
                    valid: Option.getRight(result),
                    error: Either.isLeft(result) ? result.left.message : null,
                }));
            },
        );
    },
);

export const validEditEnteredUserNameAtom = atom((get) =>
    pipe(get(baseEditEnteredUserNameAtom).valid, Option.getOrNull),
);

export const isValidEditEnteredUserNameAtom = atom((get) =>
    pipe(get(validEditEnteredUserNameAtom), (name) => !!name),
);
