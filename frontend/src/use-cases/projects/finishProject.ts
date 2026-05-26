import { Effect } from "effect";

import { type FinishProjectArgs } from "@/domain/projects/rpcs/FinishProject";
import { ProjectRepository } from "@/repositories/projects/project.repository";

/**
 * 企画を終了状態にします。
 * @param args rpcに渡す引数
 * @returns 終了状態にした企画のID
 */
export const finishProject = (args: FinishProjectArgs) =>
    Effect.gen(function* () {
        const repository = yield* ProjectRepository;
        return yield* repository.finish(args);
    });
