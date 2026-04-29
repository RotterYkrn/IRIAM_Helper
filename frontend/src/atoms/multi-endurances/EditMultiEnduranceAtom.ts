import { Option, pipe } from "effect";
import { atom } from "jotai";

import { validEditTitleAtom, editTitleAtom } from "../projects/EditTitleAtom";

import { initUnitsAtom, validUnitsAtom } from "./EditUnitsAtom";

import type { MultiEnduranceProjectDtoSchema } from "@/domain/multi-endurances/dto/MultiEnduranceProjectDto";
import type { ProjectSchema } from "@/domain/projects/tables/Project";

type EditMultiEnduranceStateNew = Readonly<{
    title: typeof ProjectSchema.Type.title;
    units: typeof MultiEnduranceProjectDtoSchema.Type.units;
}>;

/**
 * 耐久企画の編集内容を結合する Atom
 */
const baseEditMultiEnduranceAtom = atom((get) =>
    Option.all({
        title: get(validEditTitleAtom),
        units: get(validUnitsAtom),
    }),
);

/**
 * 耐久企画の編集内容を、保存用に取り出す Atom
 *
 * @description
 * バリデーションエラーがある場合は `null` を返す
 */
export const validEditMultiEnduranceAtom = atom((get) =>
    pipe(get(baseEditMultiEnduranceAtom), Option.getOrNull),
);

/**
 * 耐久企画の編集内容がすべて有効なものかどうかのブール値を取得する Atom
 */
export const isValidEditMultiEnduranceAtom = atom((get) =>
    pipe(get(baseEditMultiEnduranceAtom), Option.isSome),
);

/**
 * 耐久企画の編集内容を初期化する Atom
 */
export const initEditMultiEnduranceAtom = atom(
    null,
    (_, set, initial: EditMultiEnduranceStateNew) => {
        set(editTitleAtom, initial.title);
        set(initUnitsAtom, initial.units);
    },
);
