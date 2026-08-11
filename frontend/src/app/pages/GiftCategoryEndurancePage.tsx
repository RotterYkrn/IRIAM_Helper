import { ProjectProvider } from "@/contexts/projects/ProjectProvider";
import { useProjectId } from "@/hooks/projects/useProjectId";
import { Provider } from "jotai";
import GiftCategoryEnduranceProjectLayout from "../components/gift-category-endurances/GiftCategoryEnduranceProjectLayout";

const GiftCategoryEndurancePage = () => {
    const projectId = useProjectId();

    return (
        <Provider>
            <ProjectProvider projectId={projectId}>
                <GiftCategoryEnduranceProjectLayout projectId={projectId} />
            </ProjectProvider>
        </Provider>
    );
};

export default GiftCategoryEndurancePage;
