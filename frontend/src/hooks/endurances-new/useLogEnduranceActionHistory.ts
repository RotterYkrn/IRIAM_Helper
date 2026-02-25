import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Effect, pipe, Schema, Either } from "effect";

import type { LogEnduranceActionHistoryNewArgsEncoded } from "@/domain/endurances-new/rpcs/LogEnduranceActionHistoryNew";
import {
    EnduranceNormalCountSchema,
    EnduranceRescueCountSchema,
    EnduranceSabotageCountSchema,
} from "@/domain/endurances-new/tables/EnduranceActionCounts";
import type { EnduranceActionHistoriesNewSchema } from "@/domain/endurances-new/tables/EnduranceActionHistoriesNew";
import {
    EnduranceActionCountSchema,
    EnduranceActionsNewSchema,
} from "@/domain/endurances-new/tables/EnduranceActionsNew";
import { EnduranceCurrentCountSchema } from "@/domain/endurances-new/tables/EnduranceUnits";
import type {
    EnduranceRescueActionSchema,
    EnduranceSabotageActionSchema,
} from "@/domain/endurances-new/views/EnduranceActionStatsViewNew";
import type { EnduranceProjectViewNew } from "@/domain/endurances-new/views/EnduranceProjectViewNew";
import { logEnduranceActionHistoryNew } from "@/use-cases/endurances-new/logEnduranceActionHistory";

type UseLogEnduranceActionHistoryNewArgs =
    | (Omit<LogEnduranceActionHistoryNewArgsEncoded, "p_action_id"> & {
          p_action_history_type: "normal";
      })
    | (LogEnduranceActionHistoryNewArgsEncoded & {
          p_action_history_type: "rescue" | "sabotage";
          p_action_id: typeof EnduranceActionsNewSchema.Encoded.id;
          amount: typeof EnduranceActionsNewSchema.Encoded.amount;
      });

export const useLogEnduranceActionHistoryNew = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (args: UseLogEnduranceActionHistoryNewArgs) => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 1 * 1000));

                const result = await Effect.runPromise(
                    logEnduranceActionHistoryNew(args),
                );

                return result;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        onMutate: async (args: UseLogEnduranceActionHistoryNewArgs) => {
            // 楽観的更新
            switch (args.p_action_history_type) {
                case "normal":
                    queryClient.setQueryData<EnduranceProjectViewNew>(
                        ["project", args.p_project_id],
                        updateProjectNormal(args.p_action_count),
                    );
                    break;

                case "rescue":
                    queryClient.setQueryData<EnduranceProjectViewNew>(
                        ["project", args.p_project_id],
                        updateProjectRescue(args.amount, args.p_action_count),
                    );
                    queryClient.setQueryData<
                        typeof EnduranceRescueActionSchema.Type
                    >(
                        ["action", args.p_action_id],
                        (old) =>
                            old && {
                                ...old,
                                count: Schema.decodeSync(
                                    EnduranceActionCountSchema,
                                )(old.count + args.p_action_count),
                            },
                    );
                    break;

                case "sabotage":
                    queryClient.setQueryData<EnduranceProjectViewNew>(
                        ["project", args.p_project_id],
                        updateProjectSabotage(args.amount, args.p_action_count),
                    );
                    queryClient.setQueryData<
                        typeof EnduranceSabotageActionSchema.Type
                    >(
                        ["action", args.p_action_id],
                        (old) =>
                            old && {
                                ...old,
                                count: Schema.decodeSync(
                                    EnduranceActionCountSchema,
                                )(old.count + args.p_action_count),
                            },
                    );
                    break;
            }
        },
        // onSuccess: (projectId) => {
        //     queryClient.invalidateQueries({ queryKey: ["project", projectId] });
        //     queryClient.invalidateQueries({
        //         queryKey: ["actionStat", projectId],
        //     });
        // },
        onError: (_, args) => {
            // 楽観的更新のロールバック
            switch (args.p_action_history_type) {
                case "normal":
                    queryClient.setQueryData<EnduranceProjectViewNew>(
                        ["project", args.p_project_id],
                        updateProjectNormal(-args.p_action_count),
                    );
                    break;

                case "rescue":
                    queryClient.setQueryData<EnduranceProjectViewNew>(
                        ["project", args.p_project_id],
                        updateProjectRescue(args.amount, -args.p_action_count),
                    );
                    queryClient.setQueryData<
                        typeof EnduranceRescueActionSchema.Type
                    >(
                        ["action", args.p_action_id],
                        (old) =>
                            old && {
                                ...old,
                                count: Schema.decodeSync(
                                    EnduranceActionCountSchema,
                                )(old.count + args.p_action_count),
                            },
                    );
                    break;

                case "sabotage":
                    queryClient.setQueryData<EnduranceProjectViewNew>(
                        ["project", args.p_project_id],
                        updateProjectSabotage(
                            args.amount,
                            -args.p_action_count,
                        ),
                    );
                    queryClient.setQueryData<
                        typeof EnduranceSabotageActionSchema.Type
                    >(
                        ["action", args.p_action_id],
                        (old) =>
                            old && {
                                ...old,
                                count: Schema.decodeSync(
                                    EnduranceActionCountSchema,
                                )(old.count - args.p_action_count),
                            },
                    );
                    break;
            }
        },
    });
};

