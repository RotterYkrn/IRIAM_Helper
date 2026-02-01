import { Schema, Either } from "effect";

import {
    type IncrementEnduranceCountArgsEncoded,
    IncrementEnduranceCountArgsSchema,
} from "@/domain/endurances/rpc";
import { supabase } from "@/lib/supabase";

export const incrementEnduranceCount = async (
    args: IncrementEnduranceCountArgsEncoded,
) => {
    const decoded = Schema.decodeEither(IncrementEnduranceCountArgsSchema)(
        args,
    );

    if (Either.isLeft(decoded)) {
        throw decoded.left;
    }

    const { error } = await supabase.rpc(
        "increment_endurance_count",
        Schema.encodeSync(IncrementEnduranceCountArgsSchema)(decoded.right),
    );

    if (error) {
        throw error;
    }

    return decoded.right.id;
};
