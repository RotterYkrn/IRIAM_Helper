import { Either, Schema } from "effect";

import {
    EnduranceProjectViewSchema,
    type EnduranceProjectView,
} from "@/domain/endurances/EnduranceProjectView";
import {
    ProjectIdSchema,
    type ProjectIdEncoded,
} from "@/domain/projects/Project";
import { supabase } from "@/lib/supabase";

export const fetchEnduranceProject = async (
    projectId: ProjectIdEncoded,
): Promise<EnduranceProjectView> => {
    const decodedId = Schema.decodeEither(ProjectIdSchema)(projectId);

    if (Either.isLeft(decodedId)) {
        throw decodedId.left;
    }

    const { data, error } = await supabase
        .from("endurance_project_view")
        .select("*")
        .eq("id", decodedId.right)
        .single();

    if (error) throw error;

    const decoded = Schema.decodeEither(EnduranceProjectViewSchema)(data);

    if (Either.isLeft(decoded)) {
        throw decoded.left;
    }

    return decoded.right;
};
