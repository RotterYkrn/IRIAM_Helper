import { Option, Chunk, Either, pipe, Schema } from "effect";
import { atom } from "jotai";

import {
    EnduranceActionAmountSchema,
    EnduranceActionIdSchema,
    EnduranceActionLabelSchema,
    EnduranceActionPositionSchema,
    type EnduranceActionsNewSchema,
} from "@/domain/endurances-new/tables/EnduranceActionsNew";
import type { EnduranceActionStatNewSchema } from "@/domain/endurances-new/types/EnduranceActionStatNew";

/**
 * 編集中の救済・妨害の各要素を管理するための型。
 * バリデーション済みのものが入ります。
 */
type EditAction = Readonly<{
    id: typeof EnduranceActionsNewSchema.Type.id;
    position: typeof EnduranceActionsNewSchema.Type.position;
    label: typeof EnduranceActionsNewSchema.Type.label;
    amount: typeof EnduranceActionsNewSchema.Type.amount;
    /**
     * 新規追加されたものは、更新時の引数で`id: null`を指定する必要があるため、\
     * 新規追加かどうかを管理する必要があります。
     */
    isNew: boolean;
    /**
     * 各編集内容でバリデーションエラーが発生したときに、\
     * 対象のエラーメッセージが設定されます。
     */
    errors: {
        label: string | null;
        amount: string | null;
    };
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
 * - isValid: 救済・妨害の編集内容が有効かどうかを管理する Atom
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
            initialActions: Chunk.Chunk<
                typeof EnduranceActionStatNewSchema.Type
            >,
        ) => {
            set(
                editActions,
                Chunk.map(initialActions, (action) => ({
                    ...action,
                    isNew: false,
                    errors: {
                        label: null,
                        amount: null,
                    },
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
                isNew: true,
                position: Schema.decodeSync(EnduranceActionPositionSchema)(
                    prev.length,
                ),
                label: "" as typeof EnduranceActionsNewSchema.Type.label,
                amount: Schema.decodeSync(EnduranceActionAmountSchema)(1),
                errors: {
                    label: "",
                    amount: null,
                },
            }),
        );
    });

    const deleteAction = (id: typeof EnduranceActionsNewSchema.Type.id) =>
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
        });

    const editLabel = (id: typeof EnduranceActionsNewSchema.Type.id) =>
        atom(
            (get) =>
                pipe(
                    get(editActions),
                    Chunk.findFirst((action) => action.id === id),
                    Option.match({
                        onSome: (action) => ({
                            value: action.label,
                            error: action.errors.label,
                        }),
                        onNone: () => ({
                            value: "" as typeof EnduranceActionsNewSchema.Type.label,
                            error: null,
                        }),
                    }),
                ),
            (
                _,
                set,
                newLabel: typeof EnduranceActionsNewSchema.Encoded.label,
            ) => {
                set(editActions, (prev) =>
                    Chunk.map(prev, (action) =>
                        action.id === id
                            ? pipe(
                                  newLabel,
                                  Schema.decodeEither(
                                      EnduranceActionLabelSchema,
                                  ),
                                  Either.match({
                                      onRight: (label) => ({
                                          ...action,
                                          label: label,
                                          errors: {
                                              ...action.errors,
                                              label: null,
                                          },
                                      }),
                                      onLeft: (error) => ({
                                          ...action,
                                          errors: {
                                              ...action.errors,
                                              label: error.message,
                                          },
                                      }),
                                  }),
                              )
                            : action,
                    ),
                );
            },
        );

    const editAmount = (id: typeof EnduranceActionsNewSchema.Type.id) =>
        atom(
            (get) =>
                pipe(
                    get(editActions),
                    Chunk.findFirst((action) => action.id === id),
                    Option.match({
                        onSome: (action) => ({
                            value: action.amount,
                            error: action.errors.amount,
                        }),
                        onNone: () => ({
                            value: Schema.decodeSync(
                                EnduranceActionAmountSchema,
                            )(1),
                            error: null,
                        }),
                    }),
                ),
            (
                _,
                set,
                newAmount: typeof EnduranceActionsNewSchema.Encoded.amount,
            ) => {
                set(editActions, (prev) =>
                    Chunk.map(prev, (action) =>
                        action.id === id
                            ? pipe(
                                  newAmount,
                                  Schema.decodeEither(
                                      EnduranceActionAmountSchema,
                                  ),
                                  Either.match({
                                      onRight: (amount) => ({
                                          ...action,
                                          amount: amount,
                                          errors: {
                                              ...action.errors,
                                              amount: null,
                                          },
                                      }),
                                      onLeft: (error) => ({
                                          ...action,
                                          errors: {
                                              ...action.errors,
                                              amount: error.message,
                                          },
                                      }),
                                  }),
                              )
                            : action,
                    ),
                );
            },
        );

    const isValid = atom((get) =>
        pipe(
            get(editActions),
            Chunk.every(
                (action) =>
                    action.errors.label === null &&
                    action.errors.amount === null,
            ),
        ),
    );

    return {
        editActions,
        initActions,
        createAction,
        deleteAction,
        editLabel,
        editAmount,
        isValid,
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
