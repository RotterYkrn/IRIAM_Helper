import CreateProjectButton from "../components/projects/CreateProjectButton";
import ProjectTopLayout from "../components/projects/ProjectTopLayout";

const TopPage = () => {
    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <h1 className="text-3xl font-bold">企画一覧</h1>
            <div className="flex w-150 justify-end">
                <CreateProjectButton toggleSidebar={() => {}} />
            </div>
            <ProjectTopLayout />
        </div>
    );
};

export default TopPage;
