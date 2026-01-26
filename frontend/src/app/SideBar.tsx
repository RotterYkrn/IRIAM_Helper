import NewProjectButton from "./NewProjectButton";
import ProjectGroup from "./ProjectGroup";

type SideBarProps = {
    open: boolean;
};

const SideBar = ({ open }: SideBarProps) => {
    return (
        <aside
            className={`fixed top-0 left-0 h-screen overflow-hidden border-r
                border-black transition-[width] duration-300 ease-in-out
                ${open ? "w-70" : "w-0"} `}
        >
            <div>
                {/* コンテンツ */}
                <div className="h-full w-70 flex-1 space-y-4 p-2">
                    <NewProjectButton />

                    <>
                        <ProjectGroup
                            title="開催中の企画"
                            projects={["耐久A", "ガチャB"]}
                        />
                        <ProjectGroup
                            title="開催予定の企画"
                            projects={["耐久C"]}
                        />
                        <ProjectGroup
                            title="過去の企画"
                            projects={["耐久X"]}
                        />
                    </>
                </div>
            </div>
        </aside>
    );
};

export default SideBar;
