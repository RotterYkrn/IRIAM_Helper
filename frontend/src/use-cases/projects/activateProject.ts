import { Effect } from "effect";

import { type ActivateProjectArgs } from "@/domain/projects/rpcs/ActivateProject";
import { ProjectRepository } from "@/repositories/projects/project.repository";

/**
 * 企画を開催状態にします。
 * @param args rpcに渡す引数
 * @returns 開催状態にした企画のID
 */
export const activateProject = (args: ActivateProjectArgs) =>
    Effect.gen(function* () {
        const repository = yield* ProjectRepository;
        return yield* repository.activate(args);
    });
