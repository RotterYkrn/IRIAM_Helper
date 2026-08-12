import { Provider } from "jotai";

import GiftCategoryEnduranceProjectLayout from "../components/gift-category-endurances/GiftCategoryEnduranceProjectLayout";

import { ProjectProvider } from "@/contexts/projects/ProjectProvider";
import { useProjectId } from "@/hooks/projects/useProjectId";

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
