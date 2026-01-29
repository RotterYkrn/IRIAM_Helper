import { atom } from "jotai";

import { editEnduranceSettingsAtom } from "./EditEnduranceSettingsAtom";
import { editProjectAtom } from "./EditProjectAtom";

export type EditEnduranceState = {
    title: string;
    targetCount: number;
};

export const editEnduranceAtom = atom<EditEnduranceState>((get) => {
    return {
        ...get(editProjectAtom),
        ...get(editEnduranceSettingsAtom),
    };
});
