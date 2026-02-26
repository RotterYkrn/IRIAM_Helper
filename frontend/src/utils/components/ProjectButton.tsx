import type React from "react";

/**
 * 以下の企画全体操作のための汎用ボタン
 * [編集, 保存, キャンセル, 削除, コピー, 企画開始, 企画終了]
 * @param props 標準のHTMLボタンの全プロパティを継承します
 * @param props.className 背景色を指定します（通常時、ホバー時）
 */
const ProjectButton = ({
    children,
    className,
    ...props
}: React.ComponentPropsWithoutRef<"button">) => {
    return (
        <button
            {...props}
            className={`rounded px-4 py-2 text-white active:scale-95
                disabled:opacity-50 disabled:active:scale-100
                disabled:cursor-not-allowed cursor-pointer ${className ?? ""}`}
        >
            {children}
        </button>
    );
};

export default ProjectButton;
