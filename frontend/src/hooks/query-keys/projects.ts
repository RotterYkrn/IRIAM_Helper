import type { ProjectSchema } from "@/domain/projects/tables/Project";

export const ProjectKey = {
    /** 企画一覧 */
    list: ["projects"] as const,
    /**
     * 各企画の情報
     * @param projectId 企画ID
     * @returns QueryKey `["project", projectId]`
     */
    detail: (projectId: typeof ProjectSchema.Encoded.id) =>
        ["project", projectId] as const,
};
