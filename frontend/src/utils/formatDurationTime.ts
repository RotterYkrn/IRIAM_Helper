import { pipe } from "effect";

export const formatDurationTime = (minutes: number) =>
    pipe(
        minutes,
        (min) => ({
            hours: Math.floor(min / 60),
            minutes: min % 60,
        }),
        ({ hours, minutes }) =>
            `${hours}時間${minutes.toString().padStart(2, "0")}分`,
    );
