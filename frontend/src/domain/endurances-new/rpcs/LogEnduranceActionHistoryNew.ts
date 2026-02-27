import { Option, Schema } from "effect";

import {
    EnduranceActionHistoryActionCountSchema,
    EnduranceActionHistoryTypeSchema,
    type EnduranceActionHistoriesNewSchema,
} from "../tables/EnduranceActionHistoriesNew";
import { EnduranceActionIdSchema } from "../tables/EnduranceActionsNew";
import {
    EnduranceUnitIdSchema,
    type EnduranceUnitsSchema,
} from "../tables/EnduranceUnits";

import {
    ProjectIdSchema,
    ProjectSchema,
} from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";
import { mapFrom } from "@/utils/schema";

export type LogEnduranceActionHistoryNewArgsEncoded = Readonly<
    Database["public"]["Functions"]["log_endurance_action_history_new"]["Args"]
>;

/**
 * アクション履歴に設定するアクションID\
 * アクションタイプによって null が許容される
 *
 * 制約実装:\
 * {@link LogEnduranceActionHistoryNewArgsSchemaNormal}\
 * {@link LogEnduranceActionHistoryNewArgsSchemaRescueSabotage}
 */
const LogEnduranceActionHistoryNewArgsActionIdSchema =
    Schema.optionalToRequired(
        EnduranceActionIdSchema,
        Schema.NullOr(EnduranceActionIdSchema),
        {
            decode: Option.getOrNull,
            encode: (idOrNull) => {
                if (idOrNull === null) {
                    return Option.none();
                }
                return Option.some(
                    Schema.decodeSync(EnduranceActionIdSchema)(idOrNull),
                );
            },
        },
    );

/** {@link LogEnduranceActionHistoryNewArgsSchemaBase} */
type LogEnduranceActionHistoryNewArgsBase = Readonly<{
    project_id: typeof ProjectSchema.Type.id;
    unit_id: typeof EnduranceUnitsSchema.Type.id;
    action_id: typeof EnduranceActionHistoriesNewSchema.Type.action_id | null;
    action_history_type: typeof EnduranceActionHistoriesNewSchema.Type.action_type;
    action_count: typeof EnduranceActionHistoriesNewSchema.Type.action_count;
}>;

/**
 * log_endurance_action_history_new RPC の引数\
 * オブジェクト型定義のみ
 */
const LogEnduranceActionHistoryNewArgsSchemaBase: Schema.Schema<
    LogEnduranceActionHistoryNewArgsBase,
    LogEnduranceActionHistoryNewArgsEncoded
> = Schema.Struct({
    project_id: ProjectIdSchema.pipe(mapFrom("p_project_id")),
    unit_id: EnduranceUnitIdSchema.pipe(mapFrom("p_unit_id")),
    action_id: LogEnduranceActionHistoryNewArgsActionIdSchema.pipe(
        Schema.fromKey("p_action_id"),
    ),
    action_history_type: EnduranceActionHistoryTypeSchema.pipe(
        mapFrom("p_action_history_type"),
    ),
    action_count: EnduranceActionHistoryActionCountSchema.pipe(
        mapFrom("p_action_count"),
    ),
});

/**
 * log_endurance_action_history_new RPC の引数\
 * `action_type = "normal"` 時の制約定義
 */
const LogEnduranceActionHistoryNewArgsSchemaNormal =
    LogEnduranceActionHistoryNewArgsSchemaBase.pipe(
        Schema.filter(
            (
                a,
            ): a is LogEnduranceActionHistoryNewArgsBase & {
                action_id: null;
                action_history_type: "normal";
            } => a.action_history_type === "normal" && a.action_id === null,
            {
                message: () =>
                    "For 'normal' action_history_type, action_id must be null",
                identifier: "NormalActionHistory",
            },
        ),
    );

/**
 * log_endurance_action_history_new RPC の引数\
 * `action_type = "rescue" | "sabotage"` 時の制約定義
 */
const LogEnduranceActionHistoryNewArgsSchemaRescueSabotage =
    LogEnduranceActionHistoryNewArgsSchemaBase.pipe(
        Schema.filter(
            (
                a,
            ): a is LogEnduranceActionHistoryNewArgsBase & {
                action_id: Exclude<
                    typeof EnduranceActionHistoriesNewSchema.Type.action_id,
                    null
                >;
                action_history_type: "rescue" | "sabotage";
            } =>
                (a.action_history_type === "rescue" ||
                    a.action_history_type === "sabotage") &&
                a.action_id !== null,
            {
                message: () =>
                    "For 'rescue' or 'sabotage' action_history_type, action_id must be defined",
                identifier: "RescueSabotageActionHistory",
            },
        ),
    );

/** {@link LogEnduranceActionHistoryNewArgsSchema} */
export type LogEnduranceActionHistoryNewArgs =
    | typeof LogEnduranceActionHistoryNewArgsSchemaNormal.Type
    | typeof LogEnduranceActionHistoryNewArgsSchemaRescueSabotage.Type;

/**
 * log_endurance_action_history_new RPC の引数\
 * `action_type` の値による制約追加
 *
 * 制約定義:\
 * {@link LogEnduranceActionHistoryNewArgsSchemaNormal}\
 * {@link LogEnduranceActionHistoryNewArgsSchemaRescueSabotage}
 */
export const LogEnduranceActionHistoryNewArgsSchema: Schema.Schema<
    LogEnduranceActionHistoryNewArgs,
    LogEnduranceActionHistoryNewArgsEncoded
> = Schema.Union(
    LogEnduranceActionHistoryNewArgsSchemaNormal,
    LogEnduranceActionHistoryNewArgsSchemaRescueSabotage,
);

export type LogEnduranceActionHistoryNewReturnsEncoded = Readonly<
    Database["public"]["Functions"]["log_endurance_action_history_new"]["Returns"]
>;

export type LogEnduranceActionHistoryNewReturns = typeof ProjectSchema.Type.id;

export const LogEnduranceActionHistoryNewReturnsSchema: Schema.Schema<
    LogEnduranceActionHistoryNewReturns,
    LogEnduranceActionHistoryNewReturnsEncoded
> = ProjectIdSchema;
