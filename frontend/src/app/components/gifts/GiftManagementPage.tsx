import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import type { CreateGiftArgs } from "@/domain/gifts/rpc/CreateGift";
import { ImportExportGiftArgs } from "@/domain/gifts/rpc/ImportExportGift";
import type { UpdateGiftArgs } from "@/domain/gifts/rpc/UpdateGift";
import {
    GiftCategory,
    GiftCategoryId,
    GiftCategoryName,
} from "@/domain/gifts/tables/Categories";
import {
    GiftId,
    GiftName,
    GiftNickName,
    GiftPoint,
} from "@/domain/gifts/tables/Gifts";
import { giftKeys } from "@/hooks/query-keys/gifts";
import { runEffectWithThrow } from "@/lib/utils";
import { GiftCategoryMappingRepository } from "@/repositories/gifts/gift-category-mapping.repository";
import { GiftCategoryRepository } from "@/repositories/gifts/gift-category.repository";
import { GiftRepository } from "@/repositories/gifts/gift.repository";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { Chunk, Effect, Either, pipe, Schema } from "effect";
import {
    Check,
    Download,
    Edit2,
    FolderPlus,
    Plus,
    Settings2,
    Trash2,
    Upload,
    X,
} from "lucide-react";
import React, { useRef, useState } from "react";

// ==========================================
// 🔌 カスタムフック（データ操作用ダミー）
// ==========================================
const useGiftQuery = () => {
    const giftsQuery = useQuery({
        queryKey: giftKeys.lists(),
        queryFn: async () => {
            const result = await runEffectWithThrow(
                Effect.gen(function* () {
                    const repository = yield* GiftRepository;
                    return yield* repository.getAll();
                }),
            );
            return result;
        },
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    });

    const categoriesQuery = useQuery({
        queryKey: giftKeys.categories(),
        queryFn: async () => {
            const result = await runEffectWithThrow(
                Effect.gen(function* () {
                    const repository = yield* GiftCategoryRepository;
                    return yield* repository.getAll();
                }),
            );
            return result;
        },
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    });

    const mappingQuery = useQuery({
        queryKey: giftKeys.mappings(),
        queryFn: async () => {
            const result = await runEffectWithThrow(
                Effect.gen(function* () {
                    const repository = yield* GiftCategoryMappingRepository;
                    return yield* repository.getAll();
                }),
            );
            console.log("mappings", result.toJSON());
            return result;
        },
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    });

    // 本来は Supabase からギフト＋所属カテゴリの配列を JOIN して取得する想定
    return {
        gifts: giftsQuery.data ?? Chunk.empty(),
        categories: categoriesQuery.data ?? Chunk.empty(),
        mappings: mappingQuery.data ?? Chunk.empty(),
        isLoading: false,
    };
};

type Category = {
    id: number;
    name: string;
};

