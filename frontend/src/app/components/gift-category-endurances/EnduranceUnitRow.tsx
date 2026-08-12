import { useQueryClient } from "@tanstack/react-query";

import EnduranceView from "../ui/EnduranceView";

import { validEditTargetCountAtom } from "@/atoms/endurances/EditTargetCountAtom";
import { Card } from "@/components/ui/card";
import { useProjectContext } from "@/contexts/projects/useProjectContext";
import { type EnduranceActionHistoriesSchema } from "@/domain/endurances/tables/EnduranceActionHistories";
import type { EnduranceActionsSchema } from "@/domain/endurances/tables/EnduranceActions";
import type { GiftCategoryEnduranceUnitDto } from "@/domain/gift-category-endurances/dto/GiftCategoryEnduranceProjectDto";
import { useLogGiftCategoryEnduranceActionHistory } from "@/hooks/gift-category-endurances/useLogMultiEnduranceActionHistory";
import { useGiftQuery } from "@/hooks/gifts/useGiftQuery";
import { EnduranceKey } from "@/hooks/query-keys/endurances";
import { Chunk, Option, pipe } from "effect";
import { useAtomValue } from "jotai";

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
    const { isEdit } = useProjectContext();
    const { gifts } = useGiftQuery();
    const logActionHistory = useLogGiftCategoryEnduranceActionHistory();
    const validTargetCount = useAtomValue(validEditTargetCountAtom);

    const unit = queryClient.getQueryData<GiftCategoryEnduranceUnitDto>(
        EnduranceKey.unit(unitId),
    );

    if (!unit) {
        return null;
    }

    const gift = pipe(
        gifts,
        Chunk.findFirst((gift) => gift.id === unit.gift.id),
        Option.getOrNull,
    );

    if (!gift) {
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
        <Card className="w-45">
            <div className="whitespace-nowrap text-2xl font-semibold">
                {gift.nick_name ?? gift.name}
            </div>
            <p className="text-lg">({gift.point.toLocaleString()}pt)</p>
            <div className="flex flex-row gap-2 items-center">
                <EnduranceView.MinusButtons
                    disabled={unit.current_count <= 0}
                    onIncrement={onIncrement}
                />
                <p className="font-mono text-2xl">
                    {unit.current_count}/
                    {isEdit
                        ? Option.isSome(validTargetCount) &&
                          validTargetCount.value !== 0
                            ? validTargetCount.value
                            : "∞"
                        : unit.target_count === 0
                          ? "∞"
                          : unit.target_count}
                </p>
                <EnduranceView.PlusButtons onIncrement={onIncrement} />
            </div>
        </Card>
    );
};

export default EnduranceUnitRow;
