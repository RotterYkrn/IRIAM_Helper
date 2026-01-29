import { atom } from "jotai";

export type EditEnduranceSettingsState = {
    targetCount: number;
};

export const editEnduranceSettingsAtom = atom<EditEnduranceSettingsState>({
    targetCount: 0,
});

export const initializeEditEnduranceSettingsAtom = atom(
    null,
    (_get, set, initial: EditEnduranceSettingsState) => {
        set(editEnduranceSettingsAtom, {
            targetCount: initial.targetCount,
        });
    },
);