const useGiftMutation = () => {
    return {
        createGift: useMutation({
            mutationFn: async (args: CreateGiftArgs) => {
                const result = await runEffectWithThrow(
                    Effect.gen(function* () {
                        const repository = yield* GiftRepository;
                        return yield* repository.create(args);
                    }),
                );
                return result;
            },
            onSuccess: (data, _vars, _onMutateResult, context) => {
                console.log("Create Gift", data);
                context.client.invalidateQueries({
                    queryKey: giftKeys.lists(),
                });
            },
        }),
        updateGift: useMutation({
            mutationFn: async (args: UpdateGiftArgs) => {
                const result = await runEffectWithThrow(
                    Effect.gen(function* () {
                        const repository = yield* GiftRepository;
                        return yield* repository.update(args);
                    }),
                );
                return result;
            },
            onSuccess: (data, _vars, _onMutateResult, context) => {
                console.log("Update Gift", data);
                context.client.invalidateQueries({
                    queryKey: giftKeys.lists(),
                });
            },
        }),
        deleteGift: useMutation({
            mutationFn: async (id: GiftId) => {
                const result = await runEffectWithThrow(
                    Effect.gen(function* () {
                        const repository = yield* GiftRepository;
                        return yield* repository.delete(id);
                    }),
                );
                return result;
            },
            onSuccess: (data, _vars, _onMutateResult, context) => {
                console.log("Delete Gift", data);
                context.client.invalidateQueries({
                    queryKey: giftKeys.lists(),
                });
            },
        }),
        createCategory: useMutation({
            mutationFn: async (name: GiftCategoryName) => {
                const result = await runEffectWithThrow(
                    Effect.gen(function* () {
                        const repository = yield* GiftCategoryRepository;
                        return yield* repository.create(name);
                    }),
                );
                return result;
            },
            onSuccess: (data, _vars, _onMutateResult, context) => {
                console.log("Create Category", data);
                context.client.invalidateQueries({
                    queryKey: giftKeys.categories(),
                });
            },
        }),
        updateCategory: useMutation({
            mutationFn: async ({
                id,
                name,
            }: {
                id: GiftCategoryId;
                name: GiftCategoryName;
            }) => {
                const result = await runEffectWithThrow(
                    Effect.gen(function* () {
                        const repository = yield* GiftCategoryRepository;
                        return yield* repository.update(id, name);
                    }),
                );
                return result;
            },
            onSuccess: (data, _vars, _onMutateResult, context) => {
                console.log("Update Category", data);
                context.client.invalidateQueries({
                    queryKey: giftKeys.categories(),
                });
            },
        }),
        deleteCategory: useMutation({
            mutationFn: async (id: GiftCategoryId) => {
                const result = await runEffectWithThrow(
                    Effect.gen(function* () {
                        const repository = yield* GiftCategoryRepository;
                        return yield* repository.delete(id);
                    }),
                );
                return result;
            },
            onSuccess: (data, _vars, _onMutateResult, context) => {
                console.log("Delete Category", data);
                context.client.invalidateQueries({ queryKey: giftKeys.all });
            },
        }),
        exportData: useMutation({
            mutationFn: async (args: ImportExportGiftArgs) => {
                const backupData = pipe(
                    args,
                    Schema.encodeSync(ImportExportGiftArgs),
                );
                console.log("Backup Data", backupData);

                const blob = new Blob([JSON.stringify(backupData, null, 2)], {
                    type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `iriam_gifts_raw_backup_${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
                a.remove();
            },
        }),
        importData: useMutation({
            mutationFn: async (args: ImportExportGiftArgs) => {
                const result = await runEffectWithThrow(
                    Effect.gen(function* () {
                        const repository = yield* GiftRepository;
                        return yield* repository.import(args);
                    }),
                );
                return result;
            },
            onSuccess: (data, _vars, _onMutateResult, context) => {
                console.log("Import Data", data);
                context.client.invalidateQueries({ queryKey: giftKeys.all });
            },
        }),
    };
};

// ==========================================
// 🎨 コンポーネント本体
// ==========================================
const GiftManagementPage = () => {
    const { gifts, categories, mappings } = useGiftQuery();
    const mutation = useGiftMutation();

    // 状態管理（フォーム用）
    const [giftForm, setGiftForm] = useState<GiftDto>({
        id: "" as GiftId,
        name: GiftName.make("IRIAM"),
        nick_name: null,
        point: GiftPoint.make(1),
        category_ids: Chunk.empty<GiftCategoryId>(),
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

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImportButtonClick = () => {
        // ボタンクリックで非表示のinputタグを起動
        fileInputRef.current?.click();
    };

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

    const handleUpdateSave = (id: number) => {
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

    const handleEditStart = (cat: Category) => {
        setEditingCategoryId(cat.id);
        setEditingCategoryName(cat.name);
    };

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

    // エクスポート処理
    const handleExport = () => {
        mutation.exportData.mutate({ gifts, categories, mappings });
    };

    // インポート処理
    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) {
            console.error("ファイルを選択して下さい");
            return;
        }

        const file = e.target.files[0];

        const reader = new FileReader();
        reader.onload = (event) => {
            pipe(
                JSON.parse(event.target?.result as string),
                Schema.decodeUnknownEither(ImportExportGiftArgs),
                Either.getOrThrowWith(() => {
                    alert("JSONファイルの解析に失敗しました。");
                    return new Error("JSONファイルの解析に失敗しました。");
                }),
                (args) =>
                    mutation.importData.mutate(args, {
                        onSuccess: () => {
                            alert(
                                "インポートが完了しました（コンソールを確認してください）",
                            );
                        },
                        onError: () => {
                            alert("インポートに失敗しました");
                        },
                    }),
            );
        };
        reader.readAsText(file, "UTF-8");
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
                    <input
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        ref={fileInputRef}
                        className="hidden"
                    />
                    <Button
                        variant="outline"
                        className="border-pink-200 text-pink-700
                            hover:bg-pink-50"
                        onClick={handleImportButtonClick}
                    >
                        <Upload className="w-4 h-4 mr-2" /> インポート
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
                                            id: "" as GiftId,
                                            name: GiftName.make("IRIAM"),
                                            nick_name: null,
                                            point: GiftPoint.make(1),
                                            category_ids:
                                                Chunk.empty<GiftCategoryId>(),
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
                                                    name: GiftName.make(
                                                        e.target.value,
                                                    ),
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
                                                        (e.target
                                                            .value as GiftNickName) ||
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
                                        <label
                                            className="text-sm font-medium block
                                                mb-2"
                                        >
                                            所属カテゴリ（複数選択可）
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {Chunk.map(categories, (cat) => {
                                                const isSelected =
                                                    Chunk.contains(
                                                        giftForm.category_ids,
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
                                                                    ? Chunk.filter(
                                                                          giftForm.category_ids,
                                                                          (
                                                                              id,
                                                                          ) =>
                                                                              id !==
                                                                              cat.id,
                                                                      )
                                                                    : Chunk.append(
                                                                          giftForm.category_ids,
                                                                          cat.id,
                                                                      );
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
                                            {Chunk.map(
                                                gift.category_ids,
                                                (catId) => {
                                                    const cat = Chunk.findFirst(
                                                        categories,
                                                        (c) => c.id === catId,
                                                    );
                                                    return cat._tag ===
                                                        "Some" ? (
                                                        <Badge
                                                            key={catId}
                                                            variant="outline"
                                                            className="text-[10px]
                                                                border-pink-200
                                                                bg-white
                                                                text-pink-600
                                                                px-1.5 py-0"
                                                        >
                                                            {cat.value.name}
                                                        </Badge>
                                                    ) : null;
                                                },
                                            )}
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
