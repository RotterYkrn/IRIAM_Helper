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
import {
    GiftCategory,
    GiftCategoryId,
    GiftCategoryName,
} from "@/domain/gifts/tables/Categories";
import { useGiftMutation } from "@/hooks/gifts/useGiftMutation";
import { useGiftQuery } from "@/hooks/gifts/useGiftQuery";
import { Chunk, Either, pipe, Schema } from "effect";
import { Check, Edit2, FolderPlus, Settings2, Trash2, X } from "lucide-react";
import { useState } from "react";

const CategoryListDialog = () => {
    const { categories } = useGiftQuery();
    const mutation = useGiftMutation();

    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    // 新規追加用のインプット用State
    const [newCategoryName, setNewCategoryName] = useState("");

    // ダイアログ内で「どのカテゴリをインライン編集しているか」を保持するState
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
        null,
    );
    const [editingCategoryName, setEditingCategoryName] = useState("");

    // --- ハンドラー ---
    const handleCreate = () => {
        pipe(
            newCategoryName,
            Schema.decodeEither(GiftCategoryName),
            Either.match({
                onLeft: () => {},
                onRight: (name) => {
                    mutation.createCategory.mutate(name);
                    setNewCategoryName("");
                },
            }),
        );
    };

    const handleUpdateSave = (id: GiftCategoryId) => {
        pipe(
            { id, name: editingCategoryName },
            Schema.decodeEither(GiftCategory),
            Either.match({
                onLeft: () => {},
                onRight: ({ id, name }) => {
                    mutation.updateCategory.mutate({ id, name });
                    setEditingCategoryId(null);
                    setEditingCategoryName("");
                },
            }),
        );
    };

    const handleEditStart = (cat: GiftCategory) => {
        setEditingCategoryId(cat.id);
        setEditingCategoryName(cat.name);
    };

    return (
        <Dialog
            open={isCategoryOpen}
            onOpenChange={setIsCategoryOpen}
        >
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                    className="border-pink-300 text-pink-700 hover:bg-pink-50
                        gap-1.5"
                >
                    <Settings2 className="w-4 h-4" />
                    カテゴリ編集
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>カテゴリの管理</DialogTitle>
                </DialogHeader>

                {/* 1. 新規追加フォームエリア */}
                <div
                    className="flex items-center gap-2 py-2 border-b
                        border-gray-100"
                >
                    <Input
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="新しいカテゴリ名を入力..."
                        className="flex-1"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleCreate();
                        }}
                    />
                    <Button
                        size="sm"
                        className="bg-pink-500 hover:bg-pink-600 text-white
                            gap-1"
                        onClick={handleCreate}
                    >
                        <FolderPlus className="w-4 h-4" />
                        追加
                    </Button>
                </div>

                {/* 2. カテゴリ一覧・編集エリア */}
                <div className="max-h-75 overflow-y-auto py-2 space-y-1">
                    {categories.length === 0 ? (
                        <p className="text-center text-gray-400 text-sm py-6">
                            登録されているカテゴリがありません。
                        </p>
                    ) : (
                        // 💡 元のコード構造に合わせて、Chunk.map のまま処理可能な構造
                        Chunk.map(categories, (cat) => {
                            const isEditing = editingCategoryId === cat.id;
                            return (
                                <div
                                    key={cat.id}
                                    className="flex items-center justify-between
                                        p-2 rounded-md hover:bg-gray-50/80
                                        transition-colors"
                                >
                                    {isEditing ? (
                                        /* ✏️ 編集モード表示 */
                                        <div
                                            className="flex items-center gap-2
                                                flex-1 mr-2"
                                        >
                                            <Input
                                                size={1}
                                                value={editingCategoryName}
                                                onChange={(e) =>
                                                    setEditingCategoryName(
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-8 py-1 px-2 text-sm
                                                    flex-1
                                                    focus-visible:ring-pink-500"
                                                autoFocus
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter")
                                                        handleUpdateSave(
                                                            cat.id,
                                                        );
                                                }}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8
                                                    text-green-600
                                                    hover:bg-green-50"
                                                onClick={() =>
                                                    handleUpdateSave(cat.id)
                                                }
                                            >
                                                <Check className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-gray-400
                                                    hover:bg-gray-100"
                                                onClick={() =>
                                                    setEditingCategoryId(null)
                                                }
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        /* 📄 通常モード表示 */
                                        <>
                                            <span
                                                className="text-sm font-medium
                                                    text-gray-700"
                                            >
                                                # {cat.name}
                                            </span>
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8
                                                        text-gray-400
                                                        hover:text-pink-600"
                                                    onClick={() =>
                                                        handleEditStart(cat)
                                                    }
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8
                                                        text-gray-400
                                                        hover:text-red-600"
                                                    onClick={() => {
                                                        if (
                                                            !confirm(
                                                                `カテゴリ「${cat.name}」を削除しますか？`,
                                                            )
                                                        ) {
                                                            return;
                                                        }
                                                        mutation.deleteCategory.mutate(
                                                            cat.id,
                                                        );
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                <DialogFooter className="border-t border-gray-100 pt-3">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setIsCategoryOpen(false)}
                    >
                        閉じる
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CategoryListDialog;
