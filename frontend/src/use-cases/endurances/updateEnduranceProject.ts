import { Effect } from "effect";

import { type UpdateEnduranceProjectArgs } from "@/domain/endurances/rpcs/UpdateEnduranceProject";
import { EnduranceRepository } from "@/repositories/endurances/endurance.repository";

/**
 * 耐久企画（単体）の設定を更新します。
 * @param args rpcに渡す引数
 * @returns 更新した企画のID
 */
export const updateEnduranceProject = (args: UpdateEnduranceProjectArgs) =>
    Effect.gen(function* () {
        const repository = yield* EnduranceRepository;
        return yield* repository.update(args);
    });
