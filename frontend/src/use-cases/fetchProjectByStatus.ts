import { Chunk, Either, Schema } from "effect";

import {
    ProjectForSideBerSchema,
    type ProjectForSideBer,
} from "@/domain/projects/Project";
import { supabase } from "@/lib/supabase";

type Return = {
    scheduled: Chunk.Chunk<ProjectForSideBer>;
    active: Chunk.Chunk<ProjectForSideBer>;
    finished: Chunk.Chunk<ProjectForSideBer>;
};

export const fetchProjectsByStatus = async (): Promise<Return> => {
    const { data, error } = await supabase
        .from("projects")
        .select("id, title, type, status")
        .order("created_at", { ascending: false });

    if (error) {
        throw error;
    }

    const decoded = Schema.decodeEither(Schema.Chunk(ProjectForSideBerSchema))(
        data,
    );

    if (Either.isLeft(decoded)) {
        throw decoded.left;
    }

    return {
        scheduled:
            Chunk.filter(decoded.right, (p) => p.status === "scheduled") ?? [],
        active: Chunk.filter(decoded.right, (p) => p.status === "active") ?? [],
        finished:
            Chunk.filter(decoded.right, (p) => p.status === "finished") ?? [],
    };
};
