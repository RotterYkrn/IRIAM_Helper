import { atom } from "jotai";

import type { ProjectSchema } from "@/domain/projects/tables/Project";

export type EditProjectState = {
    title: typeof ProjectSchema.Type.title;
};

export const editProjectAtom = atom<EditProjectState>({
    title: "",
});

export const initializeEditProjectAtom = atom(
    null,
    (_get, set, initial: EditProjectState) => {
        set(editProjectAtom, {
            title: initial.title,
        });
    },
);
