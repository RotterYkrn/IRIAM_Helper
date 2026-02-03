import { Schema, Either } from "effect";

import {
    type ActivateProjectArgsEncoded,
    ActivateProjectArgsSchema,
} from "@/domain/projects/rpcs/ActivateProject";
import { supabase } from "@/lib/supabase";

export const activateProject = async (args: ActivateProjectArgsEncoded) => {
    const decoded = Schema.decodeEither(ActivateProjectArgsSchema)(args);

    if (Either.isLeft(decoded)) {
        throw decoded.left;
    }

    const { error } = await supabase.rpc(
        "activate_project",
        Schema.encodeSync(ActivateProjectArgsSchema)(decoded.right),
    );

    if (error) throw error;

    return decoded.right.id;
};
