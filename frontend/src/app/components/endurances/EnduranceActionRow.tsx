import { useQueryClient } from "@tanstack/react-query";

import EnduranceView from "../ui/EnduranceView";

import type { EnduranceActionDtoSchema } from "@/domain/endurances/dto/EnduranceProjectDto";
import type { EnduranceActionHistoriesSchema } from "@/domain/endurances/tables/EnduranceActionHistories";
import type { EnduranceActionsSchema } from "@/domain/endurances/tables/EnduranceActions";
import { useLogEnduranceActionHistory } from "@/hooks/endurances/useLogEnduranceActionHistory";
import { EnduranceKey } from "@/hooks/query-keys/endurances";

type Props = {
    projectId: typeof EnduranceActionsSchema.Type.project_id;
    unitId: typeof EnduranceActionsSchema.Type.unit_id;
    actionId: typeof EnduranceActionsSchema.Type.id;
};

/**
 * 耐久企画の救済・妨害アクションの各要素を描画します
 *
 * @note {@link EnduranceView} 内で使用する必要があります。
 */
const EnduranceActionRow = ({ projectId, unitId, actionId }: Props) => {
    const queryClient = useQueryClient();
    const logEnduranceActionHistory = useLogEnduranceActionHistory();

    const action = queryClient.getQueryData<
        typeof EnduranceActionDtoSchema.Type
    >(EnduranceKey.action(actionId));

    if (!action) {
        return null;
    }

    const onIncrement =
        (
            actionType: typeof EnduranceActionsSchema.Type.type,
            actionId: typeof EnduranceActionsSchema.Type.id,
            actionAmount: typeof EnduranceActionsSchema.Encoded.amount,
        ) =>
        (
            actionCount: typeof EnduranceActionHistoriesSchema.Encoded.action_count,
        ) => {
            logEnduranceActionHistory.mutate({
                p_project_id: projectId,
                p_unit_id: unitId,
                p_action_history_type: actionType,
                p_action_id: actionId,
                p_action_count: actionCount,
                amount: actionAmount,
            });
        };

    return (
        <EnduranceView.Action>
            <EnduranceView.SettingsLayout>
                <EnduranceView.Label label={action.label} />
                <EnduranceView.Amount
                    actionType={action.type}
                    amount={action.amount}
                />
            </EnduranceView.SettingsLayout>
            <EnduranceView.ActionProgress>
                <EnduranceView.MinusButtons
                    disabled={action.count <= 0}
                    onIncrement={onIncrement(
                        action.type,
                        action.id,
                        action.amount,
                    )}
                />
                <EnduranceView.ActionCount actionCount={action.count} />
                <EnduranceView.PlusButtons
                    onIncrement={onIncrement(
                        action.type,
                        action.id,
                        action.amount,
                    )}
                />
            </EnduranceView.ActionProgress>
        </EnduranceView.Action>
    );
};

export default EnduranceActionRow;
