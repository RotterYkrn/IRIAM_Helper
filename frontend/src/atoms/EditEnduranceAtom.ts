import { atom } from "jotai";

import {
    editEnduranceSettingsAtom,
    type EditEnduranceSettingsState,
} from "./EditEnduranceSettingsAtom";
import { editProjectAtom, type EditProjectState } from "./EditProjectAtom";

export type EditEnduranceState = EditProjectState & EditEnduranceSettingsState;

export const editEnduranceAtom = atom<EditEnduranceState>((get) => {
    return {
        ...get(editProjectAtom),
        ...get(editEnduranceSettingsAtom),
    };
});
