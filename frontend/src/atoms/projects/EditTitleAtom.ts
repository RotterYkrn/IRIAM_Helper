import { Either, pipe, Schema } from "effect";
import { atom } from "jotai";

import { ProjectTitleSchema } from "@/domain/projects/tables/Project";

const baseTitleAtom = atom<typeof ProjectTitleSchema.Type>(
    "" as typeof ProjectTitleSchema.Type,
);
export const editTitleErrorAtom = atom<string | null>(null);

export const editTitleAtom = atom(
    (get) => get(baseTitleAtom),
    (_, set, newTitle: typeof ProjectTitleSchema.Encoded) => {
        pipe(
            newTitle,
            Schema.decodeEither(ProjectTitleSchema),
            Either.map((title) => {
                set(baseTitleAtom, title);
                set(editTitleErrorAtom, null);
            }),
            Either.mapLeft((error) => {
                set(editTitleErrorAtom, error.message);
            }),
        );
    },
);
