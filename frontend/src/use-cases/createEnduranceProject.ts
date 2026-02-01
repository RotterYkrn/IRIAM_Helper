import { Either, Schema } from "effect";

import {
    CreateEnduranceProjectArgsSchema,
    type CreateEnduranceProjectArgsEncoded,
} from "@/domain/endurances/rpc";
import { supabase } from "@/lib/supabase";

export const createEnduranceProject = async (
    args: CreateEnduranceProjectArgsEncoded,
) => {
    const decoded = Schema.decodeEither(CreateEnduranceProjectArgsSchema)(args);

    if (Either.isLeft(decoded)) {
        throw decoded.left;
    }

    const { data, error } = await supabase.rpc(
        "create_endurance_project",
        Schema.encodeSync(CreateEnduranceProjectArgsSchema)(decoded.right),
    );

    if (error) {
        throw error;
    }

    return data as string;
};
