import { useQueryClient } from "@tanstack/react-query";

import EnduranceView from "./EnduranceView";

import type { EnduranceActionHistoriesNewSchema } from "@/domain/endurances-new/tables/EnduranceActionHistoriesNew";
import type { EnduranceActionsNewSchema } from "@/domain/endurances-new/tables/EnduranceActionsNew";
import { useLogEnduranceActionHistoryNew } from "@/hooks/endurances-new/useLogEnduranceActionHistory";

type Props = {
    projectId: typeof EnduranceActionsNewSchema.Type.project_id;
    unitId: typeof EnduranceActionsNewSchema.Type.unit_id;
    actionId: typeof EnduranceActionsNewSchema.Type.id;
};

const EnduranceActionRow = ({ projectId, unitId, actionId }: Props) => {
    const queryClient = useQueryClient();
    const logEnduranceActionHistory = useLogEnduranceActionHistoryNew();

    const action = queryClient.getQueryData<
        typeof EnduranceActionsNewSchema.Type
    >(["action", actionId]);

    if (!action) {
        return null;
    }

    const onIncrement =
        (
            actionType: typeof EnduranceActionsNewSchema.Type.type,
            actionId: typeof EnduranceActionsNewSchema.Type.id,
            actionAmount: typeof EnduranceActionsNewSchema.Encoded.amount,
        ) =>
        (
            actionCount: typeof EnduranceActionHistoriesNewSchema.Encoded.action_count,
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
                    buttonConfigs={[
                        {
                            label: "-",
                            count: -1,
                            disabled: action.count <= 0,
                        },
                    ]}
                    onIncrement={onIncrement(
                        action.type,
                        action.id,
                        action.amount,
                    )}
                />
                <EnduranceView.ActionCount actionCount={action.count} />
                <EnduranceView.PlusButtons
                    buttonConfigs={[
                        {
                            label: "+",
                            count: 1,
                        },
                    ]}
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
