import { Effect } from "effect";

import { type CreateEnduranceProjectArgs } from "@/domain/endurances/rpcs/CreateEnduranceProject";
import { EnduranceRepository } from "@/repositories/endurances/endurance.repository";

/**
 * 耐久企画（単体）を新規作成します。
 * @param args rpcに渡す引数
 * @returns 新規作成した企画のID
 */
export const createEnduranceProject = (args: CreateEnduranceProjectArgs) =>
    Effect.gen(function* () {
        const repository = yield* EnduranceRepository;
        return yield* repository.create(args);
    });
