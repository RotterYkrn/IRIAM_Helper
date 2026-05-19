import { Option, pipe } from "effect";
import { atom } from "jotai";

import { editTitleAtom, validEditTitleAtom } from "../projects/EditTitleAtom";

import {
    editRescueActionsAtoms,
    editSabotageActionsAtoms,
} from "./EditActionAtom";
import {
    editTargetCountAtom,
    validEditTargetCountAtom,
} from "./EditTargetCountAtom";

import type { EnduranceProjectDtoSchema } from "@/domain/endurances/dto/EnduranceProjectDto";
import type { EnduranceUnitsSchema } from "@/domain/endurances/tables/EnduranceUnits";
import type { ProjectSchema } from "@/domain/projects/tables/Project";

type EditEnduranceState = Readonly<{
    title: typeof ProjectSchema.Type.title;
    target_count: typeof EnduranceUnitsSchema.Type.target_count;
    rescue_actions: typeof EnduranceProjectDtoSchema.Type.rescue_actions;
    sabotage_actions: typeof EnduranceProjectDtoSchema.Type.sabotage_actions;
}>;

/**
 * 耐久企画の編集内容を結合する Atom
 */
const baseEditEnduranceAtom = atom((get) =>
    Option.all({
        title: get(validEditTitleAtom),
        target_count: get(validEditTargetCountAtom),
        rescue_actions: get(editRescueActionsAtoms.validActions),
        sabotage_actions: get(editSabotageActionsAtoms.validActions),
    }),
);

/**
 * 耐久企画の編集内容を、保存用に取り出す Atom
 *
 * @description
 * バリデーションエラーがある場合は `null` を返す
 */
export const validEditEnduranceAtom = atom((get) =>
    pipe(get(baseEditEnduranceAtom), Option.getOrNull),
);

/**
 * 耐久企画の編集内容がすべて有効なものかどうかのブール値を取得する Atom
 */
export const isValidEditEnduranceAtom = atom((get) =>
    pipe(get(baseEditEnduranceAtom), Option.isSome),
);

/**
 * 耐久企画の編集内容を初期化する Atom
 */
export const initEditEnduranceAtom = atom(
    null,
    (_, set, initial: EditEnduranceState) => {
        set(editTitleAtom, initial.title);
        set(editTargetCountAtom, initial.target_count.toString());
        set(editRescueActionsAtoms.initActions, initial.rescue_actions);
        set(editSabotageActionsAtoms.initActions, initial.sabotage_actions);
    },
);
