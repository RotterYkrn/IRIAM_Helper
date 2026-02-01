import { Schema, Either } from "effect";

import {
    FinishProjectArgsSchema,
    type FinishProjectArgsEncoded,
} from "@/domain/projects/rpc";
import { supabase } from "@/lib/supabase";

export const finishProject = async (args: FinishProjectArgsEncoded) => {
    const decoded = Schema.decodeEither(FinishProjectArgsSchema)(args);

    if (Either.isLeft(decoded)) {
        throw decoded.left;
    }

    const { error } = await supabase.rpc(
        "finish_project",
        Schema.encodeSync(FinishProjectArgsSchema)(decoded.right),
    );

    if (error) throw error;

    return decoded.right.id;
};
