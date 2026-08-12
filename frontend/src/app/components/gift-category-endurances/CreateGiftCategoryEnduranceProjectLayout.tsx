import { Chunk, Option, Order, pipe } from "effect";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffectEvent, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

import CreateProjectContainer from "../projects/containers/CreateProjectContainer";

import {
    editTargetCountAtom,
    validEditTargetCountAtom,
} from "@/atoms/endurances/EditTargetCountAtom";
import {
    initEditGiftCategoryEnduranceAtom,
    isValidEditGiftCategoryEnduranceAtom,
    validEditGiftCategoryEnduranceAtom,
} from "@/atoms/gift-category-endurances/EditGiftCategoryEnduranceAtom";
import { Card } from "@/components/ui/card";
import { EnduranceTargetCountSchema } from "@/domain/endurances/tables/EnduranceUnits";
import type { GiftDto } from "@/domain/gifts/dto/GiftDto";
import { ProjectTitleSchema } from "@/domain/projects/tables/Project";
import { useCreateGiftCategoryEnduranceProject } from "@/hooks/gift-category-endurances/useCreateEnduranceProject";
import { useGiftQuery } from "@/hooks/gifts/useGiftQuery";
import { errorToast, successToast } from "@/utils/toast";
import InputField from "../ui/InputField";

const CreateGiftCategoryEnduranceProjectLayout = () => {
    const navigate = useNavigate();

    const { gifts } = useGiftQuery();

    const [targetCountState, setTargetCount] = useAtom(editTargetCountAtom);
    const validTargetCount = useAtomValue(validEditTargetCountAtom);
    const validEditState = useAtomValue(validEditGiftCategoryEnduranceAtom);
    const initEditEndurance = useSetAtom(initEditGiftCategoryEnduranceAtom);
    const isValidState = useAtomValue(isValidEditGiftCategoryEnduranceAtom);

    const { create, isCreating } = useCreateGiftCategoryEnduranceProject();

    const targetGifts = pipe(
        gifts,
        Chunk.filter((gift) => gift.point >= 200),
        Chunk.sort(Order.mapInput(Order.number, (gift: GiftDto) => gift.point)),
    );

    const initEvent = useEffectEvent(() =>
        initEditEndurance({
            title: ProjectTitleSchema.make("ラブカテ耐久"),
            target_count: EnduranceTargetCountSchema.make(3),
        }),
    );

    useLayoutEffect(() => {
        initEvent();
    }, []);

    const onSave = async () => {
        if (!validEditState) {
            errorToast(`無効なフィールドがあります`);
            return;
        }

        const createArgs = {
            ...validEditState,
            units: Chunk.map(targetGifts, (g, i) => ({
                position: i,
                gift_id: g.id,
            })),
        };

        create(createArgs, {
            onSuccess: ({ id, title }) => {
                successToast(`「${title}」を作成しました`);
                navigate(`/projects/gift-category-endurance/${id}`);
            },
            onError: (error) => {
                console.error(error);
                errorToast(`「${validEditState.title}」の作成に失敗しました`);
            },
        });
    };

    return (
        <CreateProjectContainer
            canSave={isValidState}
            isSaving={isCreating}
            onSave={onSave}
        >
            <div className="flex flex-row gap-2 pl-8">
                <InputField
                    label="周回数"
                    error={targetCountState.error}
                    setValue={setTargetCount}
                    value={targetCountState.input}
                    className="text-4xl font-mono w-30"
                />
                <div className="flex items-end text-2xl">周</div>
            </div>
            <span className="text-md font-medium text-gray-600">
                ※目標数を空欄もしくは0にすると、∞周に設定にできます
            </span>
            <div className="grid grid-cols-3 gap-4">
                {Chunk.map(targetGifts, (gift) => (
                    <Card
                        key={gift.id}
                        className="w-45"
                    >
                        <div
                            className="whitespace-nowrap text-2xl font-semibold"
                        >
                            {gift.nick_name ?? gift.name}
                        </div>
                        <p className="text-lg font-semibold">
                            ({gift.point.toLocaleString()}pt)
                        </p>
                        <p className="font-mono text-2xl">
                            {Option.isSome(validTargetCount) &&
                            validTargetCount.value !== 0
                                ? `0/${validTargetCount.value}`
                                : "0/∞"}
                        </p>
                    </Card>
                ))}
            </div>
        </CreateProjectContainer>
    );
};

export default CreateGiftCategoryEnduranceProjectLayout;