const updateProjectNormal =
    (
        actionCount: typeof EnduranceActionHistoriesNewSchema.Encoded.action_count,
    ) =>
    (
        old: EnduranceProjectViewNew | undefined,
    ): EnduranceProjectViewNew | undefined =>
        old && {
            ...old,
            current_count: Schema.decodeSync(EnduranceCurrentCountSchema)(
                old.current_count + actionCount,
            ),
            normal_count: Schema.decodeSync(EnduranceNormalCountSchema)(
                old.normal_count + actionCount,
            ),
        };

const updateProjectRescue =
    (
        actionAmount: typeof EnduranceActionsNewSchema.Encoded.amount,
        actionCount: typeof EnduranceActionHistoriesNewSchema.Encoded.action_count,
    ) =>
    (
        old: EnduranceProjectViewNew | undefined,
    ): EnduranceProjectViewNew | undefined =>
        old && {
            ...old,
            current_count: Schema.decodeSync(EnduranceCurrentCountSchema)(
                old.current_count + actionAmount * actionCount,
            ),
            rescue_count: Schema.decodeSync(EnduranceRescueCountSchema)(
                old.rescue_count + actionAmount * actionCount,
            ),
        };

const updateProjectSabotage =
    (
        actionAmount: typeof EnduranceActionsNewSchema.Encoded.amount,
        actionCount: typeof EnduranceActionHistoriesNewSchema.Encoded.action_count,
    ) =>
    (
        old: EnduranceProjectViewNew | undefined,
    ): EnduranceProjectViewNew | undefined =>
        old && {
            ...old,
            current_count: pipe(
                Schema.decodeEither(EnduranceCurrentCountSchema)(
                    old.current_count - actionAmount * actionCount,
                ),
                Either.getOrElse((error) => {
                    console.error(error.toJSON());
                    return Schema.decodeSync(EnduranceCurrentCountSchema)(0);
                }),
            ),
            sabotage_count: pipe(
                Schema.decodeEither(EnduranceSabotageCountSchema)(
                    old.sabotage_count + actionAmount * actionCount,
                ),
                Either.getOrElse((error) => {
                    console.error(error.toJSON());
                    return Schema.decodeSync(EnduranceSabotageCountSchema)(0);
                }),
            ),
        };

// const updateActionStatRescue =
//     (
//         actionId: typeof EnduranceActionsNewSchema.Encoded.id,
//         actionCount: typeof EnduranceActionHistoriesNewSchema.Encoded.action_count,
//     ) =>
//     (
//         old: EnduranceActionStatViewNew | undefined,
//     ): EnduranceActionStatViewNew | undefined => {
//         if (!old) {
//             return undefined;
//         }

//         const prevCount = pipe(
//             old.rescue_actions,
//             Chunk.findFirst((action) => action.id === actionId),
//             Option.match({
//                 onNone: () => 0,
//                 onSome: (action) => action.count,
//             }),
//             (count) => count + actionCount,
//             Schema.decodeEither(EnduranceActionCountSchema),
//             Either.getOrElse((error) => {
//                 console.error(error.toJSON());
//                 return Schema.decodeSync(EnduranceActionCountSchema)(0);
//             }),
//         );

//         return {
//             ...old,
//             rescue_actions: Chunk.map(old.rescue_actions, (action) =>
//                 action.id === actionId
//                     ? {
//                           ...action,
//                           count: prevCount,
//                       }
//                     : action,
//             ),
//         };
//     };

// const updateActionStatSabotage =
//     (
//         actionId: typeof EnduranceActionsNewSchema.Encoded.id,
//         actionCount: typeof EnduranceActionHistoriesNewSchema.Encoded.action_count,
//     ) =>
//     (
//         old: EnduranceActionStatViewNew | undefined,
//     ): EnduranceActionStatViewNew | undefined =>
//         old && {
//             ...old,
//             sabotage_actions: Chunk.map(old.sabotage_actions, (action) =>
//                 action.id === actionId
//                     ? {
//                           ...action,
//                           count: Schema.decodeSync(EnduranceActionCountSchema)(
//                               action.count + actionCount,
//                           ),
//                       }
//                     : action,
//             ),
//         };
