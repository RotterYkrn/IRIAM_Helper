import { Schema } from "effect";

import { ProjectSchema } from "../tables/Project";

/**
 * 一覧表示用の企画情報
 */
export const ProjectDtoSchema = ProjectSchema.pipe(
    Schema.pick("id", "title", "type", "status"),
);
