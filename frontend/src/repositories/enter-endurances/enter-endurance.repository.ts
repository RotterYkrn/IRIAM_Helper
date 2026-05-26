import { Effect, Context, Option } from "effect";

import type { EnterProjectDto } from "@/domain/enter_endurances/dto/EnterProjectDto";
import type { EnterUnitDto } from "@/domain/enter_endurances/dto/EnterUnitDto";
import type {
    ActivateEnterUnitArgs,
    ActivateEnterUnitReturns,
} from "@/domain/enter_endurances/rpcs/ActivateEnterUnit";
import type {
    ArchiveEnterLogsArgs,
    ArchiveEnterLogsReturns,
} from "@/domain/enter_endurances/rpcs/ArchiveEnterLogs";
import type {
    ArchiveEnterUnitArgs,
    ArchiveEnterUnitReturns,
} from "@/domain/enter_endurances/rpcs/ArchiveEnterUnit";
import type { CreateEnterEnduranceReturns } from "@/domain/enter_endurances/rpcs/CreateEnterEndurance";
import type {
    CreateEnterUnitArgs,
    CreateEnterUnitReturns,
} from "@/domain/enter_endurances/rpcs/CreateEnterUnit";
import type {
    FinishEnterUnitArgs,
    FinishEnterUnitReturns,
} from "@/domain/enter_endurances/rpcs/FinishEnterUnit";
import type {
    LogEnterArgs,
    LogEnterReturns,
} from "@/domain/enter_endurances/rpcs/LogEnter";
import { EnterUnitIdSchema } from "@/domain/enter_endurances/tables/EnterUnit";
import type { ProjectId } from "@/domain/projects/tables/Project";

export interface EnterEnduranceRepository {
    readonly isExistProject: () => Effect.Effect<
        Option.Option<ProjectId>,
        Error
    >;
    readonly getProjectById: (
        projectId: ProjectId,
    ) => Effect.Effect<EnterProjectDto, Error>;
    readonly createProject: () => Effect.Effect<
        CreateEnterEnduranceReturns,
        Error
    >;
    readonly getUnitById: (
        unitId: typeof EnterUnitIdSchema.Type,
    ) => Effect.Effect<EnterUnitDto, Error>;
    readonly createUnit: (
        args: CreateEnterUnitArgs,
    ) => Effect.Effect<CreateEnterUnitReturns, Error>;
    readonly activateUnit: (
        args: ActivateEnterUnitArgs,
    ) => Effect.Effect<ActivateEnterUnitReturns, Error>;
    readonly archiveUnit: (
        args: ArchiveEnterUnitArgs,
    ) => Effect.Effect<ArchiveEnterUnitReturns, Error>;
    readonly archiveLogs: (
        args: ArchiveEnterLogsArgs,
    ) => Effect.Effect<ArchiveEnterLogsReturns, Error>;
    readonly finishUnit: (
        args: FinishEnterUnitArgs,
    ) => Effect.Effect<FinishEnterUnitReturns, Error>;
    readonly logEnter: (
        args: LogEnterArgs,
    ) => Effect.Effect<LogEnterReturns, Error>;
}

export const EnterEnduranceRepository =
    Context.GenericTag<EnterEnduranceRepository>(
        "@repository/EnterEnduranceRepository",
    );
