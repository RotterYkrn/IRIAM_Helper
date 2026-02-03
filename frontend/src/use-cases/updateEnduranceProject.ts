import { Schema, Either } from "effect";

import {
    type UpdateEnduranceProjectArgsEncoded,
    UpdateEnduranceProjectArgsSchema,
} from "@/domain/endurances/rpcs/UpdateEnduranceProject";
import { supabase } from "@/lib/supabase";

export const updateEnduranceProject = async (
    args: UpdateEnduranceProjectArgsEncoded,
) => {
    const decoded = Schema.decodeEither(UpdateEnduranceProjectArgsSchema)(args);

    if (Either.isLeft(decoded)) {
        throw decoded.left;
    }

    const { error } = await supabase.rpc(
        "update_endurance_project",
        Schema.encodeSync(UpdateEnduranceProjectArgsSchema)(decoded.right),
    );

    if (error) {
        throw error;
    }

    return decoded.right;
};
