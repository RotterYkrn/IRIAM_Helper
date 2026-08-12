import { Chunk, Option, Order, pipe } from "effect";
import { atom } from "jotai";

import { type EnduranceUnitsSchema } from "@/domain/endurances/tables/EnduranceUnits";
import type { GiftId } from "@/domain/gifts/tables/Gifts";

export type EditUnit = {
    id: typeof EnduranceUnitsSchema.Type.id;
    position: typeof EnduranceUnitsSchema.Type.position;
    gift_id: GiftId;
};

export const editUnitsAtom = atom<Chunk.Chunk<EditUnit>>(Chunk.empty());

export const initUnitsAtom = atom(
    null,
    (_, set, initialUnits: Chunk.Chunk<EditUnit>) => {
        set(
            editUnitsAtom,
            pipe(
                initialUnits,
                Chunk.sort(
                    Order.mapInput(
                        Order.number,
                        (unit: EditUnit) => unit.position,
                    ),
                ),
            ),
        );
    },
);

// export const createUnitAtom = atom(null, (_, set) => {
//     set(editUnitsAtom, (prev) =>
//         Chunk.append(prev, {
//             id: EnduranceUnitIdSchema.make(crypto.randomUUID()),
//             position: prev.length,
//             gift_id: null,
//             target_count: 1,
//         }),
//     );
// });

// export const deleteUnitAtom = atomFamily(
//     (id: typeof EnduranceUnitsSchema.Type.id) =>
//         atom(null, (_, set) => {
//             set(editUnitsAtom, (prev) =>
//                 pipe(
//                     prev,
//                     Chunk.filter((action) => action.id !== id),
//                     Chunk.map((action, i) => ({
//                         ...action,
//                         position: i,
//                     })),
//                 ),
//             );
//         }),
// );

// export const editUnitLabelAtom = atomFamily(
//     (id: typeof EnduranceUnitsSchema.Type.id) =>
//         atom(
//             (get) =>
//                 pipe(
//                     get(editUnitsAtom),
//                     Chunk.findFirst((action) => action.id === id),
//                     Option.map((action) => ({
//                         input: action.label.input,
//                         error: action.label.error,
//                     })),
//                     Option.getOrNull,
//                 ),
//             (_, set, input: string) => {
//                 set(editUnitsAtom, (prev) =>
//                     Chunk.map(prev, (action) =>
//                         action.id === id
//                             ? pipe(
//                                   input,
//                                   Schema.decodeEither(EnduranceUnitLabelSchema),
//                                   (result) => ({
//                                       ...action,
//                                       label: {
//                                           ...action.label,
//                                           input,
//                                           valid: Option.getRight(result),
//                                           error: Either.isLeft(result)
//                                               ? result.left.message
//                                               : null,
//                                       },
//                                   }),
//                               )
//                             : action,
//                     ),
//                 );
//             },
//         ),
// );

// export const editUnitTargetCountAtom = atomFamily(
//     (id: typeof EnduranceUnitsSchema.Type.id) =>
//         atom(
//             (get) =>
//                 pipe(
//                     get(editUnitsAtom),
//                     Chunk.findFirst((action) => action.id === id),
//                     Option.map((action) => ({
//                         input: action.target_count.input,
//                         error: action.target_count.error,
//                     })),
//                     Option.getOrNull,
//                 ),
//             (_, set, input: string) => {
//                 set(editUnitsAtom, (prev) =>
//                     Chunk.map(prev, (action) =>
//                         action.id === id
//                             ? pipe(
//                                   input,
//                                   normalizeNumber,
//                                   (normalized) => ({
//                                       normalized,
//                                       result: pipe(
//                                           normalized,
//                                           (s) => (s.trim() === "" ? "0" : s),
//                                           Number,
//                                           Schema.decodeEither(
//                                               EnduranceTargetCountSchema,
//                                           ),
//                                       ),
//                                   }),
//                                   ({ normalized, result }) => ({
//                                       ...action,
//                                       target_count: {
//                                           input: normalized,
//                                           valid: Option.getRight(result),
//                                           error: Either.isLeft(result)
//                                               ? result.left.message
//                                               : null,
//                                       },
//                                   }),
//                               )
//                             : action,
//                     ),
//                 );
//             },
//         ),
// );

export const upsertUnitsAtom = atom(
    null,
    (_, set, newUnits: Chunk.Chunk<EditUnit>) => {
        set(editUnitsAtom, newUnits);
    },
);

export const validUnitsAtom = atom((get) =>
    pipe(
        get(editUnitsAtom),
        Chunk.map((action) =>
            Option.all({
                position: Option.some(action.position),
                gift_id: Option.some(action.gift_id),
            }),
        ),
        (units) => (Chunk.isEmpty(units) ? Chunk.make(Option.none()) : units),
        Option.all,
        Option.map(Chunk.fromIterable),
        Option.flatMap((units) =>
            Chunk.isEmpty(units) ? Option.none() : Option.some(units),
        ),
    ),
);
