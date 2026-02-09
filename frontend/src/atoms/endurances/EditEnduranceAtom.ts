import { Chunk } from "effect";
import { atom } from "jotai";

import { editTitleAtom } from "../projects/EditTitleAtom";

import { editTargetCountAtom } from "./EditTargetCountAtom";

import type { UpdateEnduranceProjectArgs } from "@/domain/endurances/rpcs/UpdateEnduranceProject";

export type EditEnduranceState = Omit<UpdateEnduranceProjectArgs, "id">;

export const editEnduranceAtom = atom<Omit<UpdateEnduranceProjectArgs, "id">>(
    (get) => {
        return {
            title: get(editTitleAtom),
            target_count: get(editTargetCountAtom),
            rescue_actions: Chunk.empty(),
            sabotage_actions: Chunk.empty(),
        };
    },
);

export const initEditEnduranceAtom = atom(
    null,
    (_get, set, initial: EditEnduranceState) => {
        set(editTitleAtom, initial.title);
        set(editTargetCountAtom, initial.target_count);
    },
);
