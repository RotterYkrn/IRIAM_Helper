/**
 * 全角文字を半角数字に変換します
 *
 * @description
 * 次の変換をします。
 * - 全角数字 -> 半角数字
 * - 全角ピリオド、句点 -> 半角ピリオド
 * - その他の文字、2 つ目以降のピリオド -> 削除
 *
 * @param str 変換対象の文字列
 * @returns 変換後の文字列
 */
export const normalizeNumber = (str: string): string => {
    return str
        .replace(/[０-９．]/g, (s) =>
            String.fromCharCode(s.charCodeAt(0) - 0xfee0),
        )
        .replace(/[。]/g, ".")
        .replace(/[^0-9.]/g, "")
        .replace(/(\..*)\./g, "$1");
};
