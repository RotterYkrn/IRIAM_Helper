import { useQueryClient } from "@tanstack/react-query";

import EnduranceView from "../ui/EnduranceView";

import { Card } from "@/components/ui/card";
import { type EnduranceActionHistoriesSchema } from "@/domain/endurances/tables/EnduranceActionHistories";
import type { EnduranceActionsSchema } from "@/domain/endurances/tables/EnduranceActions";
import type { MultiEnduranceUnitSchema } from "@/domain/multi-endurances/dto/MultiEnduranceProjectDto";
import { useLogMultiEnduranceActionHistory } from "@/hooks/multi-endurances/useLogMultiEnduranceActionHistory";
import { EnduranceKey } from "@/hooks/query-keys/endurances";

type Props = {
    projectId: typeof EnduranceActionsSchema.Type.project_id;
    unitId: typeof EnduranceActionsSchema.Type.unit_id;
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
        actionCount: typeof EnduranceActionHistoriesSchema.Type.action_count,
    ) => {
        logActionHistory.mutate({
            project_id: projectId,
            unit_id: unitId,
            action_count: actionCount,
        });
    };

    return (
        <Card className="w-45 gap-1">
            <div className="whitespace-nowrap text-2xl font-semibold">
                {unit.label}
            </div>
            <p className="font-mono text-2xl">
                {unit.target_count !== 0
                    ? `${unit.current_count}/${unit.target_count}`
                    : unit.current_count}
            </p>
            <EnduranceView.PlusButtons onIncrement={onIncrement} />
            <EnduranceView.MinusButtons
                disabled={unit.current_count <= 0}
                onIncrement={onIncrement}
            />
        </Card>
    );
};

export default EnduranceUnitRow;
