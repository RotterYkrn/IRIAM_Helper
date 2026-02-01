import { Either, Schema } from "effect";

import {
    DeleteProjectArgsSchema,
    type DeleteProjectArgsEncoded,
} from "@/domain/projects/rpc";
import { supabase } from "@/lib/supabase";

export const deleteProject = async (args: DeleteProjectArgsEncoded) => {
    const decoded = Schema.decodeEither(DeleteProjectArgsSchema)(args);

    if (Either.isLeft(decoded)) {
        throw decoded.left;
    }

    const { error } = await supabase.rpc(
        "delete_project",
        Schema.encodeSync(DeleteProjectArgsSchema)(decoded.right),
    );

    if (error) {
        throw error;
    }
};
