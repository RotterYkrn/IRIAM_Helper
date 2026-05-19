import { Option, Schema } from "effect";

import {
    EnduranceActionHistoryActionCountSchema,
    EnduranceActionHistoryTypeSchema,
    type EnduranceActionHistoriesSchema,
} from "../tables/EnduranceActionHistories";
import { EnduranceActionIdSchema } from "../tables/EnduranceActions";
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

export type LogEnduranceActionHistoryArgsEncoded = Readonly<
    Database["public"]["Functions"]["log_endurance_action_history_new"]["Args"]
>;

/**
 * アクション履歴に設定するアクションID\
 * アクションタイプによって null が許容される
 *
 * 制約実装:\
 * {@link LogEnduranceActionHistoryArgsSchemaNormal}\
 * {@link LogEnduranceActionHistoryArgsSchemaRescueSabotage}
 */
const LogEnduranceActionHistoryArgsActionIdSchema = Schema.optionalToRequired(
    EnduranceActionIdSchema,
    Schema.NullOr(EnduranceActionIdSchema),
    {
        decode: Option.getOrNull,
        encode: (idOrNull) => {
            if (idOrNull === null) {
                return Option.none();
            }
            return Option.some(EnduranceActionIdSchema.make(idOrNull));
        },
    },
);

/** {@link LogEnduranceActionHistoryArgsSchemaBase} */
type LogEnduranceActionHistoryArgsBase = Readonly<{
    project_id: typeof ProjectSchema.Type.id;
    unit_id: typeof EnduranceUnitsSchema.Type.id;
    action_id: typeof EnduranceActionHistoriesSchema.Type.action_id | null;
    action_history_type: typeof EnduranceActionHistoriesSchema.Type.action_type;
    action_count: typeof EnduranceActionHistoriesSchema.Type.action_count;
}>;

/**
 * log_endurance_action_history_new RPC の引数\
 * オブジェクト型定義のみ
 */
const LogEnduranceActionHistoryArgsSchemaBase: Schema.Schema<
    LogEnduranceActionHistoryArgsBase,
    LogEnduranceActionHistoryArgsEncoded
> = Schema.Struct({
    project_id: ProjectIdSchema.pipe(mapFrom("p_project_id")),
    unit_id: EnduranceUnitIdSchema.pipe(mapFrom("p_unit_id")),
    action_id: LogEnduranceActionHistoryArgsActionIdSchema.pipe(
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
const LogEnduranceActionHistoryArgsSchemaNormal =
    LogEnduranceActionHistoryArgsSchemaBase.pipe(
        Schema.filter(
            (
                a,
            ): a is LogEnduranceActionHistoryArgsBase & {
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
const LogEnduranceActionHistoryArgsSchemaRescueSabotage =
    LogEnduranceActionHistoryArgsSchemaBase.pipe(
        Schema.filter(
            (
                a,
            ): a is LogEnduranceActionHistoryArgsBase & {
                action_id: Exclude<
                    typeof EnduranceActionHistoriesSchema.Type.action_id,
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

/** {@link LogEnduranceActionHistoryArgsSchema} */
export type LogEnduranceActionHistoryArgs =
    | typeof LogEnduranceActionHistoryArgsSchemaNormal.Type
    | typeof LogEnduranceActionHistoryArgsSchemaRescueSabotage.Type;

/**
 * log_endurance_action_history_new RPC の引数\
 * `action_type` の値による制約追加
 *
 * 制約定義:\
 * {@link LogEnduranceActionHistoryArgsSchemaNormal}\
 * {@link LogEnduranceActionHistoryArgsSchemaRescueSabotage}
 */
export const LogEnduranceActionHistoryArgsSchema: Schema.Schema<
    LogEnduranceActionHistoryArgs,
    LogEnduranceActionHistoryArgsEncoded
> = Schema.Union(
    LogEnduranceActionHistoryArgsSchemaNormal,
    LogEnduranceActionHistoryArgsSchemaRescueSabotage,
);

export type LogEnduranceActionHistoryReturnsEncoded = Readonly<
    Database["public"]["Functions"]["log_endurance_action_history_new"]["Returns"]
>;

export type LogEnduranceActionHistoryReturns = typeof ProjectSchema.Type.id;

export const LogEnduranceActionHistoryReturnsSchema: Schema.Schema<
    LogEnduranceActionHistoryReturns,
    LogEnduranceActionHistoryReturnsEncoded
> = ProjectIdSchema;
