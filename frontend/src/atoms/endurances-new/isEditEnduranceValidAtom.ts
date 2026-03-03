import { atom } from "jotai";

import { editTitleErrorAtom } from "../projects/EditTitleAtom";

import {
    editRescueActionsAtomsNew,
    editSabotageActionsAtomsNew,
} from "./EditActionAtom";
import { editTargetCountErrorAtomNew } from "./EditTargetCountAtom";

/**
 * 耐久企画に関する編集内容が有効なものかどうかを格納するAtom
 */
export const isEnduranceValidAtomNew = atom((get) => {
    return (
        !get(editTitleErrorAtom) &&
        !get(editTargetCountErrorAtomNew) &&
        get(editRescueActionsAtomsNew.isValid) &&
        get(editSabotageActionsAtomsNew.isValid)
    );
});
