import ProjectGroup from "./ProjectGroup";

import { useFetchProjectForSideBar } from "@/hooks/projects/useFetchProjectForSideBar";

type Props = {
    toggleSidebar: () => void;
};

const ProjectSideBarLayout = ({ toggleSidebar }: Props) => {
    const { data } = useFetchProjectForSideBar();

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
