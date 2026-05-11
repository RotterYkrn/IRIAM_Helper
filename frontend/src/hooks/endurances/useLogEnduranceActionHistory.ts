import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Effect } from "effect";

import { EnduranceKey } from "../query-keys/endurances";
import { ProjectKey } from "../query-keys/projects";

import type {
    EnduranceActionDtoSchema,
    EnduranceProjectDto,
} from "@/domain/endurances/dto/EnduranceProjectDto";
import type { LogEnduranceActionHistoryArgsEncoded } from "@/domain/endurances/rpcs/LogEnduranceActionHistory";
import type { EnduranceActionHistoriesSchema } from "@/domain/endurances/tables/EnduranceActionHistories";
import { EnduranceActionsSchema } from "@/domain/endurances/tables/EnduranceActions";
import { logEnduranceActionHistory } from "@/use-cases/endurances/logEnduranceActionHistory";

/**
 * {@link useLogEnduranceActionHistory} の mutate の引数
 *
 * @description
 * - `p_action_history_type = "normal"` の場合、`p_action_id` は不要
 * - `p_action_history_type = "rescue" | "sabotage"` の場合、`p_action_id` および `amount` を設定する
 */
type UseLogEnduranceActionHistoryArgs =
    | (Omit<LogEnduranceActionHistoryArgsEncoded, "p_action_id"> & {
          p_action_history_type: "normal";
      })
    | (LogEnduranceActionHistoryArgsEncoded & {
          p_action_history_type: "rescue" | "sabotage";
          p_action_id: typeof EnduranceActionsSchema.Encoded.id;
          amount: typeof EnduranceActionsSchema.Encoded.amount;
      });

/**
 * 耐久企画のアクション履歴（通常・救済・妨害）を記録するカスタムフック。
 *
 * @description
 * 楽観的更新を実装しています。
 * ### キャッシュ更新の挙動:
 * - `onMutate`: アクションの種類（normal/rescue/sabotage）に応じて、\
 * プロジェクト(`["project", id]`)およびアクション詳細(`["action", id]`)のキャッシュを先行更新します。
 * - `onError`: サーバー通信に失敗した場合、実行前のカウント数へ正確にロールバックします。
 *
 * @returns  TanStack QueryのMutationオブジェクト。\
 * `mutate`関数には {@link UseLogEnduranceActionHistoryArgs} を渡してください。
 */
export const useLogEnduranceActionHistory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (args: UseLogEnduranceActionHistoryArgs) => {
            try {
                const result = await Effect.runPromise(
                    logEnduranceActionHistory(args),
                );

                return result;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        onMutate: async (args: UseLogEnduranceActionHistoryArgs) => {
            // 楽観的更新
            switch (args.p_action_history_type) {
                case "normal":
                    queryClient.setQueryData<EnduranceProjectDto>(
                        ProjectKey.detail(args.p_project_id),
                        updateProjectNormal(args.p_action_count),
                    );
                    break;

                case "rescue":
                    queryClient.setQueryData<EnduranceProjectDto>(
                        ProjectKey.detail(args.p_project_id),
                        updateProjectRescue(args.amount, args.p_action_count),
                    );
                    queryClient.setQueryData<
                        typeof EnduranceActionDtoSchema.Type
                    >(
                        EnduranceKey.action(args.p_action_id),
                        updateActionCount(args.p_action_count),
                    );
                    break;

                case "sabotage":
                    queryClient.setQueryData<EnduranceProjectDto>(
                        ProjectKey.detail(args.p_project_id),
                        updateProjectSabotage(args.amount, args.p_action_count),
                    );
                    queryClient.setQueryData<
                        typeof EnduranceActionDtoSchema.Type
                    >(
                        EnduranceKey.action(args.p_action_id),
                        updateActionCount(args.p_action_count),
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
                    queryClient.setQueryData<EnduranceProjectDto>(
                        ProjectKey.detail(args.p_project_id),
                        updateProjectNormal(-args.p_action_count),
                    );
                    break;

                case "rescue":
                    queryClient.setQueryData<EnduranceProjectDto>(
                        ProjectKey.detail(args.p_project_id),
                        updateProjectRescue(args.amount, -args.p_action_count),
                    );
                    queryClient.setQueryData<
                        typeof EnduranceActionDtoSchema.Type
                    >(
                        EnduranceKey.action(args.p_action_id),
                        updateActionCount(-args.p_action_count),
                    );
                    break;

                case "sabotage":
                    queryClient.setQueryData<EnduranceProjectDto>(
                        ProjectKey.detail(args.p_project_id),
                        updateProjectSabotage(
                            args.amount,
                            -args.p_action_count,
                        ),
                    );
                    queryClient.setQueryData<
                        typeof EnduranceActionDtoSchema.Type
                    >(
                        EnduranceKey.action(args.p_action_id),
                        updateActionCount(-args.p_action_count),
                    );
                    break;
            }
        },
    });
};

const updateProjectNormal =
    (actionCount: typeof EnduranceActionHistoriesSchema.Encoded.action_count) =>
    (old: EnduranceProjectDto | undefined): EnduranceProjectDto | undefined =>
        old && {
            ...old,
            unit: {
                ...old.unit,
                current_count: old.unit.current_count + actionCount,
            },
            action_count: {
                ...old.action_count,
                normal_count: old.action_count.normal_count + actionCount,
            },
        };

const updateProjectRescue =
    (
        actionAmount: typeof EnduranceActionsSchema.Encoded.amount,
        actionCount: typeof EnduranceActionHistoriesSchema.Encoded.action_count,
    ) =>
    (old: EnduranceProjectDto | undefined): EnduranceProjectDto | undefined =>
        old && {
            ...old,
            unit: {
                ...old.unit,
                current_count:
                    old.unit.current_count + actionAmount * actionCount,
            },
            action_count: {
                ...old.action_count,
                rescue_count:
                    old.action_count.rescue_count + actionAmount * actionCount,
            },
        };

const updateProjectSabotage =
    (
        actionAmount: typeof EnduranceActionsSchema.Encoded.amount,
        actionCount: typeof EnduranceActionHistoriesSchema.Encoded.action_count,
    ) =>
    (old: EnduranceProjectDto | undefined): EnduranceProjectDto | undefined =>
        old && {
            ...old,
            unit: {
                ...old.unit,
                current_count:
                    old.unit.current_count - actionAmount * actionCount,
            },
            action_count: {
                ...old.action_count,
                sabotage_count:
                    old.action_count.sabotage_count +
                    actionAmount * actionCount,
            },
        };

const updateActionCount =
    (actionCount: typeof EnduranceActionHistoriesSchema.Encoded.action_count) =>
    (
        old: typeof EnduranceActionDtoSchema.Type | undefined,
    ): typeof EnduranceActionDtoSchema.Type | undefined =>
        old && {
            ...old,
            count: old.count + actionCount,
        };
