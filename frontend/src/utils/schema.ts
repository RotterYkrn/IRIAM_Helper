import { ParseResult, Schema } from "effect";

export type ChunkInfer<S> = S extends Schema.Chunk<infer A> ? A : never;

export type RecursiveReadonly<T> = T extends object
    ? { readonly [K in keyof T]: RecursiveReadonly<T[K]> }
    : T;

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

export const mapFrom =
    <Key extends string>(fromKey: Key) =>
    <A, I, R>(self: Schema.Schema<A, I, R>) =>
        Schema.propertySignature(self).pipe(Schema.fromKey(fromKey));
