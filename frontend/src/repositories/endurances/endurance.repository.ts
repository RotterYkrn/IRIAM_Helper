import { Effect, Context } from "effect";

import type { EnduranceProjectDto } from "@/domain/endurances/dto/EnduranceProjectDto";
import type {
    CreateEnduranceProjectArgs,
    CreateEnduranceProjectReturns,
} from "@/domain/endurances/rpcs/CreateEnduranceProject";
import type {
    DuplicateEnduranceProjectArgs,
    DuplicateEnduranceProjectReturns,
} from "@/domain/endurances/rpcs/DuplicateEnduranceProject";
import type { LogEnduranceActionHistoryArgs } from "@/domain/endurances/rpcs/LogEnduranceActionHistory";
import type {
    UpdateEnduranceProjectArgs,
    UpdateEnduranceProjectReturns,
} from "@/domain/endurances/rpcs/UpdateEnduranceProject";
import type { ProjectId } from "@/domain/projects/tables/Project";

export interface EnduranceRepository {
    readonly getById: (
        projectId: ProjectId,
    ) => Effect.Effect<EnduranceProjectDto, Error>;
    readonly create: (
        args: CreateEnduranceProjectArgs,
    ) => Effect.Effect<CreateEnduranceProjectReturns, Error>;
    readonly update: (
        args: UpdateEnduranceProjectArgs,
    ) => Effect.Effect<UpdateEnduranceProjectReturns, Error>;
    readonly duplicate: (
        args: DuplicateEnduranceProjectArgs,
    ) => Effect.Effect<DuplicateEnduranceProjectReturns, Error>;
    readonly logActionHistory: (
        args: LogEnduranceActionHistoryArgs,
    ) => Effect.Effect<ProjectId, Error>;
}

export const EnduranceRepository = Context.GenericTag<EnduranceRepository>(
    "@repository/EnduranceRepository",
);
