import { atom } from "jotai";

export type EditProjectState = {
    title: string;
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
