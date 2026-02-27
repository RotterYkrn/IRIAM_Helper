import { Schema } from "effect";

import {
    EnduranceUnitIdSchema,
    type EnduranceUnitsSchema,
} from "./EnduranceUnits";

import {
    ProjectIdSchema,
    type ProjectSchema,
} from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";

/** {@link EnduranceActionsNewSchema} */
export type EnduranceActionsEncoded = Readonly<
    Database["public"]["Tables"]["endurance_actions_new"]["Row"]
>;

export const EnduranceActionIdSchema = Schema.UUID.pipe(
    Schema.brand("EnduranceActionId"),
);

/**
 * アクションの種類
 *
 * `"rescue"`: 救済\
 * `"sabotage"`: 妨害
 */
export const EnduranceActionTypeSchema = Schema.String.pipe(
    Schema.compose(Schema.Literal("rescue", "sabotage")),
    Schema.brand("EnduranceActionType"),
);

/** 並び制御用 */
export const EnduranceActionPositionSchema = Schema.NonNegativeInt.pipe(
    Schema.brand("EnduranceActionPosition"),
);

export const EnduranceActionLabelSchema = Schema.String.pipe(
    Schema.minLength(1, {
        message: () => "1文字以上入力してください",
    }),
    Schema.brand("EnduranceActionLabel"),
);

/** アクションごとに加算する数 */
export const EnduranceActionAmountSchema = Schema.Number.pipe(
    Schema.positive({
        message: () => "0より大きいの数を入力してください",
    }),
    Schema.brand("EnduranceActionAmount"),
);

/** アクションを行った回数 */
export const EnduranceActionCountSchema = Schema.NonNegativeInt.pipe(
    Schema.brand("EnduranceActionCount"),
);

/** {@link EnduranceActionsNewSchema} */
export type EnduranceActionsNew = Readonly<{
    id: typeof EnduranceActionIdSchema.Type;

    project_id: typeof ProjectSchema.Type.id;

    unit_id: typeof EnduranceUnitsSchema.Type.id;

    /** {@link EnduranceActionTypeSchema} */
    type: typeof EnduranceActionTypeSchema.Type;

    /** {@link EnduranceActionPositionSchema} */
    position: typeof EnduranceActionPositionSchema.Type;

    label: typeof EnduranceActionLabelSchema.Type;

    /** {@link EnduranceActionAmountSchema} */
    amount: typeof EnduranceActionAmountSchema.Type;

    /** {@link EnduranceActionCountSchema} */
    count: typeof EnduranceActionCountSchema.Type;

    created_at: Date;

    updated_at: Date;
}>;

/**
 * endurance_actions_new テーブル
 * 救済・妨害アクションの設定
 */
export const EnduranceActionsNewSchema: Schema.Schema<
    EnduranceActionsNew,
    EnduranceActionsEncoded
> = Schema.Struct({
    id: EnduranceActionIdSchema,
    project_id: ProjectIdSchema,
    unit_id: EnduranceUnitIdSchema,
    type: EnduranceActionTypeSchema,
    position: EnduranceActionPositionSchema,
    label: EnduranceActionLabelSchema,
    amount: EnduranceActionAmountSchema,
    count: EnduranceActionCountSchema,
    created_at: Schema.Date,
    updated_at: Schema.Date,
});
