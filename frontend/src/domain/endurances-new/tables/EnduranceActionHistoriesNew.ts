import { Schema } from "effect";

import {
    EnduranceActionIdSchema,
    EnduranceActionAmountSchema,
    EnduranceActionsNewSchema,
} from "./EnduranceActionsNew";
import {
    EnduranceUnitIdSchema,
    type EnduranceUnitsSchema,
} from "./EnduranceUnits";

import {
    ProjectIdSchema,
    type ProjectSchema,
} from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";

/** {@link EnduranceActionHistoriesNewSchema} */
export type EnduranceActionHistoriesNewEncoded = Readonly<
    Database["public"]["Tables"]["endurance_action_histories_new"]["Row"]
>;

export const EnduranceActionHistoryIdSchema = Schema.UUID.pipe(
    Schema.brand("EnduranceActionHistoryId"),
);

/** normal アクションの場合は null になる */
export const EnduranceActionHistoryActionIdSchema = Schema.NullOr(
    EnduranceActionIdSchema,
);

/**
 * 履歴に残すアクションタイプ\
 * 耐久対象のカウントもまとめて管理する
 *
 * `"normal"`: 耐久対象\
 * `"rescue"`: 救済\
 * `"sabotage"`: 妨害
 */
export const EnduranceActionHistoryTypeSchema = Schema.String.pipe(
    Schema.compose(Schema.Literal("normal", "rescue", "sabotage")),
    Schema.brand("EnduranceActionHistoryType"),
);

/** アクションを行った回数 */
export const EnduranceActionHistoryActionCountSchema = Schema.Int.pipe(
    Schema.brand("EnduranceActionHistoryActionCount"),
);

/** {@link EnduranceActionHistoriesNewSchema} */
export type EnduranceActionHistoriesNew = Readonly<{
    id: typeof EnduranceActionHistoryIdSchema.Type;

    project_id: typeof ProjectSchema.Type.id;

    unit_id: typeof EnduranceUnitsSchema.Type.id;

    /** {@link EnduranceActionHistoryActionIdSchema} */
    action_id: typeof EnduranceActionHistoryActionIdSchema.Type;

    /** {@link EnduranceActionHistoryTypeSchema} */
    action_type: typeof EnduranceActionHistoryTypeSchema.Type;

    action_amount: typeof EnduranceActionsNewSchema.Type.amount;

    /** {@link EnduranceActionHistoryActionCountSchema} */
    action_count: typeof EnduranceActionHistoryActionCountSchema.Type;

    created_at: Date;
}>;

/**
 * endurance_action_histories_newテーブルの型\
 * 各カウントの履歴
 */
export const EnduranceActionHistoriesNewSchema: Schema.Schema<
    EnduranceActionHistoriesNew,
    EnduranceActionHistoriesNewEncoded
> = Schema.Struct({
    id: EnduranceActionHistoryIdSchema,
    project_id: ProjectIdSchema,
    unit_id: EnduranceUnitIdSchema,
    action_id: EnduranceActionHistoryActionIdSchema,
    action_type: EnduranceActionHistoryTypeSchema,
    action_amount: EnduranceActionAmountSchema,
    action_count: EnduranceActionHistoryActionCountSchema,
    created_at: Schema.Date,
});
