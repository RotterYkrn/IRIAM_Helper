import { createContext } from "react";

import type { ProjectDtoSchema } from "@/domain/projects/dto/ProjectDto";

/**
 * コンポーネント描画に必要な状態を共有する Context
 */
type ProjectContextType = {
    project: typeof ProjectDtoSchema.Type;
    isEdit: boolean;
    setIsEdit: (v: boolean) => void;
};

const ProjectContext = createContext<ProjectContextType | null>(null);

export default ProjectContext;
