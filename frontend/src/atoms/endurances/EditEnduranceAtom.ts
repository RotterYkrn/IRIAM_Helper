import { atom } from "jotai";

import { editTitleAtom } from "../projects/EditTitleAtom";

import { editTargetCountAtom } from "./EditTargetCountAtom";

import type { EnduranceSettings } from "@/domain/endurances/tables/EnduranceSettings";
import type { Project } from "@/domain/projects/tables/Project";

export type EditEnduranceState = Pick<Project, "title"> &
    Pick<EnduranceSettings, "target_count">;

export const editEnduranceAtom = atom<EditEnduranceState>((get) => {
    return {
        title: get(editTitleAtom),
        target_count: get(editTargetCountAtom),
    };
});

export const initEditEnduranceAtom = atom(
    null,
    (_get, set, initial: EditEnduranceState) => {
        set(editTitleAtom, initial.title);
        set(editTargetCountAtom, initial.target_count);
    },
);
