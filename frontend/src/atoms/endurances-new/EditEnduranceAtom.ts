import { Option, pipe } from "effect";
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

import type { EnduranceUnitsSchema } from "@/domain/endurances-new/tables/EnduranceUnits";
import type { EnduranceActionStatsViewNewSchema } from "@/domain/endurances-new/views/EnduranceActionStatsViewNew";
import type { ProjectSchema } from "@/domain/projects/tables/Project";

type EditEnduranceStateNew = Readonly<{
    title: typeof ProjectSchema.Type.title;
    target_count: typeof EnduranceUnitsSchema.Type.target_count;
    rescue_actions: typeof EnduranceActionStatsViewNewSchema.Type.rescue_actions;
    sabotage_actions: typeof EnduranceActionStatsViewNewSchema.Type.sabotage_actions;
}>;

/**
 * 耐久企画の編集内容を結合する Atom
 */
const baseEditEnduranceAtom = atom((get) =>
    Option.all({
        title: get(validEditTitleAtom),
        target_count: get(validEditTargetCountAtom),
        rescue_actions: get(editRescueActionsAtomsNew.validActions),
        sabotage_actions: get(editSabotageActionsAtomsNew.validActions),
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
    (_, set, initial: EditEnduranceStateNew) => {
        set(editTitleAtom, initial.title);
        set(editTargetCountAtom, initial.target_count.toString());
        set(editRescueActionsAtomsNew.initActions, initial.rescue_actions);
        set(editSabotageActionsAtomsNew.initActions, initial.sabotage_actions);
    },
);
