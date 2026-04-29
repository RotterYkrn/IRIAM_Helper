import { useQueryClient } from "@tanstack/react-query";

import EnduranceView from "../ui/EnduranceView";

import { Card } from "@/components/ui/card";
import { type EnduranceActionHistoriesNewSchema } from "@/domain/endurances-new/tables/EnduranceActionHistoriesNew";
import type { EnduranceActionsNewSchema } from "@/domain/endurances-new/tables/EnduranceActionsNew";
import type { MultiEnduranceUnitSchema } from "@/domain/multi-endurances/dto/MultiEnduranceProjectDto";
import { useLogMultiEnduranceActionHistory } from "@/hooks/multi-endurances/useLogMultiEnduranceActionHistory";
import { EnduranceKey } from "@/hooks/query-keys/endurances";

type Props = {
    projectId: typeof EnduranceActionsNewSchema.Type.project_id;
    unitId: typeof EnduranceActionsNewSchema.Type.unit_id;
};

/**
 * 耐久企画の救済・妨害アクションの各要素を描画します
 *
 * @note {@link EnduranceView} 内で使用する必要があります。
 */
const EnduranceUnitRow = ({ projectId, unitId }: Props) => {
    const queryClient = useQueryClient();
    const logActionHistory = useLogMultiEnduranceActionHistory();

    const unit = queryClient.getQueryData<typeof MultiEnduranceUnitSchema.Type>(
        EnduranceKey.unit(unitId),
    );

    if (!unit) {
        return null;
    }

    const onIncrement = (
        actionCount: typeof EnduranceActionHistoriesNewSchema.Type.action_count,
    ) => {
        logActionHistory.mutate({
            project_id: projectId,
            unit_id: unitId,
            action_count: actionCount,
        });
    };

    return (
        <Card className="w-45 gap-2">
            <div className="flex-1 whitespace-nowrap text-2xl">
                {unit.label}
            </div>
            <p className="flex-1 font-mono text-2xl">
                {unit.current_count}/{unit.target_count}
            </p>
            <div className="flex-1 flex flex-col items-center gap-1">
                <EnduranceView.PlusButtons onIncrement={onIncrement} />
                <EnduranceView.MinusButtons
                    disabled={unit.current_count <= 0}
                    onIncrement={onIncrement}
                />
            </div>
        </Card>
    );
};

export default EnduranceUnitRow;
