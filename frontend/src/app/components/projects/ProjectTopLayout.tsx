import ProjectTopGroup from "./ProjectTopGroup";

import { useFetchProjectForSideBar } from "@/hooks/projects/useFetchProjectForSideBar";

const ProjectTopLayout = () => {
    const { data, isLoading } = useFetchProjectForSideBar();

    if (isLoading) {
        return <div>読み込み中...</div>;
    }

    if (!data) {
        return <div>企画情報の取得に失敗しました</div>;
    }

    const { active, scheduled, finished } = data;

    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <ProjectTopGroup
                title="開催中の企画"
                projects={active}
            />
            <ProjectTopGroup
                title="開催予定の企画"
                projects={scheduled}
            />
            <ProjectTopGroup
                title="過去の企画"
                projects={finished}
            />
        </div>
    );
};

export default ProjectTopLayout;
