import { Option, Chunk, Either, pipe, Schema } from "effect";
import { atom } from "jotai";

import type { UpdateEnduranceActionArgs } from "@/domain/endurances/rpcs/UpdateEnduranceProject";
import {
    EnduranceActionAmountSchema,
    EnduranceActionIdSchema,
    EnduranceActionLabelSchema,
    EnduranceActionPositionSchema,
    EnduranceActionsSchema,
} from "@/domain/endurances/tables/EnduranceActions";
import type { EnduranceActionStatSchema } from "@/domain/endurances/types/EnduranceActionStat";

type EditAction = Omit<UpdateEnduranceActionArgs, "id"> & {
    id: typeof EnduranceActionsSchema.Type.id;
    isNew: boolean;
    errors: {
        label: string | null;
        amount: string | null;
    };
};

const createEditActionAtoms = () => {
    const editActions = atom<Chunk.Chunk<EditAction>>(Chunk.empty());

    const initActions = atom(
        null,
        (
            _,
            set,
            initialActions: Chunk.Chunk<typeof EnduranceActionStatSchema.Type>,
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
                label: "" as typeof EnduranceActionsSchema.Type.label,
                amount: Schema.decodeSync(EnduranceActionAmountSchema)(1),
                errors: {
                    label: "",
                    amount: null,
                },
            }),
        );
    });

    const deleteAction = (id: typeof EnduranceActionsSchema.Type.id) =>
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

    const editLabel = (id: typeof EnduranceActionsSchema.Type.id) =>
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
                            value: "" as typeof EnduranceActionsSchema.Type.label,
                            error: null,
                        }),
                    }),
                ),
            (_, set, newLabel: typeof EnduranceActionsSchema.Encoded.label) => {
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

    const editAmount = (id: typeof EnduranceActionsSchema.Type.id) =>
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
                newAmount: typeof EnduranceActionsSchema.Encoded.amount,
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

export const editRescueActionsAtoms = createEditActionAtoms();
export const editSabotageActionsAtoms = createEditActionAtoms();
