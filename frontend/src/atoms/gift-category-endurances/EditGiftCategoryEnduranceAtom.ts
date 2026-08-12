import { Option, pipe } from "effect";
import { atom } from "jotai";

import { editTitleAtom, validEditTitleAtom } from "../projects/EditTitleAtom";

import type { EnduranceUnitsSchema } from "@/domain/endurances/tables/EnduranceUnits";
import type { ProjectSchema } from "@/domain/projects/tables/Project";
import {
    editTargetCountAtom,
    validEditTargetCountAtom,
} from "../endurances/EditTargetCountAtom";

type EditGiftCategoryEnduranceState = Readonly<{
    title: typeof ProjectSchema.Type.title;
    target_count: typeof EnduranceUnitsSchema.Type.target_count;
}>;

/**
 * 耐久企画の編集内容を結合する Atom
 */
const baseEditGiftCategoryEnduranceAtom = atom((get) =>
    Option.all({
        title: get(validEditTitleAtom),
        target_count: get(validEditTargetCountAtom),
    }),
);

/**
 * 耐久企画の編集内容を、保存用に取り出す Atom
 *
 * @description
 * バリデーションエラーがある場合は `null` を返す
 */
export const validEditGiftCategoryEnduranceAtom = atom((get) =>
    pipe(get(baseEditGiftCategoryEnduranceAtom), Option.getOrNull),
);

/**
 * 耐久企画の編集内容がすべて有効なものかどうかのブール値を取得する Atom
 */
export const isValidEditGiftCategoryEnduranceAtom = atom((get) =>
    pipe(get(baseEditGiftCategoryEnduranceAtom), Option.isSome),
);

/**
 * 耐久企画の編集内容を初期化する Atom
 */
export const initEditGiftCategoryEnduranceAtom = atom(
    null,
    (_, set, initial: EditGiftCategoryEnduranceState) => {
        set(editTitleAtom, initial.title);
        set(editTargetCountAtom, initial.target_count.toString());
    },
);
