import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { GiftDto } from "@/domain/gifts/dto/GiftDto";
import { useGiftMutation } from "@/hooks/gifts/useGiftMutation";
import { useGiftQuery } from "@/hooks/gifts/useGiftQuery";
import { Chunk } from "effect";
import { Edit2, Trash2 } from "lucide-react";

type Props = {
    setIsGiftOpen: (value: boolean) => void;
    setGiftForm: (giftForm: GiftDto) => void;
};

const GiftList = ({ setIsGiftOpen, setGiftForm }: Props) => {
    const { gifts, categories } = useGiftQuery();
    const mutation = useGiftMutation();

    if (gifts.length === 0) {
        return (
            <p className="p-6 text-center text-gray-400">
                ギフトが未登録です。
            </p>
        );
    }

    return (
        <Table>
            <TableHeader className="bg-pink-50/50">
                <TableRow>
                    <TableHead className="w-45">ギフト名</TableHead>
                    <TableHead className="w-25">ニックネーム</TableHead>
                    <TableHead className="w-30 text-right">
                        ポイント数
                    </TableHead>
                    <TableHead className="w-30">カテゴリー</TableHead>
                    <TableHead className="text-center">操作</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Chunk.map(gifts, (gift) => (
                    <TableRow
                        key={gift.id}
                        className="hover:bg-pink-50/30"
                    >
                        {/* ギフト名 */}
                        <TableCell className="font-bold text-gray-800">
                            {gift.name}
                        </TableCell>

                        {/* ニックネーム */}
                        <TableCell className="text-sm text-gray-500">
                            {gift.nick_name || "-"}
                        </TableCell>

                        {/* ポイント数 */}
                        <TableCell className="text-right">
                            <Badge
                                variant="secondary"
                                className="bg-pink-100 text-pink-800
                                    font-semibold whitespace-nowrap"
                            >
                                {gift.point} pt
                            </Badge>
                        </TableCell>

                        {/* カテゴリー（複数） */}
                        <TableCell>
                            <div className="flex flex-wrap gap-1">
                                {Chunk.map(gift.category_ids, (catId) => {
                                    const cat = Chunk.findFirst(
                                        categories,
                                        (c) => c.id === catId,
                                    );
                                    return cat._tag === "Some" ? (
                                        <Badge
                                            key={catId}
                                            variant="outline"
                                            className="border-pink-200 bg-white
                                                text-pink-600 px-1.5 py-0
                                                whitespace-nowrap"
                                        >
                                            {cat.value.name}
                                        </Badge>
                                    ) : null;
                                })}
                            </div>
                        </TableCell>

                        {/* 操作ボタン */}
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-500
                                        hover:text-pink-600"
                                    onClick={() => {
                                        setGiftForm(gift);
                                        setIsGiftOpen(true);
                                    }}
                                >
                                    <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-500
                                        hover:text-red-600"
                                    onClick={() =>
                                        mutation.deleteGift.mutate(gift.id)
                                    }
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default GiftList;
