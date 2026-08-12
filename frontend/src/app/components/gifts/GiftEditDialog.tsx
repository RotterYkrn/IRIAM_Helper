import { Chunk, Either, pipe, Schema } from "effect";
import { Plus } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { GiftDto } from "@/domain/gifts/dto/GiftDto";
import {
    GiftCategoryName,
    type GiftCategoryId,
} from "@/domain/gifts/tables/Categories";
import {
    GiftId,
    GiftName,
    GiftNickName,
    GiftPoint,
} from "@/domain/gifts/tables/Gifts";
import { useGiftMutation } from "@/hooks/gifts/useGiftMutation";
import { useGiftQuery } from "@/hooks/gifts/useGiftQuery";

type Props = {
    isGiftOpen: boolean;
    setIsGiftOpen: (isGiftOpen: boolean) => void;
    giftForm: GiftDto;
    setGiftForm: (giftForm: GiftDto) => void;
};

const GiftEditDialog = ({
    isGiftOpen,
    setIsGiftOpen,
    giftForm,
    setGiftForm,
}: Props) => {
    const { categories } = useGiftQuery();
    const mutation = useGiftMutation();

    // 新規カテゴリ作成用の簡易状態
    const [isAddingQuickCategory, setIsAddingQuickCategory] = useState(false);
    const [quickCategoryName, setQuickCategoryName] = useState("");

    // --- ハンドラー ---

    // カテゴリ追加ハンドラ（ギフト編集中の動線を想定）
    const handleQuickAddCategory = async () => {
        pipe(
            quickCategoryName,
            Schema.decodeEither(GiftCategoryName),
            Either.match({
                onLeft: () => {},
                onRight: (name) => {
                    mutation.createCategory.mutate(name);
                    setQuickCategoryName("");
                    setIsAddingQuickCategory(false);
                },
            }),
        );
        // 本来はここでリストを再取得（または楽観的更新）
    };

    return (
        <Dialog
            open={isGiftOpen}
            onOpenChange={setIsGiftOpen}
        >
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    className="bg-pink-500 hover:bg-pink-600 text-white"
                    onClick={() =>
                        setGiftForm({
                            id: "" as GiftId,
                            name: GiftName.make("V.I.P."),
                            nick_name: null,
                            point: GiftPoint.make(500),
                            category_ids: Chunk.empty<GiftCategoryId>(),
                        })
                    }
                >
                    <Plus className="w-4 h-4 mr-1" /> ギフト追加
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {giftForm.id ? "ギフト編集" : "新しいギフトを追加"}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <label className="text-sm font-medium">
                            ギフト名 *
                        </label>
                        <Input
                            value={giftForm.name}
                            onChange={(e) =>
                                setGiftForm({
                                    ...giftForm,
                                    name: GiftName.make(e.target.value),
                                })
                            }
                            placeholder="例: ひらめいた！"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">
                            略称名 (任意)
                        </label>
                        <Input
                            value={giftForm.nick_name || ""}
                            onChange={(e) =>
                                setGiftForm({
                                    ...giftForm,
                                    nick_name:
                                        (e.target.value as GiftNickName) ||
                                        null,
                                })
                            }
                            placeholder="例: ひらめき"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">
                            ポイント数 *
                        </label>
                        <Input
                            type="number"
                            value={giftForm.point || ""}
                            onChange={(e) =>
                                setGiftForm({
                                    ...giftForm,
                                    point: GiftPoint.make(
                                        Number(e.target.value),
                                    ),
                                })
                            }
                            placeholder="例: 10"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium block mb-2">
                            所属カテゴリ（複数選択可）
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {Chunk.map(categories, (cat) => {
                                const isSelected = Chunk.contains(
                                    giftForm.category_ids,
                                    cat.id,
                                );
                                return (
                                    <Badge
                                        key={cat.id}
                                        variant={
                                            isSelected ? "default" : "outline"
                                        }
                                        className={`cursor-pointer px-3 py-1
                                        text-xs
                                        ${isSelected ? "bg-pink-500 hover:bg-pink-600" : "border-pink-200 text-pink-700"}`}
                                        onClick={() => {
                                            const next = isSelected
                                                ? Chunk.filter(
                                                      giftForm.category_ids,
                                                      (id) => id !== cat.id,
                                                  )
                                                : Chunk.append(
                                                      giftForm.category_ids,
                                                      cat.id,
                                                  );
                                            setGiftForm({
                                                ...giftForm,
                                                category_ids: next,
                                            });
                                        }}
                                    >
                                        {cat.name}
                                    </Badge>
                                );
                            })}
                            {/* ＋ 新規カテゴリボタン */}
                            {isAddingQuickCategory ? (
                                <div className="flex gap-1 items-center">
                                    <Input
                                        size={10}
                                        className="h-7 w-24 text-xs"
                                        value={quickCategoryName}
                                        onChange={(e) =>
                                            setQuickCategoryName(e.target.value)
                                        }
                                        placeholder="名前..."
                                        autoFocus
                                    />
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 px-2"
                                        onClick={handleQuickAddCategory}
                                    >
                                        OK
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 px-2 border-dashed
                                        text-gray-500"
                                    onClick={() =>
                                        setIsAddingQuickCategory(true)
                                    }
                                >
                                    <Plus className="w-3 h-3 mr-1" /> 追加
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="ghost"
                        onClick={() => setIsGiftOpen(false)}
                    >
                        キャンセル
                    </Button>
                    <Button
                        className="bg-pink-500 hover:bg-pink-600 text-white"
                        onClick={() => {
                            if (giftForm.id) {
                                mutation.updateGift.mutate(giftForm);
                            } else {
                                mutation.createGift.mutate(giftForm);
                            }
                            setIsGiftOpen(false);
                        }}
                    >
                        保存
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default GiftEditDialog;
