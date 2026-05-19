import { Chunk, pipe, Schema } from "effect";

import {
    EnduranceActionCountsSchema,
    EnduranceNormalCountSchema,
    EnduranceRescueCountSchema,
    EnduranceSabotageCountSchema,
} from "../tables/EnduranceActionCounts";
import {
    EnduranceActionIdSchema,
    EnduranceActionTypeSchema,
    EnduranceActionPositionSchema,
    EnduranceActionLabelSchema,
    EnduranceActionAmountSchema,
    EnduranceActionCountSchema,
} from "../tables/EnduranceActions";
import {
    EnduranceCurrentCountSchema,
    EnduranceTargetCountSchema,
    EnduranceUnitIdSchema,
    EnduranceUnitsSchema,
} from "../tables/EnduranceUnits";

import { ProjectDtoSchema } from "@/domain/projects/dto/ProjectDto";
import type { ProjectSchema } from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";
import { withStrictNullCheck, type RecursiveReadonly } from "@/utils/schema";

export const EnduranceUnitDtoSchema = Schema.Struct({
    id: withStrictNullCheck(EnduranceUnitIdSchema),
    target_count: withStrictNullCheck(EnduranceTargetCountSchema),
    current_count: withStrictNullCheck(EnduranceCurrentCountSchema),
});

export const EnduranceActionCountDtoSchema = Schema.Struct({
    normal_count: withStrictNullCheck(EnduranceNormalCountSchema),
    rescue_count: withStrictNullCheck(EnduranceRescueCountSchema),
    sabotage_count: withStrictNullCheck(EnduranceSabotageCountSchema),
});

/**
 * 救済・妨害アクションの情報
 */
export const EnduranceActionDtoSchema = Schema.Struct({
    id: withStrictNullCheck(EnduranceActionIdSchema),
    type: withStrictNullCheck(EnduranceActionTypeSchema),
    position: withStrictNullCheck(EnduranceActionPositionSchema),
    label: withStrictNullCheck(EnduranceActionLabelSchema),
    amount: withStrictNullCheck(EnduranceActionAmountSchema),
    count: withStrictNullCheck(EnduranceActionCountSchema),
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

export type EnduranceProjectDtoEncoded = RecursiveReadonly<
    Database["public"]["Views"]["endurance_project_dto"]["Row"]
>;
export type EnduranceProjectDto = Readonly<{
    id: typeof ProjectSchema.Type.id;
    type: typeof ProjectSchema.Type.type;
    title: typeof ProjectSchema.Type.title;
    status: typeof ProjectSchema.Type.status;
    unit: Readonly<{
        id: typeof EnduranceUnitsSchema.Type.id;
        target_count: typeof EnduranceUnitsSchema.Type.target_count;
        current_count: typeof EnduranceUnitsSchema.Type.current_count;
    }>;
    action_count: Readonly<{
        normal_count: typeof EnduranceActionCountsSchema.Type.normal_count;
        rescue_count: typeof EnduranceActionCountsSchema.Type.rescue_count;
        sabotage_count: typeof EnduranceActionCountsSchema.Type.sabotage_count;
    }>;
    rescue_actions: Chunk.Chunk<
        Readonly<{
            id: typeof EnduranceActionIdSchema.Type;
            type: "rescue";
            position: typeof EnduranceActionPositionSchema.Type;
            label: typeof EnduranceActionLabelSchema.Type;
            amount: typeof EnduranceActionAmountSchema.Type;
            count: typeof EnduranceActionCountSchema.Type;
        }>
    >;
    sabotage_actions: Chunk.Chunk<
        Readonly<{
            id: typeof EnduranceActionIdSchema.Type;
            type: "sabotage";
            position: typeof EnduranceActionPositionSchema.Type;
            label: typeof EnduranceActionLabelSchema.Type;
            amount: typeof EnduranceActionAmountSchema.Type;
            count: typeof EnduranceActionCountSchema.Type;
        }>
    >;
}>;

/**
 * endurance_project_view_new ビュー
 * 耐久企画の情報（救済・妨害アクションを除く）
 */
export const EnduranceProjectDtoSchema: Schema.Schema<
    EnduranceProjectDto,
    EnduranceProjectDtoEncoded
> = pipe(
    ProjectDtoSchema,
    Schema.extend(
        Schema.Struct({
            unit: withStrictNullCheck(EnduranceUnitDtoSchema),
            action_count: withStrictNullCheck(EnduranceActionCountDtoSchema),
            rescue_actions: withStrictNullCheck(
                Schema.Chunk(EnduranceRescueActionDtoSchema),
            ),
            sabotage_actions: withStrictNullCheck(
                Schema.Chunk(EnduranceSabotageActionDtoSchema),
            ),
        }),
    ),
);
