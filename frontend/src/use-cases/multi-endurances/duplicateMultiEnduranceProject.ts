import { Effect } from "effect";

import { type DuplicateMultiEnduranceProjectArgs } from "@/domain/multi-endurances/rpcs/DuplicateMultiEnduranceProject";
import { MultiEnduranceRepository } from "@/repositories/multi-endurances/multi-endurance.repository";

/**
 * 耐久企画（複数）を複製します。
 * @param args rpcに渡す引数
 * @returns 複製した企画のID
 */
export const duplicateMultiEnduranceProject = (
    args: DuplicateMultiEnduranceProjectArgs,
) =>
    Effect.gen(function* () {
        const repository = yield* MultiEnduranceRepository;
        return yield* repository.duplicate(args);
    });
