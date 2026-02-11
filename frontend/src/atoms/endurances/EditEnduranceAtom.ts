import { Chunk, pipe } from "effect";
import { atom } from "jotai";

import { editTitleAtom } from "../projects/EditTitleAtom";

import { editRescueActionsAtoms } from "./EditActionAtom";
import { editTargetCountAtom } from "./EditTargetCountAtom";

import type { UpdateEnduranceProjectArgs } from "@/domain/endurances/rpcs/UpdateEnduranceProject";
import type { EnduranceActions } from "@/domain/endurances/tables/EnduranceActions";

export type EditEnduranceState = Omit<
    UpdateEnduranceProjectArgs,
    "id" | "rescue_actions" | "sabotage_actions"
> & {
    rescue_actions: Chunk.Chunk<EnduranceActions>;
    sabotage_actions: Chunk.Chunk<EnduranceActions>;
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
        sabotage_actions: Chunk.empty(),
    }),
);

export const initEditEnduranceAtom = atom(
    null,
    (_, set, initial: EditEnduranceState) => {
        set(editTitleAtom, initial.title);
        set(editTargetCountAtom, initial.target_count);
        set(editRescueActionsAtoms.initActions, initial.rescue_actions);
    },
);
