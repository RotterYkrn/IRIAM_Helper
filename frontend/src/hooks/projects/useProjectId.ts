import { Either, pipe, Schema } from "effect";
import { useParams } from "react-router-dom";

import { ProjectIdSchema } from "@/domain/projects/tables/Project";

export const useProjectId = () =>
    pipe(
        useParams<{ projectId: string }>(),
        ({ projectId }) => projectId,
        Schema.decodeUnknownEither(ProjectIdSchema),
        Either.getOrThrow,
    );
