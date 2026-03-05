import { atom } from "jotai";

import { isValidEditTitleAtom } from "../projects/EditTitleAtom";

import {
    editRescueActionsAtomsNew,
    editSabotageActionsAtomsNew,
} from "./EditActionAtom";
import { isValidEditTargetCountAtom } from "./EditTargetCountAtom";

/**
 * 耐久企画に関する編集内容が有効なものかどうかを格納するAtom
 */
export const isEnduranceValidAtomNew = atom((get) => {
    return (
        get(isValidEditTitleAtom) &&
        get(isValidEditTargetCountAtom) &&
        get(editRescueActionsAtomsNew.isValid) &&
        get(editSabotageActionsAtomsNew.isValid)
    );
});
