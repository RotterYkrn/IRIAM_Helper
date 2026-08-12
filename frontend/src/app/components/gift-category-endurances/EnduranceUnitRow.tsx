import { useQueryClient } from "@tanstack/react-query";
import { Chunk, Option, pipe } from "effect";
import { useAtomValue } from "jotai";

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
import { cn } from "@/lib/utils";

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

    const getCardBgColor = () => {
        // 編集モード中は着色しない（デフォルトスタイル）
        if (isEdit) return "";

        // 目的値（表示上のターゲットカウント）を取得
        const effectiveTargetCount = unit.target_count;

        // 目標が0（無限）の場合は達成判定しない場合
        if (effectiveTargetCount === 0) return "";

        // 達成（緑）/ 未達成（赤）の判定
        const isAchieved = unit.current_count >= effectiveTargetCount;

        return isAchieved
            ? "bg-emerald-50 border-emerald-300 text-emerald-950" // 達成：緑系
            : "bg-rose-50 border-rose-300 text-rose-950"; // 未達成：赤系
    };

    return (
        <Card className={cn("w-45 transition-colors", getCardBgColor())}>
            <div className="whitespace-nowrap text-2xl font-semibold">
                {gift.nick_name ?? gift.name}
            </div>
            <p className="text-lg font-semibold">
                ({gift.point.toLocaleString()}pt)
            </p>
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
