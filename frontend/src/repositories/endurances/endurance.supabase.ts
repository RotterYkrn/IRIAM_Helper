import { Layer, Schema } from "effect";

import { EnduranceRepository } from "./endurance.repository";

import { EnduranceProjectDtoSchema } from "@/domain/endurances/dto/EnduranceProjectDto";
import {
    CreateEnduranceProjectArgsSchema,
    CreateEnduranceProjectReturnsSchema,
} from "@/domain/endurances/rpcs/CreateEnduranceProject";
import {
    DuplicateEnduranceProjectArgsSchema,
    DuplicateEnduranceProjectReturnsSchema,
} from "@/domain/endurances/rpcs/DuplicateEnduranceProject";
import {
    LogEnduranceActionHistoryArgsSchema,
    LogEnduranceActionHistoryReturnsSchema,
} from "@/domain/endurances/rpcs/LogEnduranceActionHistory";
import {
    UpdateEnduranceProjectArgsSchema,
    UpdateEnduranceProjectReturnsSchema,
} from "@/domain/endurances/rpcs/UpdateEnduranceProject";
import { supabase } from "@/lib/supabase";
import { queryAndDecode } from "@/utils/api";

export const EnduranceSupabase = Layer.succeed(
    EnduranceRepository,
    EnduranceRepository.of({
        getById: (projectId) =>
            queryAndDecode(
                () =>
                    supabase
                        .from("endurance_project_dto")
                        .select("*")
                        .eq("id", projectId)
                        .eq("type", "endurance")
                        .single(),
                EnduranceProjectDtoSchema,
            ),
        create: (args) =>
            queryAndDecode(
                () =>
                    supabase.rpc(
                        "create_endurance_project_new",
                        // 要求される型に readonly がついておらず渡すことができないため、
                        // encodeSync を通したうえで any を使っています。
                        Schema.encodeSync(CreateEnduranceProjectArgsSchema)(
                            args,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ) as any,
                    ),
                CreateEnduranceProjectReturnsSchema,
            ),
        update: (args) =>
            queryAndDecode(
                () =>
                    supabase.rpc(
                        "update_endurance_project_new",
                        // 要求される型に readonly がついておらず渡すことができないため、
                        // encodeSync を通したうえで any を使っています。
                        Schema.encodeSync(UpdateEnduranceProjectArgsSchema)(
                            args,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ) as any,
                    ),
                UpdateEnduranceProjectReturnsSchema,
            ),
        duplicate: (args) =>
            queryAndDecode(
                () =>
                    supabase.rpc(
                        "duplicate_endurance_project",
                        Schema.encodeSync(DuplicateEnduranceProjectArgsSchema)(
                            args,
                        ),
                    ),
                DuplicateEnduranceProjectReturnsSchema,
            ),
        logActionHistory: (args) =>
            queryAndDecode(
                () =>
                    supabase.rpc(
                        "log_endurance_action_history_new",
                        Schema.encodeSync(LogEnduranceActionHistoryArgsSchema)(
                            args,
                        ),
                    ),
                LogEnduranceActionHistoryReturnsSchema,
            ),
    }),
);
