import { useQuery } from "@tanstack/react-query";
import { Effect } from "effect";

import { fetchProjectsByStatus } from "@/use-cases/projects/fetchProjectByStatus";

export const useFetchProjectForSideBar = () => {
    return useQuery({
        queryKey: ["projects"],
        queryFn: async () => {
            try {
                return await Effect.runPromise(fetchProjectsByStatus());
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
    });
};
