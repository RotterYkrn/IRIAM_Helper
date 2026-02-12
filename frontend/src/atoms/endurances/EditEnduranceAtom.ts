import { Chunk, pipe } from "effect";
import { atom } from "jotai";

import { editTitleAtom } from "../projects/EditTitleAtom";

import {
    editRescueActionsAtoms,
    editSabotageActionsAtoms,
} from "./EditActionAtom";
import { editTargetCountAtom } from "./EditTargetCountAtom";

import type { UpdateEnduranceProjectArgs } from "@/domain/endurances/rpcs/UpdateEnduranceProject";
import type { EnduranceActionStatsViewSchema } from "@/domain/endurances/views/EnduranceActionStatsView";

export type EditEnduranceState = Omit<
    UpdateEnduranceProjectArgs,
    "id" | "rescue_actions" | "sabotage_actions"
> & {
    rescue_actions: typeof EnduranceActionStatsViewSchema.Type.rescue_actions;
    sabotage_actions: typeof EnduranceActionStatsViewSchema.Type.sabotage_actions;
};

export const editEnduranceAtom = atom<Omit<UpdateEnduranceProjectArgs, "id">>(
    (get) => ({
        title: get(editTitleAtom),
        target_count: get(editTargetCountAtom),
        rescue_actions: pipe(
            get(editRescueActionsAtoms.editActions),
            Chunk.map((action) => ({
                ...action,
                id: action.isNew ? null : action.id,
            })),
        ),
        sabotage_actions: pipe(
            get(editSabotageActionsAtoms.editActions),
            Chunk.map((action) => ({
                ...action,
                id: action.isNew ? null : action.id,
            })),
        ),
    }),
);

export const initEditEnduranceAtom = atom(
    null,
    (_, set, initial: EditEnduranceState) => {
        set(editTitleAtom, initial.title);
        set(editTargetCountAtom, initial.target_count);
        set(editRescueActionsAtoms.initActions, initial.rescue_actions);
        set(editSabotageActionsAtoms.initActions, initial.sabotage_actions);
    },
);
