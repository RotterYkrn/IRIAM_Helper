import { pipe, Schema } from "effect";

import { EnduranceUnitsSchema } from "@/domain/endurances-new/tables/EnduranceUnits";
import { ProjectDtoSchema } from "@/domain/projects/dto/ProjectDto";

export const MultiEnduranceProjectDtoSchema = pipe(
    ProjectDtoSchema,
    Schema.extend(
        Schema.Struct({
            units: pipe(
                EnduranceUnitsSchema,
                Schema.pick(
                    "id",
                    "position",
                    "label",
                    "target_count",
                    "current_count",
                ),
                Schema.Chunk,
            ),
        }),
    ),
);

export type MultiEnduranceProjectDto =
    typeof MultiEnduranceProjectDtoSchema.Type;
export type MultiEnduranceProjectDtoEncoded =
    typeof MultiEnduranceProjectDtoSchema.Encoded;
