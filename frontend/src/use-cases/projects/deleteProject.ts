import { Effect } from "effect";

import { type DeleteProjectArgs } from "@/domain/projects/rpcs/DeleteProject";
import { ProjectRepository } from "@/repositories/projects/project.repository";

/**
 * 企画を削除します。
 * @param args rpcに渡す引数
 */
export const deleteProject = (args: DeleteProjectArgs) =>
    Effect.gen(function* () {
        const repository = yield* ProjectRepository;
        return yield* repository.delete(args);
    });
