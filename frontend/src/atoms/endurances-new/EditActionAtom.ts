import { Option, Chunk, Either, pipe, Schema } from "effect";
import { atom } from "jotai";
import { atomFamily } from "jotai-family";

import type { EnduranceActionDtoSchema } from "@/domain/endurances-new/dto/EnduranceProjectDto";
import {
    EnduranceActionAmountSchema,
    EnduranceActionIdSchema,
    EnduranceActionLabelSchema,
    EnduranceActionPositionSchema,
    type EnduranceActionsNewSchema,
} from "@/domain/endurances-new/tables/EnduranceActionsNew";
import { normalizeNumber } from "@/utils/validations";

type EditState<T> = {
    input: string;
    valid: Option.Option<T>;
    error: string | null;
};

/**
 * 編集中の救済・妨害の各要素を管理するための型。
 * バリデーション済みのものが入ります。
 */
type EditAction = Readonly<{
    id: typeof EnduranceActionsNewSchema.Type.id;
    position: typeof EnduranceActionsNewSchema.Type.position;
    label: EditState<typeof EnduranceActionsNewSchema.Type.label>;
    amount: EditState<typeof EnduranceActionsNewSchema.Type.amount>;
    /**
     * 新規追加されたものは、更新時の引数で`id: null`を指定する必要があるため、\
     * 新規追加かどうかを管理する必要があります。
     */
    isNew: boolean;
}>;

/**
 * 救済・妨害の編集に必要な共通の Atom 群を生成します。
 *
 * @description
 * 各コンポーネントで個別に利用できる Atom 群を生成します。\
 * 救済・妨害で共通のものを使用できます。
 * - editActions: 編集中の救済・妨害の一覧を管理する Atom
 * - initActions: 救済・妨害の一覧を初期化する Atom
 * - createAction: 救済・妨害を追加する Atom
 * - deleteAction: 指定した救済・妨害を削除する Atom
 * - editLabel: 指定した救済・妨害のラベルを編集する Atom
 * - editAmount: 指定した救済・妨害の回数を編集する Atom
 * - validActions: バリデーション済みの救済・妨害の一覧を取得する Atom
 *
 * @returns 救済・妨害の編集に必要な共通の Atom 群
 */
const createEditActionAtoms = () => {
    const editActions = atom<Chunk.Chunk<EditAction>>(Chunk.empty());

    const initActions = atom(
        null,
        (
            _,
            set,
            initialActions: Chunk.Chunk<typeof EnduranceActionDtoSchema.Type>,
        ) => {
            set(
                editActions,
                Chunk.map(initialActions, (action) => ({
                    id: action.id,
                    position: action.position,
                    label: {
                        input: action.label,
                        valid: Option.some(action.label),
                        error: null,
                    },
                    amount: {
                        input: action.amount.toString(),
                        valid: Option.some(action.amount),
                        error: null,
                    },
                    isNew: false,
                })),
            );
        },
    );

    const createAction = atom(null, (_, set) => {
        set(editActions, (prev) =>
            Chunk.append(prev, {
                id: Schema.decodeSync(EnduranceActionIdSchema)(
                    crypto.randomUUID(),
                ),
                position: Schema.decodeSync(EnduranceActionPositionSchema)(
                    prev.length,
                ),
                label: {
                    input: "",
                    valid: Option.none(),
                    error: null,
                },
                amount: {
                    input: "",
                    valid: Option.none(),
                    error: null,
                },
                isNew: true,
            }),
        );
    });

    const deleteAction = atomFamily(
        (id: typeof EnduranceActionsNewSchema.Type.id) =>
            atom(null, (_, set) => {
                set(editActions, (prev) =>
                    pipe(
                        prev,
                        Chunk.filter((action) => action.id !== id),
                        Chunk.map((action, i) => ({
                            ...action,
                            position: Schema.decodeSync(
                                EnduranceActionPositionSchema,
                            )(i),
                        })),
                    ),
                );
            }),
    );

    const editLabel = atomFamily(
        (id: typeof EnduranceActionsNewSchema.Type.id) =>
            atom(
                (get) =>
                    pipe(
                        get(editActions),
                        Chunk.findFirst((action) => action.id === id),
                        Option.map((action) => ({
                            input: action.label.input,
                            error: action.label.error,
                        })),
                        Option.getOrNull,
                    ),
                (_, set, input: string) => {
                    set(editActions, (prev) =>
                        Chunk.map(prev, (action) =>
                            action.id === id
                                ? pipe(
                                      input,
                                      Schema.decodeEither(
                                          EnduranceActionLabelSchema,
                                      ),
                                      (result) => ({
                                          ...action,
                                          label: {
                                              ...action.label,
                                              input,
                                              valid: Option.getRight(result),
                                              error: Either.isLeft(result)
                                                  ? result.left.message
                                                  : null,
                                          },
                                      }),
                                  )
                                : action,
                        ),
                    );
                },
            ),
    );

    const editAmount = atomFamily(
        (id: typeof EnduranceActionsNewSchema.Type.id) =>
            atom(
                (get) =>
                    pipe(
                        get(editActions),
                        Chunk.findFirst((action) => action.id === id),
                        Option.map((action) => ({
                            input: action.amount.input,
                            error: action.amount.error,
                        })),
                        Option.getOrNull,
                    ),
                (_, set, input: string) => {
                    set(editActions, (prev) =>
                        Chunk.map(prev, (action) =>
                            action.id === id
                                ? pipe(
                                      input,
                                      normalizeNumber,
                                      (normalized) => ({
                                          normalized,
                                          result: pipe(
                                              normalized,
                                              Number,
                                              Schema.decodeEither(
                                                  EnduranceActionAmountSchema,
                                              ),
                                          ),
                                      }),
                                      ({ normalized, result }) => ({
                                          ...action,
                                          amount: {
                                              input: normalized,
                                              valid: Option.getRight(result),
                                              error: Either.isLeft(result)
                                                  ? result.left.message
                                                  : null,
                                          },
                                      }),
                                  )
                                : action,
                        ),
                    );
                },
            ),
    );

    const validActions = atom((get) =>
        pipe(
            get(editActions),
            Chunk.map((action) =>
                Option.all({
                    id: Option.some(action.isNew ? null : action.id),
                    position: Option.some(action.position),
                    label: action.label.valid,
                    amount: action.amount.valid,
                }),
            ),
            Option.all,
            Option.map(Chunk.fromIterable),
        ),
    );

    return {
        editActions,
        initActions,
        createAction,
        deleteAction,
        editLabel,
        editAmount,
        validActions,
    };
};

/**
 * 耐久企画の救援行動を編集するAtom
 */
export const editRescueActionsAtomsNew = createEditActionAtoms();
/**
 * 耐久企画の妨害行動を編集するAtom
 */
export const editSabotageActionsAtomsNew = createEditActionAtoms();
