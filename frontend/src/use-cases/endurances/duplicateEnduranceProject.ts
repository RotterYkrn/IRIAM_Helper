import { Effect } from "effect";

import { type DuplicateEnduranceProjectArgs } from "@/domain/endurances/rpcs/DuplicateEnduranceProject";
import { EnduranceRepository } from "@/repositories/endurances/endurance.repository";

/**
 * 耐久企画（単体）を複製します。
 * @param args rpcに渡す引数
 * @returns 複製した企画のID
 */
export const duplicateEnduranceProject = (
    args: DuplicateEnduranceProjectArgs,
) =>
    Effect.gen(function* () {
        const repository = yield* EnduranceRepository;
        return yield* repository.duplicate(args);
    });
