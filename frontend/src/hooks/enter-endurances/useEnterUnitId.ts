import { pipe, Schema, Either } from "effect";
import { useParams } from "react-router-dom";

import { EnterUnitIdSchema } from "@/domain/enter_endurances/tables/EnterUnit";

export const useEnterUnitId = () =>
    pipe(
        useParams<{ unitId: string }>(),
        ({ unitId }) => unitId,
        Schema.decodeUnknownEither(EnterUnitIdSchema),
        Either.getOrThrow,
    );
