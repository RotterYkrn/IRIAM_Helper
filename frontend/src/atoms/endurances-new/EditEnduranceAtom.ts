import { Chunk, pipe } from "effect";
import { atom } from "jotai";

import { editTitleAtom } from "../projects/EditTitleAtom";

import {
    editRescueActionsAtomsNew,
    editSabotageActionsAtomsNew,
} from "./EditActionAtom";
import { editTargetCountAtomNew } from "./EditTargetCountAtom";

import type { UpdateEnduranceProjectNewArgs } from "@/domain/endurances-new/rpcs/UpdateEnduranceProjectNew";
import type { EnduranceUnitsSchema } from "@/domain/endurances-new/tables/EnduranceUnits";
import type { EnduranceActionStatsViewNewSchema } from "@/domain/endurances-new/views/EnduranceActionStatsViewNew";
import type { ProjectSchema } from "@/domain/projects/tables/Project";

export type EditEnduranceStateNew = Readonly<{
    title: typeof ProjectSchema.Type.title;
    target_count: typeof EnduranceUnitsSchema.Type.target_count;
    rescue_actions: typeof EnduranceActionStatsViewNewSchema.Type.rescue_actions;
    sabotage_actions: typeof EnduranceActionStatsViewNewSchema.Type.sabotage_actions;
}>;

export const editEnduranceAtomNew = atom<
    Omit<UpdateEnduranceProjectNewArgs, "id" | "unit_id">
>((get) => ({
    title: get(editTitleAtom),
    target_count: get(editTargetCountAtomNew),
    rescue_actions: pipe(
        get(editRescueActionsAtomsNew.editActions),
        Chunk.map((action) => ({
            ...action,
            id: action.isNew ? null : action.id,
        })),
    ),
    sabotage_actions: pipe(
        get(editSabotageActionsAtomsNew.editActions),
        Chunk.map((action) => ({
            ...action,
            id: action.isNew ? null : action.id,
        })),
    ),
}));

export const initEditEnduranceAtomNew = atom(
    null,
    (_, set, initial: EditEnduranceStateNew) => {
        set(editTitleAtom, initial.title);
        set(editTargetCountAtomNew, initial.target_count);
        set(editRescueActionsAtomsNew.initActions, initial.rescue_actions);
        set(editSabotageActionsAtomsNew.initActions, initial.sabotage_actions);
    },
);
