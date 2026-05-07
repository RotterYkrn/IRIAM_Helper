import { Schema } from "effect";

import {
    ProjectIdSchema,
    type ProjectSchema,
} from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";

// export type CreateEnterEnduranceArgsEncoded = Readonly<
//     Database["public"]["Functions"]["create_enter_endurance_project"]["Args"]
// >;
// export type CreateEnterEnduranceArgs = Readonly<{
//     event_date: typeof EventDateSchema.Type;
// }>;
// export const CreateEnterEnduranceArgsSchema: Schema.Schema<
//     CreateEnterEnduranceArgs,
//     CreateEnterEnduranceArgsEncoded
// > = Schema.Struct({
//     event_date: EventDateSchema.pipe(mapFrom("p_event_date")),
// });

export type CreateEnterEnduranceReturnsEncoded = Readonly<
    Database["public"]["Functions"]["create_enter_endurance_project"]["Returns"]
>;
export type CreateEnterEnduranceReturns = typeof ProjectSchema.Type.id;
export const CreateEnterEnduranceReturnsSchema: Schema.Schema<
    CreateEnterEnduranceReturns,
    CreateEnterEnduranceReturnsEncoded
> = ProjectIdSchema;
