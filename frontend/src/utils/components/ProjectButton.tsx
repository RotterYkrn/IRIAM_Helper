import type React from "react";

import { Button } from "@/components/ui/button";

/**
 * 以下の企画全体操作のための汎用ボタン
 * [編集, 保存, キャンセル, 削除, コピー, 企画開始, 企画終了]
 * @param props 標準のHTMLボタンの全プロパティを継承します
 * @param props.className 背景色を指定します（通常時、ホバー時）
 */
const ProjectButton = ({
    children,
    ...props
}: React.ComponentPropsWithoutRef<"button">) => {
    return <Button {...props}>{children}</Button>;
};

export default ProjectButton;
