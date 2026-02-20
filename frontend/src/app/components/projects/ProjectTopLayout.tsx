import ProjectTopGroup from "./ProjectTopGroup";

import { useFetchProjectForSideBar } from "@/hooks/projects/useFetchProjectForSideBar";

const ProjectTopLayout = () => {
    const { data, isLoading } = useFetchProjectForSideBar();

    if (!data) {
        return <div>企画情報の取得に失敗しました</div>;
    }

    const { active, scheduled, finished } = data;

    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <ProjectTopGroup
                isLoading={isLoading}
                title="開催中の企画"
                projects={active}
            />
            <ProjectTopGroup
                isLoading={isLoading}
                title="開催予定の企画"
                projects={scheduled}
            />
            <ProjectTopGroup
                isLoading={isLoading}
                title="過去の企画"
                projects={finished}
            />
        </div>
    );
};

export default ProjectTopLayout;
