import { Chunk, Option, pipe } from "effect";
import { atom } from "jotai";

import { editTitleAtom, validEditTitleAtom } from "../projects/EditTitleAtom";

import {
    editRescueActionsAtomsNew,
    editSabotageActionsAtomsNew,
} from "./EditActionAtom";
import {
    editTargetCountAtom,
    validEditTargetCountAtom,
} from "./EditTargetCountAtom";

import type { UpdateEnduranceProjectNewArgs } from "@/domain/endurances-new/rpcs/UpdateEnduranceProjectNew";
import type {
    EnduranceTargetCountSchema,
    EnduranceUnitsSchema,
} from "@/domain/endurances-new/tables/EnduranceUnits";
import type { EnduranceActionStatsViewNewSchema } from "@/domain/endurances-new/views/EnduranceActionStatsViewNew";
import type {
    ProjectSchema,
    ProjectTitleSchema,
} from "@/domain/projects/tables/Project";

export type EditEnduranceStateNew = Readonly<{
    title: typeof ProjectSchema.Type.title;
    target_count: typeof EnduranceUnitsSchema.Type.target_count;
    rescue_actions: typeof EnduranceActionStatsViewNewSchema.Type.rescue_actions;
    sabotage_actions: typeof EnduranceActionStatsViewNewSchema.Type.sabotage_actions;
}>;

/**
 * 耐久企画の編集内容から更新関数の引数を管理する Atom
 */
export const editEnduranceAtomNew = atom<
    Omit<UpdateEnduranceProjectNewArgs, "id" | "unit_id">
>((get) => ({
    title: Option.getOrElse(
        get(validEditTitleAtom),
        () => "エラー" as typeof ProjectTitleSchema.Type,
    ),
    target_count: Option.getOrElse(
        get(validEditTargetCountAtom),
        () => 1 as typeof EnduranceTargetCountSchema.Type,
    ),
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

/**
 * 耐久企画の編集内容を初期化する Atom
 */
export const initEditEnduranceAtomNew = atom(
    null,
    (_, set, initial: EditEnduranceStateNew) => {
        set(editTitleAtom, initial.title);
        set(editTargetCountAtom, initial.target_count.toString());
        set(editRescueActionsAtomsNew.initActions, initial.rescue_actions);
        set(editSabotageActionsAtomsNew.initActions, initial.sabotage_actions);
    },
);
