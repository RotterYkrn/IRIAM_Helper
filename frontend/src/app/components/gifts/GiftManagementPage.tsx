import React, { useState } from "react";
import { Chunk } from "effect";
import {
    Plus,
    Edit2,
    Trash2,
    FolderPlus,
    Download,
    Upload,
    Check,
    Settings2,
    X,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";

// ==========================================
// 🔌 カスタムフック（データ操作用ダミー）
// ==========================================
const useGiftQuery = () => {
    // 本来は Supabase からギフト＋所属カテゴリの配列を JOIN して取得する想定
    return {
        gifts: Chunk.fromIterable([
            {
                id: "1",
                name: "ひらめいた！",
                nick_name: "ひらめき",
                point: 10,
                category_ids: [1, 2],
            },
            {
                id: "2",
                name: "いいね！",
                nick_name: "",
                point: 5,
                category_ids: [1],
            },
        ]),
        categories: Chunk.fromIterable([
            { id: 1, name: "定番" },
            { id: 2, name: "プチギフ" },
            { id: 3, name: "イベント" },
        ]),
        isLoading: false,
    };
};

type Category = {
    id: number;
    name: string;
};

const useGiftMutation = () => {
    return {
        createGift: {
            mutate: async (data: any) => console.log("Create Gift", data),
        },
        updateGift: {
            mutate: async (id: string, data: any) =>
                console.log("Update Gift", id, data),
        },
        deleteGift: {
            mutate: async (id: string) => console.log("Delete Gift", id),
        },
        createCategory: {
            mutate: async (data: any) => console.log("Create Category", data),
        },
        updateCategory: {
            mutate: async (id: number, data: any) =>
                console.log("Update Category", id, data),
        },
        deleteCategory: {
            mutate: async (id: number) => console.log("Delete Category", id),
        },
        updateMappings: {
            mutate: async (giftId: string, categoryIds: number[]) =>
                console.log("Update Mappings", giftId, categoryIds),
        },
        importData: {
            mutate: async (data: any) => console.log("Import Data", data),
        },
    };
};

// ==========================================
// 🎨 コンポーネント本体
// ==========================================
const GiftManagementPage = () => {
    const { gifts, categories } = useGiftQuery();
    const mutation = useGiftMutation();

    // 状態管理（フォーム用）
    const [giftForm, setGiftForm] = useState({
        id: "",
        name: "",
        nick_name: "",
        point: 0,
        category_ids: [] as number[],
    });

    // ダイアログ開閉管理
    const [isGiftOpen, setIsGiftOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    // 新規カテゴリ作成用の簡易状態
    const [isAddingQuickCategory, setIsAddingQuickCategory] = useState(false);
    const [quickCategoryName, setQuickCategoryName] = useState("");

    // 新規追加用のインプット用State
    const [newCategoryName, setNewCategoryName] = useState("");

    // ダイアログ内で「どのカテゴリをインライン編集しているか」を保持するState
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
        null,
    );
    const [editingCategoryName, setEditingCategoryName] = useState("");

    // --- ハンドラー ---
    const handleCreate = () => {
        if (!newCategoryName.trim()) return;
        mutation.createCategory.mutate({ name: newCategoryName });
        setNewCategoryName("");
    };

    const handleUpdateSave = (id: number) => {
        if (!editingCategoryName.trim()) return;
        mutation.updateCategory.mutate(id, { name: editingCategoryName });
        setEditingCategoryId(null);
    };

    const handleEditStart = (cat: Category) => {
        setEditingCategoryId(cat.id);
        setEditingCategoryName(cat.name);
    };

    // カテゴリ追加ハンドラ（ギフト編集中の動線を想定）
    const handleQuickAddCategory = async () => {
        if (!quickCategoryName) return;

        // 1. カテゴリ作成（実際はここでmutationを呼び出し、新しいIDを取得する）
        await mutation.createCategory.mutate({ name: quickCategoryName });

        // 2. 状態のリセット
        setQuickCategoryName("");
        setIsAddingQuickCategory(false);
        // 本来はここでリストを再取得（または楽観的更新）
    };

    // エクスポート処理
    const handleExport = () => {
        const dataStr =
            "data:text/json;charset=utf-8," +
            encodeURIComponent(
                JSON.stringify(Chunk.toReadonlyArray(gifts), null, 2),
            );
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "iriam_gifts_export.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    };

    // インポート処理
    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileReader = new FileReader();
        if (e.target.files && e.target.files[0]) {
            fileReader.readAsText(e.target.files[0], "UTF-8");
            fileReader.onload = (event) => {
                try {
                    const parsed = JSON.parse(event.target?.result as string);
                    mutation.importData.mutate(parsed);
                    alert(
                        "インポートが完了しました（コンソールを確認してください）",
                    );
                } catch (err) {
                    alert("JSONファイルの解析に失敗しました。");
                }
            };
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            {/* ヘッダーエリア */}
            <div
                className="flex flex-col sm:flex-row justify-between items-start
                    sm:items-center gap-4 border-b border-pink-100 pb-4"
            >
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        IRIAM ギフト・カテゴリ管理
                    </h1>
                    <p className="text-sm text-gray-500">
                        ギフトマスタのCRUD、カテゴリ割り当て、データ入出力を行います。
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="border-pink-200 text-pink-700
                            hover:bg-pink-50"
                        asChild
                    >
                        <span>
                            <Upload className="w-4 h-4 mr-2" /> インポート
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                className="hidden"
                            />
                        </span>
                    </Button>
                    <Button
                        variant="outline"
                        className="border-pink-200 text-pink-700
                            hover:bg-pink-50"
                        onClick={handleExport}
                    >
                        <Download className="w-4 h-4 mr-2" /> エクスポート
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. ギフト一覧・編集セクション */}
                <Card className="lg:col-span-2 border-pink-200 shadow">
                    <CardHeader
                        className="bg-pink-50/50 flex flex-row py-3 px-4 gap-4"
                    >
                        <CardTitle
                            className="text-lg font-bold text-gray-700
                                whitespace-nowrap shrink-0"
                        >
                            ギフト一覧
                        </CardTitle>
                        <Dialog
                            open={isGiftOpen}
                            onOpenChange={setIsGiftOpen}
                        >
                            <DialogTrigger asChild>
                                <Button
                                    size="sm"
                                    className="bg-pink-500 hover:bg-pink-600
                                        text-white"
                                    onClick={() =>
                                        setGiftForm({
                                            id: "",
                                            name: "",
                                            nick_name: "",
                                            point: 0,
                                            category_ids: [],
                                        })
                                    }
                                >
                                    <Plus className="w-4 h-4 mr-1" /> ギフト追加
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        {giftForm.id
                                            ? "ギフト編集"
                                            : "新しいギフトを追加"}
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
                                                    name: e.target.value,
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
                                            value={giftForm.nick_name}
                                            onChange={(e) =>
                                                setGiftForm({
                                                    ...giftForm,
                                                    nick_name: e.target.value,
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
                                                    point: Number(
                                                        e.target.value,
                                                    ),
                                                })
                                            }
                                            placeholder="例: 10"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="text-sm font-medium block
                                                mb-2"
                                        >
                                            所属カテゴリ（複数選択可）
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {Chunk.map(categories, (cat) => {
                                                const isSelected =
                                                    giftForm.category_ids.includes(
                                                        cat.id,
                                                    );
                                                return (
                                                    <Badge
                                                        key={cat.id}
                                                        variant={
                                                            isSelected
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        className={`cursor-pointer
                                                        px-3 py-1 text-xs
                                                        ${isSelected ? "bg-pink-500 hover:bg-pink-600" : "border-pink-200 text-pink-700"}`}
                                                        onClick={() => {
                                                            const next =
                                                                isSelected
                                                                    ? giftForm.category_ids.filter(
                                                                          (
                                                                              id,
                                                                          ) =>
                                                                              id !==
                                                                              cat.id,
                                                                      )
                                                                    : [
                                                                          ...giftForm.category_ids,
                                                                          cat.id,
                                                                      ];
                                                            setGiftForm({
                                                                ...giftForm,
                                                                category_ids:
                                                                    next,
                                                            });
                                                        }}
                                                    >
                                                        {cat.name}
                                                    </Badge>
                                                );
                                            })}
                                            {/* ＋ 新規カテゴリボタン */}
                                            {isAddingQuickCategory ? (
                                                <div
                                                    className="flex gap-1
                                                        items-center"
                                                >
                                                    <Input
                                                        size={10}
                                                        className="h-7 w-24
                                                            text-xs"
                                                        value={
                                                            quickCategoryName
                                                        }
                                                        onChange={(e) =>
                                                            setQuickCategoryName(
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="名前..."
                                                        autoFocus
                                                    />
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-7 px-2"
                                                        onClick={
                                                            handleQuickAddCategory
                                                        }
                                                    >
                                                        OK
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-7 px-2
                                                        border-dashed
                                                        text-gray-500"
                                                    onClick={() =>
                                                        setIsAddingQuickCategory(
                                                            true,
                                                        )
                                                    }
                                                >
                                                    <Plus
                                                        className="w-3 h-3 mr-1"
                                                    />{" "}
                                                    追加
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
                                        className="bg-pink-500 hover:bg-pink-600
                                            text-white"
                                        onClick={() => {
                                            giftForm.id
                                                ? mutation.updateGift.mutate(
                                                      giftForm.id,
                                                      giftForm,
                                                  )
                                                : mutation.createGift.mutate(
                                                      giftForm,
                                                  );
                                            setIsGiftOpen(false);
                                        }}
                                    >
                                        保存
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent className="p-0 divide-y divide-pink-100">
                        {giftForm.name === "" && gifts.length === 0 ? (
                            <p className="p-6 text-center text-gray-400">
                                ギフトが未登録です。
                            </p>
                        ) : (
                            Chunk.map(gifts, (gift) => (
                                <div
                                    key={gift.id}
                                    className="p-4 flex justify-between
                                        items-center hover:bg-pink-50/30
                                        transition-colors"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="font-bold
                                                    text-gray-800"
                                            >
                                                {gift.name}
                                            </span>
                                            {gift.nick_name && (
                                                <span
                                                    className="text-xs
                                                        text-gray-400"
                                                >
                                                    ({gift.nick_name})
                                                </span>
                                            )}
                                            <Badge
                                                variant="secondary"
                                                className="bg-pink-100
                                                    text-pink-800 font-semibold"
                                            >
                                                {gift.point} pt
                                            </Badge>
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {gift.category_ids.map((catId) => {
                                                const cat = Chunk.findFirst(
                                                    categories,
                                                    (c) => c.id === catId,
                                                );
                                                return cat._tag === "Some" ? (
                                                    <Badge
                                                        key={catId}
                                                        variant="outline"
                                                        className="text-[10px]
                                                            border-pink-200
                                                            bg-white
                                                            text-pink-600 px-1.5
                                                            py-0"
                                                    >
                                                        {cat.value.name}
                                                    </Badge>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
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
                                                mutation.deleteGift.mutate(
                                                    gift.id,
                                                )
                                            }
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* カテゴリ管理ダイアログのトリガー */}
                <Dialog
                    open={isCategoryOpen}
                    onOpenChange={setIsCategoryOpen}
                >
                    <DialogTrigger asChild>
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-pink-300 text-pink-700
                                hover:bg-pink-50 gap-1.5"
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
                                onChange={(e) =>
                                    setNewCategoryName(e.target.value)
                                }
                                placeholder="新しいカテゴリ名を入力..."
                                className="flex-1"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleCreate();
                                }}
                            />
                            <Button
                                size="sm"
                                className="bg-pink-500 hover:bg-pink-600
                                    text-white gap-1"
                                onClick={handleCreate}
                            >
                                <FolderPlus className="w-4 h-4" />
                                追加
                            </Button>
                        </div>

                        {/* 2. カテゴリ一覧・編集エリア */}
                        <div className="max-h-75 overflow-y-auto py-2 space-y-1">
                            {categories.length === 0 ? (
                                <p
                                    className="text-center text-gray-400 text-sm
                                        py-6"
                                >
                                    登録されているカテゴリがありません。
                                </p>
                            ) : (
                                // 💡 元のコード構造に合わせて、Chunk.map のまま処理可能な構造
                                Chunk.map(categories, (cat) => {
                                    const isEditing =
                                        editingCategoryId === cat.id;
                                    return (
                                        <div
                                            key={cat.id}
                                            className="flex items-center
                                                justify-between p-2 rounded-md
                                                hover:bg-gray-50/80
                                                transition-colors"
                                        >
                                            {isEditing ? (
                                                /* ✏️ 編集モード表示 */
                                                <div
                                                    className="flex items-center
                                                        gap-2 flex-1 mr-2"
                                                >
                                                    <Input
                                                        size={1}
                                                        value={
                                                            editingCategoryName
                                                        }
                                                        onChange={(e) =>
                                                            setEditingCategoryName(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="h-8 py-1 px-2
                                                            text-sm flex-1
                                                            focus-visible:ring-pink-500"
                                                        autoFocus
                                                        onKeyDown={(e) => {
                                                            if (
                                                                e.key ===
                                                                "Enter"
                                                            )
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
                                                            handleUpdateSave(
                                                                cat.id,
                                                            )
                                                        }
                                                    >
                                                        <Check className="w-4
                                                            h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8
                                                            text-gray-400
                                                            hover:bg-gray-100"
                                                        onClick={() =>
                                                            setEditingCategoryId(
                                                                null,
                                                            )
                                                        }
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                /* 📄 通常モード表示 */
                                                <>
                                                    <span
                                                        className="text-sm
                                                            font-medium
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
                                                                handleEditStart(
                                                                    cat,
                                                                )
                                                            }
                                                        >
                                                            <Edit2
                                                                className="w-4
                                                                    h-4"
                                                            />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8
                                                                text-gray-400
                                                                hover:text-red-600"
                                                            onClick={() =>
                                                                mutation.deleteCategory.mutate(
                                                                    cat.id,
                                                                )
                                                            }
                                                        >
                                                            <Trash2
                                                                className="w-4
                                                                    h-4"
                                                            />
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
            </div>
        </div>
    );
};

export default GiftManagementPage;
