import { atom } from "jotai";

import { editTitleErrorAtom } from "../projects/EditTitleAtom";

import {
    editRescueActionsAtomsNew,
    editSabotageActionsAtomsNew,
} from "./EditActionAtom";
import { editTargetCountErrorAtomNew } from "./EditTargetCountAtom";

export const isEnduranceValidAtomNew = atom((get) => {
    return (
        !get(editTitleErrorAtom) &&
        !get(editTargetCountErrorAtomNew) &&
        get(editRescueActionsAtomsNew.isValid) &&
        get(editSabotageActionsAtomsNew.isValid)
    );
});
