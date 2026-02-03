import { atom } from "jotai";

import type { EnduranceSettingsSchema } from "@/domain/endurances/EnduranceSettings";

export type EditEnduranceSettingsState = {
    targetCount: typeof EnduranceSettingsSchema.Type.target_count;
};

export const editEnduranceSettingsAtom = atom<EditEnduranceSettingsState>({
    targetCount: 0,
});

export const initializeEditEnduranceSettingsAtom = atom(
    null,
    (_get, set, initial: EditEnduranceSettingsState) => {
        set(editEnduranceSettingsAtom, {
            targetCount: initial.targetCount,
        });
    },
);
