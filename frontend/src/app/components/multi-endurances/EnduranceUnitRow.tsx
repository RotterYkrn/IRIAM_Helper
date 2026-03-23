import { useQueryClient } from "@tanstack/react-query";

import EnduranceView from "../endurances-new/EnduranceView";

import type { EnduranceActionsNewSchema } from "@/domain/endurances-new/tables/EnduranceActionsNew";
import type { MultiEnduranceUnitSchema } from "@/domain/multi-endurances/dto/MultiEnduranceProjectDto";
import { EnduranceKey } from "@/hooks/query-keys/endurances";

type Props = {
    // projectId: typeof EnduranceActionsNewSchema.Type.project_id;
    unitId: typeof EnduranceActionsNewSchema.Type.unit_id;
    // actionId: typeof EnduranceActionsNewSchema.Type.id;
};

/**
 * 耐久企画の救済・妨害アクションの各要素を描画します
 *
 * @note {@link EnduranceView} 内で使用する必要があります。
 */
const EnduranceUnitRow = ({ unitId }: Props) => {
    const queryClient = useQueryClient();
    // const logEnduranceActionHistory = useLogEnduranceActionHistoryNew();

    const unit = queryClient.getQueryData<typeof MultiEnduranceUnitSchema.Type>(
        EnduranceKey.unit(unitId),
    );

    if (!unit) {
        return null;
    }

    // const onIncrement =
    //     (
    //         actionType: typeof EnduranceActionsNewSchema.Type.type,
    //         actionId: typeof EnduranceActionsNewSchema.Type.id,
    //         actionAmount: typeof EnduranceActionsNewSchema.Encoded.amount,
    //     ) =>
    //     (
    //         actionCount: typeof EnduranceActionHistoriesNewSchema.Encoded.action_count,
    //     ) => {
    //         logEnduranceActionHistory.mutate({
    //             p_project_id: projectId,
    //             p_unit_id: unitId,
    //             p_action_history_type: actionType,
    //             p_action_id: actionId,
    //             p_action_count: actionCount,
    //             amount: actionAmount,
    //         });
    //     };

    return (
        <EnduranceView.Action>
            <EnduranceView.SettingsLayout>
                <div
                    className="flex items-center justify-center
                        whitespace-nowrap text-2xl font-bold"
                >
                    {unit.label}
                </div>
                <p
                    className="flex items-center justify-center font-mono
                        text-2xl"
                >
                    {unit.current_count}/{unit.target_count}
                </p>
            </EnduranceView.SettingsLayout>
            <EnduranceView.ActionProgress>
                <EnduranceView.MinusButtons
                    disabled={unit.current_count <= 0}
                    onIncrement={() => {}}
                />
                <EnduranceView.PlusButtons onIncrement={() => {}} />
            </EnduranceView.ActionProgress>
        </EnduranceView.Action>
    );
};

export default EnduranceUnitRow;
