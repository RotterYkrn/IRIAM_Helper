import { Chunk, Either, pipe, Schema } from "effect";
import { Download, Upload } from "lucide-react";
import React, { useRef, useState } from "react";

import CategoryListDialog from "./CategoryListDialog";
import GiftEditDialog from "./GiftEditDialog";
import GiftList from "./GiftList";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { GiftDto } from "@/domain/gifts/dto/GiftDto";
import { ImportExportGiftArgs } from "@/domain/gifts/rpc/ImportExportGift";
import { GiftCategoryId } from "@/domain/gifts/tables/Categories";
import { GiftId, GiftName, GiftPoint } from "@/domain/gifts/tables/Gifts";
import { useGiftMutation } from "@/hooks/gifts/useGiftMutation";
import { useGiftQuery } from "@/hooks/gifts/useGiftQuery";


const GiftManagementPage = () => {
    const { gifts, categories, mappings } = useGiftQuery();
    const mutation = useGiftMutation();

    // 状態管理（フォーム用）
    const [giftForm, setGiftForm] = useState<GiftDto>({
        id: "" as GiftId,
        name: GiftName.make("V.I.P."),
        nick_name: null,
        point: GiftPoint.make(500),
        category_ids: Chunk.empty<GiftCategoryId>(),
    });

    // ダイアログ開閉管理
    const [isGiftOpen, setIsGiftOpen] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImportButtonClick = () => {
        // ボタンクリックで非表示のinputタグを起動
        fileInputRef.current?.click();
    };

    // --- ハンドラー ---

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

            <div className="flex flex-col gap-4">
                {/* 1. ギフト一覧・編集セクション */}
                <Card className="lg:col-span-2 border-pink-200 shadow gap-4">
                    <CardHeader className="w-120 grid grid-cols-2 px-4 gap-4">
                        <div
                            className="flex items-start text-lg font-bold
                                text-gray-700 whitespace-nowrap shrink-0"
                        >
                            ギフト一覧
                        </div>
                        <div className="flex flex-row gap-2">
                            <GiftEditDialog
                                isGiftOpen={isGiftOpen}
                                setIsGiftOpen={setIsGiftOpen}
                                giftForm={giftForm}
                                setGiftForm={setGiftForm}
                            />
                            <CategoryListDialog />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <GiftList
                            setIsGiftOpen={setIsGiftOpen}
                            setGiftForm={setGiftForm}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default GiftManagementPage;
