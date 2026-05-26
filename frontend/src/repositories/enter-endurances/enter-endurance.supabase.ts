import { Layer, Schema } from "effect";

import { EnterEnduranceRepository } from "./enter-endurance.repository";

import { EnterProjectDtoSchema } from "@/domain/enter_endurances/dto/EnterProjectDto";
import { EnterUnitDtoSchema } from "@/domain/enter_endurances/dto/EnterUnitDto";
import {
    ActivateEnterUnitArgsSchema,
    ActivateEnterUnitReturnsSchema,
} from "@/domain/enter_endurances/rpcs/ActivateEnterUnit";
import {
    ArchiveEnterLogsArgsSchema,
    ArchiveEnterLogsReturnsSchema,
} from "@/domain/enter_endurances/rpcs/ArchiveEnterLogs";
import {
    ArchiveEnterUnitArgsSchema,
    ArchiveEnterUnitReturnsSchema,
} from "@/domain/enter_endurances/rpcs/ArchiveEnterUnit";
import { CreateEnterEnduranceReturnsSchema } from "@/domain/enter_endurances/rpcs/CreateEnterEndurance";
import {
    CreateEnterUnitArgsSchema,
    CreateEnterUnitReturnsSchema,
} from "@/domain/enter_endurances/rpcs/CreateEnterUnit";
import {
    FinishEnterUnitArgsSchema,
    FinishEnterUnitReturnsSchema,
} from "@/domain/enter_endurances/rpcs/FinishEnterUnit";
import {
    LogEnterArgsSchema,
    LogEnterReturnsSchema,
} from "@/domain/enter_endurances/rpcs/LogEnter";
import { supabase } from "@/lib/supabase";
import { queryAndDecode } from "@/utils/api";

export const EnterEnduranceSupabase = Layer.succeed(
    EnterEnduranceRepository,
    EnterEnduranceRepository.of({
        // isExistProject: () =>
        //     pipe(
        //         queryAndDecode(
        //             () =>
        //                 supabase
        //                     .from("projects")
        //                     .select("id")
        //                     .eq("type", "enter-endurance")
        //                     .maybeSingle(),
        //             Schema.Struct({ id: ProjectIdSchema }),
        //         ),
        //         Effect.map((data) =>
        //             data ? Option.some(data.id) : Option.none(),
        //         ),
        //     ),
        getProjectById: (projectId) =>
            queryAndDecode(
                () =>
                    supabase
                        .from("projects")
                        .select(
                            `
                                id,
                                title,
                                units:enter_units(
                                    id,
                                    status,
                                    event_date,
                                    enter_count,
                                    started_at,
                                    completed_at
                                )
                            `,
                        )
                        .eq("id", projectId)
                        .eq("type", "enter-endurance")
                        .order("event_date", {
                            referencedTable: "enter_units",
                            ascending: true,
                        })
                        .single(),
                EnterProjectDtoSchema,
            ),
        createProject: () =>
            queryAndDecode(
                () => supabase.rpc("create_enter_endurance_project"),
                CreateEnterEnduranceReturnsSchema,
            ),
        getUnitById: (unitId) =>
            queryAndDecode(
                () =>
                    supabase
                        .from("enter_units")
                        .select(
                            `
                                id,
                                status,
                                event_date,
                                enter_count,
                                started_at,
                                completed_at,
                                logs:enter_logs(
                                    user_number,
                                    user_name,
                                    entered_at
                                )
                            `,
                        )
                        .eq("id", unitId)
                        .order("user_number", {
                            referencedTable: "enter_logs",
                            ascending: true,
                        })
                        .single(),
                EnterUnitDtoSchema,
            ),
        createUnit: (args) =>
            queryAndDecode(
                () =>
                    supabase.rpc(
                        "create_enter_unit",
                        Schema.encodeSync(CreateEnterUnitArgsSchema)(args),
                    ),
                CreateEnterUnitReturnsSchema,
            ),
        activateUnit: (args) =>
            queryAndDecode(
                () =>
                    supabase.rpc(
                        "activate_enter_unit",
                        Schema.encodeSync(ActivateEnterUnitArgsSchema)(args),
                    ),
                ActivateEnterUnitReturnsSchema,
            ),
        archiveUnit: (args) =>
            queryAndDecode(
                () =>
                    supabase.rpc(
                        "archive_enter_unit",
                        Schema.encodeSync(ArchiveEnterUnitArgsSchema)(args),
                    ),
                ArchiveEnterUnitReturnsSchema,
            ),
        archiveLogs: (args) =>
            queryAndDecode(
                () =>
                    supabase.rpc(
                        "archive_enter_logs",
                        // 要求される型に readonly がついておらず渡すことができないため、
                        // encodeSync を通したうえで any を使っています。
                        Schema.encodeSync(ArchiveEnterLogsArgsSchema)(
                            args,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ) as any,
                    ),
                ArchiveEnterLogsReturnsSchema,
            ),
        finishUnit: (args) =>
            queryAndDecode(
                () =>
                    supabase.rpc(
                        "finish_enter_unit",
                        Schema.encodeSync(FinishEnterUnitArgsSchema)(args),
                    ),
                FinishEnterUnitReturnsSchema,
            ),
        logEnter: (args) =>
            queryAndDecode(
                () =>
                    supabase.rpc(
                        "log_enter",
                        Schema.encodeSync(LogEnterArgsSchema)(args),
                    ),
                LogEnterReturnsSchema,
            ),
    }),
);
