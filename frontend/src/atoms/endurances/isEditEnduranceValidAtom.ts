import { atom } from "jotai";

import { editTitleErrorAtom } from "../projects/EditTitleAtom";

import {
    editRescueActionsAtoms,
    editSabotageActionsAtoms,
} from "./EditActionAtom";
import { editTargetCountErrorAtom } from "./EditTargetCountAtom";

export const isEnduranceValidAtom = atom((get) => {
    return (
        !get(editTitleErrorAtom) &&
        !get(editTargetCountErrorAtom) &&
        get(editRescueActionsAtoms.isValid) &&
        get(editSabotageActionsAtoms.isValid)
    );
});
