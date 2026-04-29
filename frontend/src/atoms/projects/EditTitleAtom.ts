import { Either, Option, pipe, Schema } from "effect";
import { atom } from "jotai";

import { ProjectTitleSchema } from "@/domain/projects/tables/Project";

type EditTitleState = {
    input: string;
    valid: Option.Option<typeof ProjectTitleSchema.Type>;
    error: string | null;
};

const baseEditTitleAtom = atom<EditTitleState>({
    input: "",
    valid: Option.none(),
    error: null,
});

/**
 * 企画タイトル入力Atom
 */
export const editTitleAtom = atom(
    (get) =>
        pipe(get(baseEditTitleAtom), (state) => ({
            input: state.input,
            error: state.error,
        })),
    (_, set, inputTitle: typeof ProjectTitleSchema.Encoded) => {
        pipe(inputTitle, Schema.decodeEither(ProjectTitleSchema), (result) => {
            set(baseEditTitleAtom, (prev) => ({
                ...prev,
                input: inputTitle,
                valid: Option.getRight(result),
                error: Either.isLeft(result) ? result.left.message : null,
            }));
        });
    },
);

export const validEditTitleAtom = atom((get) => get(baseEditTitleAtom).valid);

export const isValidEditTitleAtom = atom((get) =>
    pipe(get(validEditTitleAtom), Option.isSome),
);
