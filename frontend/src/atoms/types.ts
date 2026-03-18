import type { Option } from "effect";

export type EditState<T> = {
    input: string;
    valid: Option.Option<T>;
    error: string | null;
};
