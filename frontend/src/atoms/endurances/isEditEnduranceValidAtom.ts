import { atom } from "jotai";

import { editTitleErrorAtom } from "../projects/EditTitleAtom";

import { editTargetCountErrorAtom } from "./EditTargetCountAtom";

export const isEnduranceValidAtom = atom((get) => {
    return !get(editTitleErrorAtom) && !get(editTargetCountErrorAtom);
});
