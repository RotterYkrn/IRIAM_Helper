import { Effect, Context } from "effect";

import type { MultiEnduranceProjectDto } from "@/domain/multi-endurances/dto/MultiEnduranceProjectDto";
import type {
    CreateMultiEnduranceProjectArgs,
    CreateMultiEnduranceProjectReturns,
} from "@/domain/multi-endurances/rpcs/CreateMultiEnduranceProject";
import type {
    DuplicateMultiEnduranceProjectArgs,
    DuplicateMultiEnduranceProjectReturns,
} from "@/domain/multi-endurances/rpcs/DuplicateMultiEnduranceProject";
import type {
    LogMultiEnduranceActionHistoryArgs,
    LogMultiEnduranceActionHistoryReturns,
} from "@/domain/multi-endurances/rpcs/LogMultiEnduranceActionHistory";
import type {
    UpdateMultiEnduranceProjectArgs,
    UpdateMultiEnduranceProjectReturns,
} from "@/domain/multi-endurances/rpcs/UpdateMultiEnduranceProject";
import type { ProjectId } from "@/domain/projects/tables/Project";

export interface MultiEnduranceRepository {
    readonly getById: (
        projectId: ProjectId,
    ) => Effect.Effect<MultiEnduranceProjectDto, Error>;
    readonly create: (
        args: CreateMultiEnduranceProjectArgs,
    ) => Effect.Effect<CreateMultiEnduranceProjectReturns, Error>;
    readonly update: (
        args: UpdateMultiEnduranceProjectArgs,
    ) => Effect.Effect<UpdateMultiEnduranceProjectReturns, Error>;
    readonly duplicate: (
        args: DuplicateMultiEnduranceProjectArgs,
    ) => Effect.Effect<DuplicateMultiEnduranceProjectReturns, Error>;
    readonly logActionHistory: (
        args: LogMultiEnduranceActionHistoryArgs,
    ) => Effect.Effect<LogMultiEnduranceActionHistoryReturns, Error>;
}

export const MultiEnduranceRepository =
    Context.GenericTag<MultiEnduranceRepository>(
        "@repository/MultiEnduranceRepository",
    );
