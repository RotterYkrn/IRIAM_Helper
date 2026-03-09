import { pipe, Schema } from "effect";

import { EnduranceActionCountsSchema } from "../tables/EnduranceActionCounts";
import { EnduranceUnitsSchema } from "../tables/EnduranceUnits";

import { ProjectDtoSchema } from "@/domain/projects/dto/ProjectDto";
import { transformSchemaArrayToOne } from "@/utils/schema";

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
        }),
    ),
);

export type EnduranceProjectDto = typeof EnduranceProjectDtoSchema.Type;
export type EnduranceProjectDtoEncoded =
    typeof EnduranceProjectDtoSchema.Encoded;
