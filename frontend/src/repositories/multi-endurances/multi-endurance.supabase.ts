import { Layer, Schema } from "effect";

import { MultiEnduranceRepository } from "./multi-endurance.repository";

import { MultiEnduranceProjectDtoSchema } from "@/domain/multi-endurances/dto/MultiEnduranceProjectDto";
import {
    CreateMultiEnduranceProjectArgsSchema,
    CreateMultiEnduranceProjectReturnsSchema,
} from "@/domain/multi-endurances/rpcs/CreateMultiEnduranceProject";
import {
    DuplicateMultiEnduranceProjectArgsSchema,
    DuplicateMultiEnduranceProjectReturnsSchema,
} from "@/domain/multi-endurances/rpcs/DuplicateMultiEnduranceProject";
import {
    LogMultiEnduranceActionHistoryArgsSchema,
    LogMultiEnduranceActionHistoryReturnsSchema,
} from "@/domain/multi-endurances/rpcs/LogMultiEnduranceActionHistory";
import {
    UpdateMultiEnduranceProjectArgsSchema,
    UpdateMultiEnduranceProjectReturnsSchema,
} from "@/domain/multi-endurances/rpcs/UpdateMultiEnduranceProject";
import { supabase } from "@/lib/supabase";
import { queryAndDecode } from "@/utils/api";

export const MultiEnduranceSupabase = Layer.succeed(
    MultiEnduranceRepository,
    MultiEnduranceRepository.of({
        getById: (projectId) =>
            queryAndDecode(
                () =>
                    supabase
                        .from("multi_endurance_project_dto")
                        .select("*")
                        .eq("id", projectId)
                        .single(),
                MultiEnduranceProjectDtoSchema,
            ),
        create: (args) =>
            queryAndDecode(
                () =>
                    supabase.rpc(
                        "create_multi_endurance_project",
                        // 要求される型に readonly がついておらず渡すことができないため、
                        // encodeSync を通したうえで any を使っています。
                        Schema.encodeSync(
                            CreateMultiEnduranceProjectArgsSchema,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        )(args) as any,
                    ),
                CreateMultiEnduranceProjectReturnsSchema,
            ),
        update: (args) =>
            queryAndDecode(
                () =>
                    supabase.rpc(
                        "update_multi_endurance_project",
                        // 要求される型に readonly がついておらず渡すことができないため、
                        // encodeSync を通したうえで any を使っています。
                        Schema.encodeSync(
                            UpdateMultiEnduranceProjectArgsSchema,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        )(args) as any,
                    ),
                UpdateMultiEnduranceProjectReturnsSchema,
            ),
        duplicate: (args) =>
            queryAndDecode(
                () =>
                    supabase.rpc(
                        "duplicate_multi_endurance_project",
                        Schema.encodeSync(
                            DuplicateMultiEnduranceProjectArgsSchema,
                        )(args),
                    ),
                DuplicateMultiEnduranceProjectReturnsSchema,
            ),
        logActionHistory: (args) =>
            queryAndDecode(
                () =>
                    supabase.rpc(
                        "log_multi_endurance_action_history",
                        Schema.encodeSync(
                            LogMultiEnduranceActionHistoryArgsSchema,
                        )(args),
                    ),
                LogMultiEnduranceActionHistoryReturnsSchema,
            ),
    }),
);
