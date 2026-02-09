import { Option, Schema } from "effect";

import {
    EnduranceActionHistoriesSchema,
    EnduranceActionHistoryTypeSchema,
} from "../tables/EnduranceActionHistories";
import { EnduranceActionIdSchema } from "../tables/EnduranceActions";

import {
    ProjectIdSchema,
    ProjectSchema,
} from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";
import { mapFrom } from "@/utils/schema";

export type LogEnduranceActionHistoryArgsEncoded = Readonly<
    Database["public"]["Functions"]["log_endurance_action_history"]["Args"]
>;

const LogEnduranceActionHistoryArgsActionIdSchema = Schema.optionalToRequired(
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

type LogEnduranceActionHistoryArgsBase = Readonly<{
    project_id: typeof ProjectSchema.Type.id;
    action_id: typeof EnduranceActionHistoriesSchema.Type.action_id | null;
    action_history_type: typeof EnduranceActionHistoriesSchema.Type.action_type;
}>;

const LogEnduranceActionHistoryArgsSchemaBase: Schema.Schema<
    LogEnduranceActionHistoryArgsBase,
    LogEnduranceActionHistoryArgsEncoded
> = Schema.Struct({
    project_id: ProjectIdSchema.pipe(mapFrom("p_project_id")),
    action_id: LogEnduranceActionHistoryArgsActionIdSchema.pipe(
        Schema.fromKey("p_action_id"),
    ),
    action_history_type: EnduranceActionHistoryTypeSchema.pipe(
        mapFrom("p_action_history_type"),
    ),
});

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

export type LogEnduranceActionHistoryArgs =
    | typeof LogEnduranceActionHistoryArgsSchemaNormal.Type
    | typeof LogEnduranceActionHistoryArgsSchemaRescueSabotage.Type;

export const LogEnduranceActionHistoryArgsSchema: Schema.Schema<
    LogEnduranceActionHistoryArgs,
    LogEnduranceActionHistoryArgsEncoded
> = Schema.Union(
    LogEnduranceActionHistoryArgsSchemaNormal,
    LogEnduranceActionHistoryArgsSchemaRescueSabotage,
);
