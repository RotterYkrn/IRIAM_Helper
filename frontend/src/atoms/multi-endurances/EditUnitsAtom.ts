import { Chunk, Either, Option, pipe, Schema } from "effect";
import { atom } from "jotai";
import { atomFamily } from "jotai-family";

import type { EditState } from "../types";

import {
    EnduranceTargetCountSchema,
    EnduranceUnitIdSchema,
    EnduranceUnitLabelSchema,
    type EnduranceUnitsSchema,
} from "@/domain/endurances-new/tables/EnduranceUnits";
import type { MultiEnduranceProjectDtoSchema } from "@/domain/multi-endurances/dto/MultiEnduranceProjectDto";
import { normalizeNumber } from "@/utils/validations";

type EditUnit = {
    id: typeof EnduranceUnitsSchema.Type.id;
    position: typeof EnduranceUnitsSchema.Type.position;
    label: EditState<typeof EnduranceUnitsSchema.Type.label>;
    target_count: EditState<typeof EnduranceUnitsSchema.Type.target_count>;

    isNew: boolean;
};

export const editUnitsAtom = atom<Chunk.Chunk<EditUnit>>(Chunk.empty());

export const initUnitsAtom = atom(
    null,
    (
        _,
        set,
        initialUnits: typeof MultiEnduranceProjectDtoSchema.Type.units,
    ) => {
        set(
            editUnitsAtom,
            Chunk.map(initialUnits, (action) => ({
                id: action.id,
                position: action.position,
                label: {
                    input: action.label,
                    valid: Option.some(action.label),
                    error: null,
                },
                target_count: {
                    input: action.target_count.toString(),
                    valid: Option.some(action.target_count),
                    error: null,
                },
                isNew: false,
            })),
        );
    },
);

export const createUnitAtom = atom(null, (_, set) => {
    set(editUnitsAtom, (prev) =>
        Chunk.append(prev, {
            id: EnduranceUnitIdSchema.make(crypto.randomUUID()),
            position: prev.length,
            label: {
                input: "",
                valid: Option.none(),
                error: null,
            },
            target_count: {
                input: "",
                valid: Option.none(),
                error: null,
            },
            isNew: true,
        }),
    );
});

export const deleteUnitAtom = atomFamily(
    (id: typeof EnduranceUnitsSchema.Type.id) =>
        atom(null, (_, set) => {
            set(editUnitsAtom, (prev) =>
                pipe(
                    prev,
                    Chunk.filter((action) => action.id !== id),
                    Chunk.map((action, i) => ({
                        ...action,
                        position: i,
                    })),
                ),
            );
        }),
);

export const editUnitLabelAtom = atomFamily(
    (id: typeof EnduranceUnitsSchema.Type.id) =>
        atom(
            (get) =>
                pipe(
                    get(editUnitsAtom),
                    Chunk.findFirst((action) => action.id === id),
                    Option.map((action) => ({
                        input: action.label.input,
                        error: action.label.error,
                    })),
                    Option.getOrNull,
                ),
            (_, set, input: string) => {
                set(editUnitsAtom, (prev) =>
                    Chunk.map(prev, (action) =>
                        action.id === id
                            ? pipe(
                                  input,
                                  Schema.decodeEither(EnduranceUnitLabelSchema),
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

export const editUnitTargetCountAtom = atomFamily(
    (id: typeof EnduranceUnitsSchema.Type.id) =>
        atom(
            (get) =>
                pipe(
                    get(editUnitsAtom),
                    Chunk.findFirst((action) => action.id === id),
                    Option.map((action) => ({
                        input: action.target_count.input,
                        error: action.target_count.error,
                    })),
                    Option.getOrNull,
                ),
            (_, set, input: string) => {
                set(editUnitsAtom, (prev) =>
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
                                              EnduranceTargetCountSchema,
                                          ),
                                      ),
                                  }),
                                  ({ normalized, result }) => ({
                                      ...action,
                                      target_count: {
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

export const validUnitsAtom = atom((get) =>
    pipe(
        get(editUnitsAtom),
        Chunk.map((action) =>
            Option.all({
                id: Option.some(action.isNew ? null : action.id),
                position: Option.some(action.position),
                label: action.label.valid,
                target_count: action.target_count.valid,
            }),
        ),
        Option.all,
        Option.map(Chunk.fromIterable),
    ),
);
