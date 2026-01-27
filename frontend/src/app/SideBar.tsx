import { useQuery } from "@tanstack/react-query";

import CreateProjectButton from "./CreateProjectButton";
import ProjectGroup from "./ProjectGroup";

import { fetchProjectsByStatus } from "@/use-cases/fetchProjectByStatus";

type SideBarProps = {
    open: boolean;
    onToggle: () => void;
};

const SideBar = ({ open, onToggle }: SideBarProps) => {
    const { data, isLoading } = useQuery({
        queryKey: ["projects"],
        queryFn: fetchProjectsByStatus,
    });

    if (isLoading) {
        return <div>loading...</div>;
    }

    if (!data) {
        return <div>error</div>;
    }

    const { active, scheduled, finished } = data;

    return (
        <aside
            className={`fixed top-0 left-0 h-screen overflow-hidden border-r
                border-black transition-[width] duration-300 ease-in-out
                ${open ? "w-70" : "w-0"} `}
        >
            <div>
                <div
                    className="flex h-12 border-b bg-pink-200 items-center
                        justify-start px-2"
                >
                    <button
                        onClick={onToggle}
                        className="flex h-8 w-8 items-center justify-center
                            rounded-md transition hover:bg-pink-100"
                    >
                        ×
                    </button>
                </div>

                <div className="h-full w-70 flex-1 space-y-4 p-2">
                    <CreateProjectButton />

                    <>
                        <ProjectGroup
                            title="開催中の企画"
                            projects={active}
                        />
                        <ProjectGroup
                            title="開催予定の企画"
                            projects={scheduled}
                        />
                        <ProjectGroup
                            title="過去の企画"
                            projects={finished}
                        />
                    </>
                </div>
            </div>
        </aside>
    );
};

export default SideBar;
