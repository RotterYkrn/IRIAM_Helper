import { Suspense } from "react";

import CreateProjectButton from "./projects/CreateProjectButton";
import ProjectSideBarLayout from "./projects/ProjectSideBarLayout";

type SideBarProps = {
    onToggle: () => void;
};

const SideBarLayout = ({ onToggle }: SideBarProps) => {
    return (
        <div>
            <div
                className="flex h-12 bg-pink-200 items-center justify-start
                    px-2"
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
                <CreateProjectButton toggleSidebar={onToggle} />
                <Suspense fallback={<div>読込中...</div>}>
                    <ProjectSideBarLayout toggleSidebar={onToggle} />
                </Suspense>
            </div>
        </div>
    );
};

export default SideBarLayout;
