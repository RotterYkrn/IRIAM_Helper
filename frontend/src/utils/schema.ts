import { ParseResult, Schema } from "effect";

/**
 * オブジェクトの各プロパティを再帰的にreadonlyにします。\
 * 配列が含まれるSchemaの型定義に、既存のオブジェクト型を利用したいときに使います。
 */
export type RecursiveReadonly<T> = T extends object
    ? { readonly [K in keyof T]: RecursiveReadonly<T[K]> }
    : T;

/**
 * decode前がnullableのプロパティに対して、nullでないことを保証するSchemaを作成します。
 * @param self 変換前のSchema
 * @returns nullチェックを追加したSchema
 */
export const withStrictNullCheck = <A, I, R>(self: Schema.Schema<A, I, R>) =>
    Schema.transformOrFail(
        Schema.Union(Schema.encodedSchema(self), Schema.Null),
        Schema.encodedSchema(self),
        {
            decode: (s, _, ast) => {
                if (s === null) {
                    return ParseResult.fail(
                        new ParseResult.Type(
                            ast,
                            s,
                            "このフィールドは null にできません",
                        ),
                    );
                }
                return ParseResult.succeed(s);
            },
            encode: (s) => ParseResult.succeed(s),
        },
    ).pipe(Schema.compose(self));

/**
 * propertySignatureを通してfromKeyを付与する操作をまとめて行います。
 * @param fromKey decode前のプロパティ名
 * @returns decode前のプロパティ名を追加したSchemaを返す関数
 */
export const mapFrom =
    <Key extends string>(fromKey: Key) =>
    <A, I, R>(self: Schema.Schema<A, I, R>) =>
        Schema.propertySignature(self).pipe(Schema.fromKey(fromKey));
