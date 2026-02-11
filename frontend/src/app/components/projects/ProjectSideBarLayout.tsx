import ProjectGroup from "./ProjectGroup";

import { useFetchProjectForSideBar } from "@/hooks/projects/useFetchProjectForSideBar";

type Props = {
    toggleSidebar: () => void;
};

const ProjectSideBarLayout = ({ toggleSidebar }: Props) => {
    const { data, isLoading } = useFetchProjectForSideBar();

    if (isLoading) {
        return <div>読み込み中...</div>;
    }

    if (!data) {
        return <div>企画情報の取得に失敗しました</div>;
    }

    const { active, scheduled, finished } = data;

    return (
        <>
            <ProjectGroup
                title="開催中の企画"
                projects={active}
                toggleSidebar={toggleSidebar}
            />
            <ProjectGroup
                title="開催予定の企画"
                projects={scheduled}
                toggleSidebar={toggleSidebar}
            />
            <ProjectGroup
                title="過去の企画"
                projects={finished}
                toggleSidebar={toggleSidebar}
            />
        </>
    );
};

export default ProjectSideBarLayout;
