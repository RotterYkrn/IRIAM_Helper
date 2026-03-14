import { pipe, Schema } from "effect";

import { EnduranceActionCountsSchema } from "../tables/EnduranceActionCounts";
import {
    EnduranceActionIdSchema,
    EnduranceActionTypeSchema,
    EnduranceActionPositionSchema,
    EnduranceActionLabelSchema,
    EnduranceActionAmountSchema,
    EnduranceActionCountSchema,
} from "../tables/EnduranceActionsNew";
import { EnduranceUnitsSchema } from "../tables/EnduranceUnits";

import { ProjectDtoSchema } from "@/domain/projects/dto/ProjectDto";
import { transformSchemaArrayToOne } from "@/utils/schema";

/**
 * 救済・妨害アクションの情報
 */
export const EnduranceActionDtoSchema = Schema.Struct({
    id: EnduranceActionIdSchema,
    type: EnduranceActionTypeSchema,
    position: EnduranceActionPositionSchema,
    label: EnduranceActionLabelSchema,
    amount: EnduranceActionAmountSchema,
    count: EnduranceActionCountSchema,
});

export const EnduranceRescueActionDtoSchema = EnduranceActionDtoSchema.pipe(
    Schema.filter(
        (a): a is typeof EnduranceActionDtoSchema.Type & { type: "rescue" } =>
            a.type === "rescue",
    ),
);

export const EnduranceSabotageActionDtoSchema = EnduranceActionDtoSchema.pipe(
    Schema.filter(
        (
            a,
        ): a is typeof EnduranceActionDtoSchema.Type & {
            type: "sabotage";
        } => a.type === "sabotage",
    ),
);

/**
 * endurance_project_view_new ビュー
 * 耐久企画の情報（救済・妨害アクションを除く）
 */
export const EnduranceProjectDtoSchema = pipe(
    ProjectDtoSchema,
    Schema.extend(
        Schema.Struct({
            unit: pipe(
                EnduranceUnitsSchema,
                Schema.pick("id", "target_count", "current_count"),
                transformSchemaArrayToOne,
            ),
            action_count: pipe(
                EnduranceActionCountsSchema,
                Schema.pick("normal_count", "rescue_count", "sabotage_count"),
                transformSchemaArrayToOne,
            ),
            rescue_actions: Schema.Chunk(EnduranceRescueActionDtoSchema),
            sabotage_actions: Schema.Chunk(EnduranceSabotageActionDtoSchema),
        }),
    ),
);

export type EnduranceProjectDto = typeof EnduranceProjectDtoSchema.Type;
export type EnduranceProjectDtoEncoded =
    typeof EnduranceProjectDtoSchema.Encoded;
