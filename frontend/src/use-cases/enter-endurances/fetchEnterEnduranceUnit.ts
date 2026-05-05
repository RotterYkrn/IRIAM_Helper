import { pipe, Effect, Schema } from "effect";

import { EnterUnitDtoSchema } from "@/domain/enter_endurances/dto/EnterUnitDto";
import type { EnterUnitSchema } from "@/domain/enter_endurances/tables/EnterUnit";
import { supabase } from "@/lib/supabase";

export const fetchEnterEnduranceUnit = (
    unitId: typeof EnterUnitSchema.Type.id,
) =>
    pipe(
        Effect.tryPromise({
            try: () =>
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
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(Schema.decodeEither(EnterUnitDtoSchema)),
    );
