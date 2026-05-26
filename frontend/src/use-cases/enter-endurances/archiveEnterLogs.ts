import { Effect } from "effect";

import { type ArchiveEnterLogsArgs } from "@/domain/enter_endurances/rpcs/ArchiveEnterLogs";
import { EnterEnduranceRepository } from "@/repositories/enter-endurances/enter-endurance.repository";

export const archiveEnterLogs = (args: ArchiveEnterLogsArgs) =>
    Effect.gen(function* () {
        const repository = yield* EnterEnduranceRepository;
        return yield* repository.archiveLogs(args);
    });
