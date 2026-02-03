import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { EnduranceProjectView } from "@/domain/endurances/views/EnduranceProjectView";
import { updateEnduranceProject } from "@/use-cases/updateEnduranceProject";

export const useUpdateEnduranceProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateEnduranceProject,
        onSuccess: ({ id, title, target_count }) => {
            queryClient.setQueryData<EnduranceProjectView>(
                ["project", id],
                (oldData) => {
                    return (
                        oldData && {
                            ...oldData,
                            title,
                            target_count,
                        }
                    );
                },
            );
        },
    });
};
